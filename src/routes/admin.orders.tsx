import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { adminGetOrders } from "@/lib/server-fns/admin.functions";
import { Orb } from "@/components/icons/Orb";

type Order = {
  id: string;
  created_at: string;
  customer_email: string | null;
  product_slug: string | null;
  amount_total: number | null;
  currency: string | null;
  status: string;
  upsell_converted: boolean;
  upsell_shown: boolean;
  downloaded_at: string | null;
};

type Stats = {
  today: number;
  week: number;
  month: number;
  all: number;
  upsellRate: number;
  upsellEligible: number;
  upsellConverted: number;
};

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Admin · Orders" }, { name: "robots", content: "noindex" }] }),
  component: AdminOrders,
});

function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}
function pill(status: string) {
  const map: Record<string, { bg: string; fg: string }> = {
    paid: { bg: "#dcfce7", fg: "#166534" },
    pending: { bg: "#fef3c7", fg: "#92400e" },
    failed: { bg: "#fee2e2", fg: "#991b1b" },
    refunded: { bg: "#e5e7eb", fg: "#374151" },
  };
  const c = map[status] ?? map.refunded;
  return (
    <span className="rounded-full px-2 py-0.5 text-xs capitalize" style={{ backgroundColor: c.bg, color: c.fg }}>
      {status}
    </span>
  );
}

function AdminOrders() {
  const navigate = useNavigate();
  const get = useServerFn(adminGetOrders);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "failed">("all");
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      setAuthChecked(true);
    });
  }, [navigate]);

  useEffect(() => {
    if (!authChecked) return;
    setLoading(true);
    get()
      .then((r) => {
        setOrders(r.orders as Order[]);
        setStats(r.stats);
      })
      .catch((e) => alert(e?.message))
      .finally(() => setLoading(false));
  }, [authChecked, get]);

  const filtered = useMemo(
    () => orders.filter((o) => (filter === "all" ? true : o.status === filter)),
    [orders, filter],
  );

  const exportCsv = () => {
    const paid = orders.filter((o) => o.status === "paid");
    const rows = [
      ["Date", "Email", "Product", "Amount", "Currency", "Upsell", "Downloaded"],
      ...paid.map((o) => [
        new Date(o.created_at).toISOString(),
        o.customer_email ?? "",
        o.product_slug ?? "",
        ((o.amount_total ?? 0) / 100).toFixed(2),
        (o.currency ?? "usd").toUpperCase(),
        o.upsell_converted ? "yes" : "no",
        o.downloaded_at ? "yes" : "no",
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authChecked) return null;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12" style={{ backgroundColor: "#F8F5F0", minHeight: "100vh" }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl italic" style={{ fontFamily: "Instrument Serif", color: "#111", textWrap: "balance" }}>
          Orders <Orb className="inline-block h-[0.8em] w-[0.8em] align-[-0.05em] text-[#C98BA0]" />
        </h1>
        <div className="flex gap-3">
          <Link to="/admin/subscribers" className="text-xs underline" style={{ color: "#111" }}>Subscribers</Link>
          <Link to="/admin/blog" className="text-xs underline" style={{ color: "#111" }}>Blog</Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Today", value: stats?.today ?? 0 },
          { label: "This week", value: stats?.week ?? 0 },
          { label: "This month", value: stats?.month ?? 0 },
          { label: "All time", value: stats?.all ?? 0 },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-4" style={{ border: "1px solid #E8E3DC" }}>
            <p className="text-xs uppercase tracking-widest" style={{ color: "#6B6560" }}>{c.label}</p>
            <p className="mt-1 text-2xl italic" style={{ fontFamily: "Instrument Serif", color: "#111" }}>{fmt(c.value)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4" style={{ border: "1px solid #E8E3DC" }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: "#6B6560" }}>Upsell conversion</p>
        <p className="mt-1 text-2xl italic" style={{ fontFamily: "Instrument Serif", color: "#111" }}>
          {stats ? `${(stats.upsellRate * 100).toFixed(1)}%` : "—"}
          {stats && (
            <span className="ml-2 text-xs" style={{ color: "#6B6560", fontFamily: "Inter" }}>
              ({stats.upsellConverted} of {stats.upsellEligible})
            </span>
          )}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["all", "paid", "pending", "failed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-full px-3 py-1 text-xs capitalize"
              style={{
                backgroundColor: filter === f ? "#111" : "rgba(255,255,255,0.7)",
                color: filter === f ? "#fff" : "#6b4c44",
                border: "1px solid #E8E3DC",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={exportCsv}
          className="rounded-full px-4 py-1.5 text-xs text-white"
          style={{ backgroundColor: "#111" }}
        >
          Export paid as CSV
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border bg-white" style={{ borderColor: "#E8E3DC" }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "#F8F5F0" }}>
            <tr className="text-left" style={{ color: "#6B6560" }}>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Upsell</th>
              <th className="px-4 py-3">Downloaded</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center" style={{ color: "#6B6560" }}>Loading</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center" style={{ color: "#6B6560" }}>No orders.</td></tr>
            ) : filtered.map((o) => (
              <tr key={o.id} className="border-t" style={{ borderColor: "#E8E3DC" }}>
                <td className="px-4 py-3" style={{ color: "#6b4c44" }}>{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3" style={{ color: "#111" }}>{o.customer_email ?? "—"}</td>
                <td className="px-4 py-3" style={{ color: "#6b4c44" }}>{o.product_slug ?? "—"}</td>
                <td className="px-4 py-3" style={{ color: "#111" }}>
                  {o.amount_total != null ? `$${(o.amount_total / 100).toFixed(2)}` : "—"}
                </td>
                <td className="px-4 py-3">{pill(o.status)}</td>
                <td className="px-4 py-3" style={{ color: o.upsell_converted ? "#166534" : "#6B6560" }}>
                  {o.upsell_converted ? "✓" : "✗"}
                </td>
                <td className="px-4 py-3" style={{ color: o.downloaded_at ? "#166534" : "#6B6560" }}>
                  {o.downloaded_at ? "✓" : "✗"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
