import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Admin only");
}

export const adminGetOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId as string);

    const { data: orders, error } = await supabaseAdmin
      .from("purchases")
      .select("id, created_at, customer_email, product_slug, amount_total, currency, status, upsell_converted, upsell_shown, downloaded_at, environment")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = startOfDay - now.getDay() * 24 * 60 * 60 * 1000;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let today = 0,
      week = 0,
      month = 0,
      all = 0;
    let upsellEligible = 0,
      upsellConverted = 0;

    for (const o of orders ?? []) {
      if (o.status !== "paid") continue;
      const cents = o.amount_total ?? 0;
      const ts = new Date(o.created_at as string).getTime();
      all += cents;
      if (ts >= startOfMonth) month += cents;
      if (ts >= startOfWeek) week += cents;
      if (ts >= startOfDay) today += cents;

      if (o.product_slug && o.product_slug !== "love-pattern-reset-kit" && o.upsell_shown) {
        upsellEligible++;
        if (o.upsell_converted) upsellConverted++;
      }
    }

    return {
      orders: orders ?? [],
      stats: {
        today: today / 100,
        week: week / 100,
        month: month / 100,
        all: all / 100,
        upsellRate: upsellEligible > 0 ? upsellConverted / upsellEligible : 0,
        upsellEligible,
        upsellConverted,
      },
    };
  });

export const adminGetSubscribers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId as string);

    const { data: subs, error } = await supabaseAdmin
      .from("email_subscribers")
      .select("id, email, first_name, source, product_slug, sequence_step, sequence_paused, last_emailed_at, subscribed_at")
      .order("subscribed_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    let active = 0,
      paused = 0;
    for (const s of subs ?? []) {
      if (s.sequence_paused) paused++;
      else active++;
    }
    return {
      subscribers: subs ?? [],
      stats: { total: (subs ?? []).length, active, paused },
    };
  });

export const adminToggleSubscriberPause = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; paused: boolean }) => {
    if (!/^[0-9a-f-]{36}$/.test(data.id)) throw new Error("Invalid id");
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId as string);
    const { error } = await supabaseAdmin
      .from("email_subscribers")
      .update({ sequence_paused: data.paused })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminResendLast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!/^[0-9a-f-]{36}$/.test(data.id)) throw new Error("Invalid id");
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId as string);
    const { data: sub, error } = await supabaseAdmin
      .from("email_subscribers")
      .select("email, first_name, sequence_step")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !sub) throw new Error("Subscriber not found");
    const { enqueueTransactionalEmailAsService } = await import("@/server/email.server");
    const step = Math.max(2, Number(sub.sequence_step ?? 2));
    await enqueueTransactionalEmailAsService({
      templateName: "nurture-sequence",
      recipientEmail: sub.email as string,
      idempotencyKey: `nurture-resend-${data.id}-${step}-${Date.now()}`,
      templateData: { step, first_name: sub.first_name ?? undefined },
    });
    return { ok: true };
  });
