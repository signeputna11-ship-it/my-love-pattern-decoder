import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function validateToken(token: string) {
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(token)) throw new Error("Invalid token");
}

export const getPurchaseByToken = createServerFn({ method: "GET" })
  .inputValidator((data: { token: string }) => {
    validateToken(data.token);
    return data;
  })
  .handler(async ({ data }) => {
    const { data: purchase, error } = await supabaseAdmin
      .from("purchases")
      .select("id, product_slug, customer_email, has_access, refunded, upsell_converted, created_at")
      .eq("access_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!purchase || !purchase.has_access || purchase.refunded) {
      throw new Error("Access link is invalid or revoked");
    }
    const slug = purchase.product_slug as string | null;
    const { data: product } = slug
      ? await supabaseAdmin
          .from("shop_products")
          .select("slug, kind, name, short_description")
          .eq("slug", slug)
          .maybeSingle()
      : { data: null };

    return { purchase, product };
  });

export const getWorksheetByToken = createServerFn({ method: "GET" })
  .inputValidator((data: { token: string }) => {
    validateToken(data.token);
    return data;
  })
  .handler(async ({ data }) => {
    const { data: purchase, error } = await supabaseAdmin
      .from("purchases")
      .select("id, product_slug, has_access, refunded")
      .eq("access_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!purchase || !purchase.has_access || purchase.refunded) {
      throw new Error("Access link is invalid or revoked");
    }
    const { data: product } = await supabaseAdmin
      .from("shop_products")
      .select("slug, name, short_description")
      .eq("slug", purchase.product_slug as string)
      .maybeSingle();
    const { data: response } = await supabaseAdmin
      .from("worksheet_responses")
      .select("data, updated_at")
      .eq("purchase_id", purchase.id as string)
      .maybeSingle();
    return {
      product,
      response: response ?? { data: {}, updated_at: null },
    };
  });

export const saveWorksheetResponse = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; data: Record<string, unknown> }) => {
    validateToken(data.token);
    if (typeof data.data !== "object" || data.data === null) throw new Error("Invalid data");
    if (JSON.stringify(data.data).length > 200_000) throw new Error("Payload too large");
    return data;
  })
  .handler(async ({ data }) => {
    const { data: purchase, error } = await supabaseAdmin
      .from("purchases")
      .select("id, has_access, refunded")
      .eq("access_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!purchase || !purchase.has_access || purchase.refunded) {
      throw new Error("Access link is invalid or revoked");
    }
    const { error: upsertError } = await supabaseAdmin
      .from("worksheet_responses")
      .upsert(
        { purchase_id: purchase.id as string, data: data.data, updated_at: new Date().toISOString() },
        { onConflict: "purchase_id" },
      );
    if (upsertError) throw new Error(upsertError.message);
    return { ok: true };
  });

export const getKitByToken = createServerFn({ method: "GET" })
  .inputValidator((data: { token: string }) => {
    validateToken(data.token);
    return data;
  })
  .handler(async ({ data }) => {
    const { data: purchase, error } = await supabaseAdmin
      .from("purchases")
      .select("id, product_slug, has_access, refunded")
      .eq("access_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!purchase || !purchase.has_access || purchase.refunded) {
      throw new Error("Access link is invalid or revoked");
    }
    if (purchase.product_slug !== "love-pattern-reset-kit") {
      throw new Error("This link is not a kit access link");
    }
    const { data: stages } = await supabaseAdmin
      .from("kit_stages")
      .select("id, position, slug, title, subtitle, body")
      .order("position", { ascending: true });
    const { data: progress } = await supabaseAdmin
      .from("kit_stage_progress")
      .select("stage_id, completed_at")
      .eq("purchase_id", purchase.id as string);
    const completed = new Set((progress ?? []).map((p) => p.stage_id as string));
    return {
      stages: (stages ?? []).map((s) => ({ ...s, completed: completed.has(s.id as string) })),
    };
  });

export const markStageComplete = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; stageId: string }) => {
    validateToken(data.token);
    if (!/^[0-9a-f-]{36}$/.test(data.stageId)) throw new Error("Invalid stage id");
    return data;
  })
  .handler(async ({ data }) => {
    const { data: purchase, error } = await supabaseAdmin
      .from("purchases")
      .select("id, has_access, refunded, product_slug")
      .eq("access_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!purchase || !purchase.has_access || purchase.refunded) {
      throw new Error("Access link is invalid or revoked");
    }
    if (purchase.product_slug !== "love-pattern-reset-kit") {
      throw new Error("This link is not a kit access link");
    }
    const { error: upsertError } = await supabaseAdmin
      .from("kit_stage_progress")
      .upsert(
        { purchase_id: purchase.id as string, stage_id: data.stageId, completed_at: new Date().toISOString() },
        { onConflict: "purchase_id,stage_id" },
      );
    if (upsertError) throw new Error(upsertError.message);
    return { ok: true };
  });
