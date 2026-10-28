import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook, createStripeClient } from "@/lib/stripe.server";
import { enqueueTransactionalEmailAsService } from "@/server/email.server";

let _supabase: any = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _supabase;
}

// Generate a URL-safe random access token (~22 chars).
function generateAccessToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function lookupProductSlugByLookupKey(
  env: StripeEnv,
  lookupKey: string | null,
): Promise<string | null> {
  if (!lookupKey) return null;
  const { data } = await getSupabase()
    .from("shop_products")
    .select("slug")
    .eq("stripe_price_id", lookupKey)
    .maybeSingle();
  return (data?.slug as string | null) ?? null;
}

async function upsertPurchaseFromSession(session: any, env: StripeEnv) {
  const userId: string | null = session.metadata?.userId ?? null;
  const metadataSlug: string | null = session.metadata?.product_slug ?? null;
  const guestEmail: string | null = session.metadata?.guest_email ?? null;
  const metaFirstName: string | null = session.metadata?.first_name ?? null;
  const metaLastName: string | null = session.metadata?.last_name ?? null;
  const metaPhone: string | null = session.metadata?.phone ?? null;

  let priceId: string | null = null;
  let productId: string | null = null;
  let resolvedSlug: string | null = metadataSlug;
  let productName: string | null = null;

  try {
    const stripe = createStripeClient(env);
    const expanded = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price.product"],
    });
    const li: any = expanded.line_items?.data?.[0];
    priceId = li?.price?.lookup_key ?? li?.price?.metadata?.lovable_external_id ?? li?.price?.id ?? null;
    productId = (li?.price?.product as any)?.id ?? li?.price?.product ?? null;
    productName = (li?.price?.product as any)?.name ?? li?.description ?? null;
    if (!resolvedSlug) {
      resolvedSlug = await lookupProductSlugByLookupKey(env, priceId);
    }
  } catch (e) {
    console.warn("Failed to expand session line items:", (e as Error).message);
  }

  // Fall back to shop_products for the canonical name
  if (resolvedSlug && !productName) {
    const { data: p } = await getSupabase()
      .from("shop_products")
      .select("name")
      .eq("slug", resolvedSlug)
      .maybeSingle();
    productName = (p?.name as string | null) ?? null;
  }

  const recipientEmail: string | null =
    session.customer_details?.email ?? session.customer_email ?? guestEmail ?? null;

  const customerFullName: string | null =
    (session.customer_details?.name as string | null) ?? null;
  const firstName: string | null =
    metaFirstName ?? customerFullName?.split(" ")[0] ?? null;
  const lastName: string | null =
    metaLastName ?? (customerFullName ? customerFullName.split(" ").slice(1).join(" ") || null : null);
  const phone: string | null =
    metaPhone ?? (session.customer_details?.phone as string | null) ?? null;

  // Idempotent token: keep existing token on re-delivery
  const { data: existing } = await getSupabase()
    .from("purchases")
    .select("id, access_token")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  const accessToken: string = existing?.access_token ?? generateAccessToken();

  await getSupabase().from("purchases").upsert(
    {
      user_id: userId,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent ?? null,
      stripe_customer_id: session.customer ?? null,
      price_id: priceId,
      product_id: productId,
      product_slug: resolvedSlug,
      customer_email: recipientEmail,
      first_name: firstName,
      last_name: lastName,
      phone,
      access_token: accessToken,
      amount_total: session.amount_total ?? null,
      currency: session.currency ?? null,
      status: "paid",
      has_access: true,
      refunded: false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_session_id" },
  );

  if (recipientEmail) {
    const isKit = resolvedSlug === "love-pattern-reset-kit";
    const accessPath = isKit ? `/kit/${accessToken}` : `/w/${accessToken}`;
    const accessLink = `https://mylovepattern.com${accessPath}`;
    try {
      await enqueueTransactionalEmailAsService({
        templateName: "purchase-confirmation",
        recipientEmail,
        idempotencyKey: `purchase-confirm-${session.id}`,
        templateData: {
          first_name: firstName ?? undefined,
          product_name: productName ?? undefined,
          access_link: accessLink,
          product_slug: resolvedSlug ?? undefined,
        },
      });
    } catch (e) {
      console.error("Failed to enqueue purchase confirmation:", e);
    }

    // Enroll into nurture sequence (step 1 = purchase-confirmation, already sent).
    try {
      await getSupabase().from("email_subscribers").upsert(
        {
          email: recipientEmail.toLowerCase(),
          first_name: firstName,
          last_name: lastName,
          phone,
          source: "purchase",
          product_slug: resolvedSlug,
          sequence_step: 1,
          sequence_paused: false,
          last_emailed_at: new Date().toISOString(),
        },
        { onConflict: "email", ignoreDuplicates: false },
      );
    } catch (e) {
      console.error("Failed to enroll subscriber:", e);
    }
  } else {
    console.warn("No recipient email on session", session.id);
  }
}


async function revokeAccessByPaymentIntent(paymentIntentId: string, env: StripeEnv) {
  await getSupabase()
    .from("purchases")
    .update({
      refunded: true,
      has_access: false,
      status: "refunded",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_payment_intent_id", paymentIntentId)
    .eq("environment", env);
}

async function upsertSubscription(sub: any, env: StripeEnv) {
  let userId: string | null = sub.metadata?.userId ?? null;
  const customerId: string | null = typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;
  if (!userId && customerId) {
    try {
      const customer: any = await createStripeClient(env).customers.retrieve(customerId);
      userId = customer?.metadata?.userId ?? null;
    } catch (e) {
      console.warn("Could not resolve customer for subscription:", (e as Error).message);
    }
  }
  if (!userId) {
    console.warn("Subscription without userId", sub.id);
    return;
  }
  const item = sub.items?.data?.[0];
  const periodEnd: number | null = item?.current_period_end ?? sub.current_period_end ?? null;
  await getSupabase().from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: customerId,
      price_lookup_key: item?.price?.lookup_key ?? null,
      status: sub.status,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: !!sub.cancel_at_period_end,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "checkout.session.completed":
      // Membership checkouts are tracked through customer.subscription.* events.
      if (event.data.object?.mode === "subscription") break;
      await upsertPurchaseFromSession(event.data.object, env);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await upsertSubscription(event.data.object, env);
      break;
    case "transaction.completed": {
      const obj: any = event.data.object;
      if (obj?.id?.startsWith?.("cs_")) await upsertPurchaseFromSession(obj, env);
      break;
    }
    case "charge.refunded":
    case "charge.refund.updated": {
      const charge: any = event.data.object;
      const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
      if (pi) await revokeAccessByPaymentIntent(pi, env);
      break;
    }
    case "refund.created":
    case "refund.updated": {
      const refund: any = event.data.object;
      const pi = typeof refund.payment_intent === "string" ? refund.payment_intent : null;
      if (pi && (refund.status === "succeeded" || refund.status === "pending")) {
        await revokeAccessByPaymentIntent(pi, env);
      }
      break;
    }
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook invalid env:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          await handleWebhook(request, env);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
