import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const MEMBERSHIP_PRICES = {
  monthly: { lookupKey: "signe_coach_member_monthly", amount: 499, interval: "month" as const },
  yearly: { lookupKey: "signe_coach_member_yearly", amount: 3900, interval: "year" as const },
};
export const MEMBER_COUPON_ID = "signe-member-1to1";
// Percentage off 1:1 session products for active members. Change here to adjust.
export const MEMBER_SESSION_PERCENT_OFF = 15;

const envSchema = (data: { environment: StripeEnv }) => {
  if (data.environment !== "sandbox" && data.environment !== "live") throw new Error("Invalid environment");
};

async function isAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.rpc("has_role", { _user_id: userId, _role: "admin" });
  return !!data;
}

async function hasMembership(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await (supabaseAdmin as any).rpc("has_membership", { _user_id: userId });
  return !!data;
}

async function customerForUser(
  stripe: ReturnType<typeof createStripeClient>,
  userId: string,
  email?: string,
  create = true,
): Promise<string | null> {
  const found = await stripe.customers.search({ query: `metadata['userId']:'${userId}'`, limit: 1 });
  if (found.data.length) return found.data[0].id;
  if (!create) return null;
  const created = await stripe.customers.create({ ...(email && { email }), metadata: { userId } });
  return created.id;
}

async function userEmail(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.auth.admin.getUserById(userId);
  return data?.user?.email ?? undefined;
}

/** Start an embedded subscription checkout for the signed-in user. */
export const createMembershipCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { plan: "monthly" | "yearly"; returnUrl: string; environment: StripeEnv }) => {
    envSchema(data);
    if (data.plan !== "monthly" && data.plan !== "yearly") throw new Error("Invalid plan");
    if (!data.returnUrl) throw new Error("Missing returnUrl");
    return data;
  })
  .handler(async ({ data, context }) => {
    const stripe = createStripeClient(data.environment);
    const lookupKey = MEMBERSHIP_PRICES[data.plan].lookupKey;
    const prices = await stripe.prices.list({ lookup_keys: [lookupKey], active: true });
    if (!prices.data.length) throw new Error("Membership price is not set up yet");

    const customer = await customerForUser(stripe, context.userId, await userEmail(context.userId));
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      customer: customer ?? undefined,
      line_items: [{ price: prices.data[0].id, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: { metadata: { userId: context.userId } },
      metadata: { userId: context.userId, kind: "membership" },
    });
    return session.client_secret;
  });

/** Stripe-hosted page where members update their card or cancel. */
export const createBillingPortal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { returnUrl: string; environment: StripeEnv }) => {
    envSchema(data);
    if (!data.returnUrl) throw new Error("Missing returnUrl");
    return data;
  })
  .handler(async ({ data, context }) => {
    const stripe = createStripeClient(data.environment);
    const customer = await customerForUser(stripe, context.userId, undefined, false);
    if (!customer) throw new Error("No billing profile yet");
    const portal = await stripe.billingPortal.sessions.create({
      customer,
      return_url: data.returnUrl,
    });
    return portal.url;
  });

/**
 * Checkout for shop products. Active members get a discount on 1:1 session products.
 * The user is taken from the verified login, never from the browser.
 */
export const createProductCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { slug: string; returnUrl: string; environment: StripeEnv }) => {
    envSchema(data);
    if (!/^[a-z0-9-]+$/.test(data.slug)) throw new Error("Invalid slug");
    if (!data.returnUrl) throw new Error("Missing returnUrl");
    return data;
  })
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const stripe = createStripeClient(data.environment);

    const { data: product, error } = await supabaseAdmin
      .from("shop_products")
      .select("slug, kind, name, stripe_price_id")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!product) throw new Error("Product not found");

    const prices = await stripe.prices.list({ lookup_keys: [product.stripe_price_id as string] });
    if (!prices.data.length) throw new Error("Price not found");

    const email = await userEmail(context.userId);
    const customer = await customerForUser(stripe, context.userId, email);

    let discounts: { coupon: string }[] | undefined;
    if (product.kind === "session" && (await hasMembership(context.userId))) {
      try {
        await stripe.coupons.retrieve(MEMBER_COUPON_ID);
        discounts = [{ coupon: MEMBER_COUPON_ID }];
      } catch {
        console.warn("Member coupon missing; run 'Set up membership' in admin");
      }
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: prices.data[0].id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      customer: customer ?? undefined,
      payment_intent_data: { description: product.name as string },
      adaptive_pricing: { enabled: true },
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      metadata: { userId: context.userId, product_slug: product.slug as string },
    });
    return session.client_secret;
  });

/** Admin only: creates the membership product, both prices and the member coupon in Stripe if missing. */
export const setupMembershipInStripe = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: StripeEnv }) => {
    envSchema(data);
    return data;
  })
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.userId))) throw new Error("Admins only");
    const stripe = createStripeClient(data.environment);
    const created: string[] = [];

    let productId: string | undefined;
    for (const p of Object.values(MEMBERSHIP_PRICES)) {
      const existing = await stripe.prices.list({ lookup_keys: [p.lookupKey], active: true });
      if (existing.data.length) {
        productId ??= typeof existing.data[0].product === "string" ? existing.data[0].product : existing.data[0].product.id;
        continue;
      }
      if (!productId) {
        const prod = await stripe.products.create({
          name: "Signe Coach Membership",
          description: "All journeys, workbooks and audio library.",
        });
        productId = prod.id;
        created.push("product");
      }
      await stripe.prices.create({
        product: productId,
        currency: "eur",
        unit_amount: p.amount,
        recurring: { interval: p.interval },
        lookup_key: p.lookupKey,
      });
      created.push(p.lookupKey);
    }

    try {
      await stripe.coupons.retrieve(MEMBER_COUPON_ID);
    } catch {
      await stripe.coupons.create({
        id: MEMBER_COUPON_ID,
        name: "Member discount on 1:1 sessions",
        percent_off: MEMBER_SESSION_PERCENT_OFF,
        duration: "forever",
      });
      created.push(MEMBER_COUPON_ID);
    }
    return { created };
  });
