import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";

export const getShopProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("shop_products")
    .select("slug, kind, name, short_description, price_cents, currency, position")
    .eq("active", true)
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return { products: data ?? [] };
});

export const getShopProduct = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => {
    if (!/^[a-z0-9-]+$/.test(data.slug)) throw new Error("Invalid slug");
    return data;
  })
  .handler(async ({ data }) => {
    const { data: product, error } = await supabaseAdmin
      .from("shop_products")
      .select("slug, kind, name, short_description, price_cents, currency, stripe_price_id")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!product) throw new Error("Product not found");
    return { product };
  });

function clean(s: string, max: number): string {
  return s.trim().slice(0, max);
}

export const createGuestCheckout = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      slug: string;
      customerEmail: string;
      firstName: string;
      lastName: string;
      phone: string;
      returnUrl: string;
      environment: StripeEnv;
    }) => {
      if (!/^[a-z0-9-]+$/.test(data.slug)) throw new Error("Invalid slug");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.customerEmail)) throw new Error("Invalid email");
      if (!data.firstName || data.firstName.trim().length < 1) throw new Error("First name required");
      if (data.firstName.length > 80) throw new Error("First name too long");
      if (!data.lastName || data.lastName.trim().length < 1) throw new Error("Last name required");
      if (data.lastName.length > 80) throw new Error("Last name too long");
      if (!data.phone || data.phone.trim().length < 4) throw new Error("Phone required");
      if (data.phone.length > 40) throw new Error("Phone too long");
      if (!/^[+0-9()\-.\s]+$/.test(data.phone)) throw new Error("Invalid phone");
      if (!data.returnUrl) throw new Error("Missing returnUrl");
      if (data.environment !== "sandbox" && data.environment !== "live")
        throw new Error("Invalid environment");
      return data;
    },
  )
  .handler(async ({ data }) => {
    const { data: product, error } = await supabaseAdmin
      .from("shop_products")
      .select("slug, name, stripe_price_id")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!product) throw new Error("Product not found");

    const firstName = clean(data.firstName, 80);
    const lastName = clean(data.lastName, 80);
    const phone = clean(data.phone, 40);
    const fullName = `${firstName} ${lastName}`.trim().slice(0, 160);

    const stripe = createStripeClient(data.environment);
    const prices = await stripe.prices.list({ lookup_keys: [product.stripe_price_id as string] });
    if (!prices.data.length) throw new Error("Stripe price not found");
    const stripePrice = prices.data[0];

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      customer_email: data.customerEmail,
      payment_intent_data: { description: product.name as string },
      metadata: {
        product_slug: product.slug as string,
        guest_email: data.customerEmail,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        phone,
      },
    });

    return session.client_secret;
  });
