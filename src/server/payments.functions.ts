import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";

const PRODUCT_TAX_CODE = "txcd_10000000"; // general digital goods (digital wellness program)

// Idempotently ensure our digital product has a tax code set so managed_payments works.
async function ensureProductTaxCode(stripe: ReturnType<typeof createStripeClient>) {
  try {
    const products = await stripe.products.search({
      query: `metadata['lovable_external_id']:'my_love_pattern_reset'`,
      limit: 1,
    });
    const product = products.data[0];
    if (product && (!product.tax_code || product.tax_code !== PRODUCT_TAX_CODE)) {
      await stripe.products.update(product.id, { tax_code: PRODUCT_TAX_CODE });
    }
  } catch (e) {
    console.warn("ensureProductTaxCode skipped:", (e as Error).message);
  }
}

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
    await ensureProductTaxCode(stripe);

    const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      managed_payments: { enabled: true },
      ...(data.customerEmail && { customer_email: data.customerEmail }),
      metadata: {
        ...(data.userId && { userId: data.userId }),
        managed_payments: "true",
      },
    });

    return session.client_secret;
  });
