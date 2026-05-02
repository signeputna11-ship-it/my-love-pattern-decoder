import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook, createStripeClient } from "@/lib/stripe.server";

let _supabase: any = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _supabase;
}

async function upsertPurchaseFromSession(session: any, env: StripeEnv) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("checkout.session.completed without userId in metadata", session.id);
    return;
  }
  const lineItem = session.line_items?.data?.[0] ?? null;
  let priceId: string | null = lineItem?.price?.metadata?.lovable_external_id ?? null;
  let productId: string | null = lineItem?.price?.product ?? null;

  if (!priceId) {
    try {
      const stripe = createStripeClient(env);
      const expanded = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items.data.price.product"],
      });
      const li: any = expanded.line_items?.data?.[0];
      priceId = li?.price?.metadata?.lovable_external_id ?? li?.price?.id ?? null;
      productId = (li?.price?.product as any)?.id ?? li?.price?.product ?? null;
    } catch (e) {
      console.warn("Failed to expand session line items:", (e as Error).message);
    }
  }

  await getSupabase().from("purchases").upsert(
    {
      user_id: userId,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent ?? null,
      stripe_customer_id: session.customer ?? null,
      price_id: priceId,
      product_id: productId,
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
      // In case payment provider abstraction sends this — try to extract a session/PI
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
