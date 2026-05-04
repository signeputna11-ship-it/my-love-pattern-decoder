import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      priceId: string;
      customerEmail?: string;
      userId?: string;
      returnUrl: string;
      environment: StripeEnv;
    }) => {
      if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
      if (!data.returnUrl) throw new Error("Missing returnUrl");
      if (data.environment !== "sandbox" && data.environment !== "live")
        throw new Error("Invalid environment");
      return data;
    },
  )
  .handler(async ({ data }) => {
    const stripe = createStripeClient(data.environment);

    const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];

    // Flat €49 — no tax added on top. Seller handles any tax obligations themselves.
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      ...(data.customerEmail && { customer_email: data.customerEmail }),
      metadata: {
        ...(data.userId && { userId: data.userId }),
      },
    });

    return session.client_secret;
  });
