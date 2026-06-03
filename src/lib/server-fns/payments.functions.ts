import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      // Either a lookup key OR a product slug. slug is preferred for new code.
      priceId?: string;
      slug?: string;
      customerEmail?: string;
      userId?: string;
      returnUrl: string;
      environment: StripeEnv;
    }) => {
      if (data.priceId && !/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
      if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) throw new Error("Invalid slug");
      if (!data.priceId && !data.slug) throw new Error("priceId or slug required");
      if (!data.returnUrl) throw new Error("Missing returnUrl");
      if (data.environment !== "sandbox" && data.environment !== "live")
        throw new Error("Invalid environment");
      return data;
    },
  )
  .handler(async ({ data }) => {
    const stripe = createStripeClient(data.environment);

    // Resolve lookup key + product slug from DB when slug provided.
    let lookupKey: string | null = data.priceId ?? null;
    let productSlug: string | null = data.slug ?? null;
    let productName: string | null = null;
    if (data.slug) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: product, error } = await supabaseAdmin
        .from("shop_products")
        .select("slug, name, stripe_price_id")
        .eq("slug", data.slug)
        .eq("active", true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!product) throw new Error("Product not found");
      lookupKey = product.stripe_price_id as string;
      productSlug = product.slug as string;
      productName = product.name as string;
    }

    const prices = await stripe.prices.list({ lookup_keys: [lookupKey!] });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];

    if (!productName) {
      const productId = typeof stripePrice.product === "string"
        ? stripePrice.product
        : stripePrice.product.id;
      const product = await stripe.products.retrieve(productId);
      productName = product.name;
    }

    // Resolve a real Customer so userId lands on a searchable Stripe object.
    const customerId = (data.customerEmail || data.userId)
      ? await resolveOrCreateCustomer(stripe, {
          email: data.customerEmail,
          userId: data.userId,
        })
      : undefined;

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      ...(customerId && { customer: customerId }),
      payment_intent_data: { description: productName },
      adaptive_pricing: { enabled: true },
      metadata: {
        ...(data.userId && { userId: data.userId }),
        ...(productSlug && { product_slug: productSlug }),
      },
    });

    return session.client_secret;
  });

/**
 * Backfill purchases.user_id where customer_email matches the signed-in
 * user's email. Called after sign-in / sign-up so guest purchases attach
 * to the new account and /app unlocks for them.
 */
export const linkGuestPurchases = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: userRow } = await supabaseAdmin.auth.admin.getUserById(userId);
    const email = userRow?.user?.email;
    if (!email) return { linked: 0 };
    const { data, error } = await supabaseAdmin
      .from("purchases")
      .update({ user_id: userId })
      .is("user_id", null)
      .ilike("customer_email", email)
      .select("id");
    if (error) {
      console.error("linkGuestPurchases failed", error);
      return { linked: 0 };
    }
    return { linked: data?.length ?? 0 };
  });
