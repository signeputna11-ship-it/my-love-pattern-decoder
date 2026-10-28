import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getEmailDeliveryDashboard, checkIsAdmin } from "@/lib/server-fns/admin-emails.functions";

export const Route = createFileRoute("/app/admin/emails")({
  component: AdminEmailsPage,
  head: () => ({
    meta: [
      { title: "Email Delivery · Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const RANGES = [
  { label: "24h", days: 1 },
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
];

const STATUSES = ["all", "sent", "failed", "dlq", "suppressed", "bounced", "complained", "pending"];

function statusColor(status: string) {
  if (status === "sent") return "bg-emerald-500/20 text-emerald-300";
  if (status === "dlq" || status === "failed" || status === "bounced") return "bg-red-500/20 text-red-300";
  if (status === "suppressed" || status === "complained") return "bg-yellow-500/20 text-yellow-300";
  return "bg-white/10 text-white/70";
}

function AdminEmailsPage() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<"checking" | "ok" | "denied">("checking");
  const [loading, setLoading] = useState(false);
  const [rangeDays, setRangeDays] = useState(7);
  const [template, setTemplate] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    checkIsAdmin()
      .then((r) => setAuthState(r.isAdmin ? "ok" : "denied"))
      .catch(() => setAuthState("denied"));
  }, []);

  useEffect(() => {
    if (authState !== "ok") return;
    setLoading(true);
    getEmailDeliveryDashboard({
      data: {
        rangeDays,
        template: template || null,
        status: status === "all" ? null : status,
        page,
        pageSize: 50,
      },
    })
      .then(setData)
      .finally(() => setLoading(false));
  }, [authState, rangeDays, template, status, page]);

  if (authState === "checking") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/60" />
      </div>
    );
  }
  if (authState === "denied") {
    return (
      <div className="px-6 py-12 text-center">
        <h1 className="font-serif text-2xl">Admin access required</h1>
        <p className="mt-2 text-sm text-foreground/60">You don't have permission to view this page.</p>
        <button
          onClick={() => navigate({ to: "/app" })}
          className="mt-6 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
        >
          Back to app
        </button>
      </div>
    );
  }

  const stats = data?.stats ?? { total: 0, sent: 0, failed: 0, suppressed: 0, pending: 0 };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl sm:text-4xl">Email Delivery</h1>
      <p className="mt-2 text-sm text-foreground/60">Track sends, failures, and suppressions.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Total", value: stats.total },
          { label: "Sent", value: stats.sent, tone: "text-emerald-300" },
          { label: "Failed", value: stats.failed, tone: "text-red-300" },
          { label: "Suppressed", value: stats.suppressed, tone: "text-yellow-300" },
          { label: "Pending", value: stats.pending, tone: "text-white/70" },
        ].map((s) => (
          <div key={s.label} className="liquid-glass-strong rounded-2xl p-4">
            <div className="text-xs uppercase tracking-widest text-foreground/50">{s.label}</div>
            <div className={`mt-1 font-serif text-2xl ${s.tone ?? ""}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-full liquid-glass p-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => { setRangeDays(r.days); setPage(0); }}
              className={`rounded-full px-3 py-1 text-xs ${rangeDays === r.days ? "bg-primary text-primary-foreground" : "text-foreground/70"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <select
          value={template}
          onChange={(e) => { setTemplate(e.target.value); setPage(0); }}
          className="rounded-full liquid-glass px-3 py-1.5 text-xs text-foreground"
        >
          <option value="">All templates</option>
          {(data?.templates ?? []).map((t: string) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(0); }}
          className="rounded-full liquid-glass px-3 py-1.5 text-xs text-foreground"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-foreground/60" />}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl liquid-glass-strong">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-foreground/50">
            <tr>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Error</th>
            </tr>
          </thead>
          <tbody>
            {(data?.items ?? []).map((r: any) => (
              <tr key={r.id} className="border-t border-foreground/10">
                <td className="px-4 py-3 font-mono text-xs">{r.template_name}</td>
                <td className="px-4 py-3 text-foreground/80">{r.recipient_email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-foreground/60">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-red-300/80">{r.error_message ?? ""}</td>
              </tr>
            ))}
            {!loading && (data?.items ?? []).length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-foreground/50">No email events in this range.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-foreground/60">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="rounded-full liquid-glass px-3 py-1 disabled:opacity-40"
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.hasMore}
          className="rounded-full liquid-glass px-3 py-1 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
