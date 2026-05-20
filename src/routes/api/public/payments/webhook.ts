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

  let priceId: string | null = null;
  let productId: string | null = null;
  let resolvedSlug: string | null = metadataSlug;

  try {
    const stripe = createStripeClient(env);
    const expanded = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price.product"],
    });
    const li: any = expanded.line_items?.data?.[0];
    priceId = li?.price?.lookup_key ?? li?.price?.metadata?.lovable_external_id ?? li?.price?.id ?? null;
    productId = (li?.price?.product as any)?.id ?? li?.price?.product ?? null;
    if (!resolvedSlug) {
      resolvedSlug = await lookupProductSlugByLookupKey(env, priceId);
    }
  } catch (e) {
    console.warn("Failed to expand session line items:", (e as Error).message);
  }

  const recipientEmail: string | null =
    session.customer_details?.email ?? session.customer_email ?? guestEmail ?? null;

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
    const amount =
      typeof session.amount_total === "number"
        ? (session.amount_total / 100).toFixed(2)
        : undefined;
    const isKit = resolvedSlug === "love-pattern-reset-kit";
    const accessPath = isKit ? `/kit/${accessToken}` : `/w/${accessToken}`;
    try {
      await enqueueTransactionalEmailAsService({
        templateName: "purchase-confirmation",
        recipientEmail,
        idempotencyKey: `purchase-confirm-${session.id}`,
        templateData: {
          amount,
          currency: session.currency ?? undefined,
          accessPath,
          productSlug: resolvedSlug ?? undefined,
        },
      });
    } catch (e) {
      console.error("Failed to enqueue purchase confirmation:", e);
    }

    // Enroll into nurture sequence (step 1 = purchase-confirmation, already sent).
    try {
      const firstName =
        (session.customer_details?.name as string | undefined)?.split(" ")[0] ?? null;
      await getSupabase().from("email_subscribers").upsert(
        {
          email: recipientEmail.toLowerCase(),
          first_name: firstName,
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

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "checkout.session.completed":
      await upsertPurchaseFromSession(event.data.object, env);
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
