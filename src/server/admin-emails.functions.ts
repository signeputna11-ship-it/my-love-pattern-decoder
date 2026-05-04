import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const inputSchema = z.object({
  rangeDays: z.number().int().min(1).max(365).default(7),
  template: z.string().nullable().default(null),
  status: z.string().nullable().default(null),
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(200).default(50),
});

export const getEmailDeliveryDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // Admin gate
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) {
      throw new Error("forbidden");
    }

    const since = new Date(Date.now() - data.rangeDays * 24 * 60 * 60 * 1000).toISOString();

    // Fetch a generous slice and dedupe in memory by message_id (latest per id).
    let q = supabaseAdmin
      .from("email_send_log")
      .select("id, message_id, template_name, recipient_email, status, error_message, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(2000);
    if (data.template) q = q.eq("template_name", data.template);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    const latestByMsg = new Map<string, any>();
    const noMsgRows: any[] = [];
    for (const r of rows ?? []) {
      if (!r.message_id) {
        noMsgRows.push(r);
        continue;
      }
      if (!latestByMsg.has(r.message_id)) latestByMsg.set(r.message_id, r);
    }
    let deduped = [...latestByMsg.values(), ...noMsgRows];
    if (data.status) deduped = deduped.filter((r) => r.status === data.status);

    const stats = {
      total: deduped.length,
      sent: deduped.filter((r) => r.status === "sent").length,
      failed: deduped.filter((r) => r.status === "dlq" || r.status === "failed" || r.status === "bounced").length,
      suppressed: deduped.filter((r) => r.status === "suppressed" || r.status === "complained").length,
      pending: deduped.filter((r) => r.status === "pending").length,
    };

    // Distinct templates for filter dropdown
    const templateSet = new Set<string>();
    (rows ?? []).forEach((r) => r.template_name && templateSet.add(r.template_name));

    const start = data.page * data.pageSize;
    const items = deduped.slice(start, start + data.pageSize);

    return {
      stats,
      templates: [...templateSet].sort(),
      items,
      hasMore: deduped.length > start + data.pageSize,
    };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: !!data };
  });
