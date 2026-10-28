import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  adminGetSubscribers,
  adminToggleSubscriberPause,
  adminResendLast,
} from "@/lib/server-fns/admin.functions";

type Sub = {
  id: string;
  email: string;
  first_name: string | null;
  source: string;
  product_slug: string | null;
  sequence_step: number;
  sequence_paused: boolean;
  last_emailed_at: string | null;
  subscribed_at: string;
};

export const Route = createFileRoute("/admin/subscribers")({
  head: () => ({ meta: [{ title: "Admin · Subscribers" }, { name: "robots", content: "noindex" }] }),
  component: AdminSubs,
});

function AdminSubs() {
  const navigate = useNavigate();
  const get = useServerFn(adminGetSubscribers);
  const toggle = useServerFn(adminToggleSubscriberPause);
  const resend = useServerFn(adminResendLast);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [stats, setStats] = useState<{ total: number; active: number; paused: number } | null>(null);
  const [stepFilter, setStepFilter] = useState<"all" | number>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | string>("all");
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

  const refresh = () => {
    setLoading(true);
    get()
      .then((r) => {
        setSubs(r.subscribers as Sub[]);
        setStats(r.stats);
      })
      .catch((e) => alert(e?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authChecked) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked]);

  const sources = useMemo(() => Array.from(new Set(subs.map((s) => s.source))), [subs]);
  const filtered = subs.filter(
    (s) =>
      (stepFilter === "all" || s.sequence_step === stepFilter) &&
      (sourceFilter === "all" || s.source === sourceFilter),
  );

  if (!authChecked) return null;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12" style={{ backgroundColor: "#F8F5F0", minHeight: "100vh" }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl italic" style={{ fontFamily: "Instrument Serif", color: "#111", textWrap: "balance" }}>
          Subscribers <span style={{ color: "#EDB200" }}>✦</span>
        </h1>
        <div className="flex gap-3">
          <Link to="/admin/orders" className="text-xs underline" style={{ color: "#111" }}>Orders</Link>
          <Link to="/admin/blog" className="text-xs underline" style={{ color: "#111" }}>Blog</Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats?.total ?? 0 },
          { label: "Active", value: stats?.active ?? 0 },
          { label: "Paused", value: stats?.paused ?? 0 },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-4" style={{ border: "1px solid #E8E3DC" }}>
            <p className="text-xs uppercase tracking-widest" style={{ color: "#6B6560" }}>{c.label}</p>
            <p className="mt-1 text-2xl italic" style={{ fontFamily: "Instrument Serif", color: "#111" }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <select
          value={String(stepFilter)}
          onChange={(e) => setStepFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="rounded-full px-3 py-1 text-xs"
          style={{ backgroundColor: "#fff", border: "1px solid #E8E3DC", color: "#6b4c44" }}
        >
          <option value="all">All steps</option>
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <option key={s} value={s}>Step {s}</option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="rounded-full px-3 py-1 text-xs"
          style={{ backgroundColor: "#fff", border: "1px solid #E8E3DC", color: "#6b4c44" }}
        >
          <option value="all">All sources</option>
          {sources.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border bg-white" style={{ borderColor: "#E8E3DC" }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "#F8F5F0" }}>
            <tr className="text-left" style={{ color: "#6B6560" }}>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">First name</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Step</th>
              <th className="px-4 py-3">Subscribed</th>
              <th className="px-4 py-3">Last emailed</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center" style={{ color: "#6B6560" }}>Loading</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center" style={{ color: "#6B6560" }}>No subscribers.</td></tr>
            ) : filtered.map((s) => (
              <tr key={s.id} className="border-t" style={{ borderColor: "#E8E3DC" }}>
                <td className="px-4 py-3" style={{ color: "#111" }}>{s.email}</td>
                <td className="px-4 py-3" style={{ color: "#6b4c44" }}>{s.first_name ?? "—"}</td>
                <td className="px-4 py-3" style={{ color: "#6b4c44" }}>{s.source}</td>
                <td className="px-4 py-3" style={{ color: "#6b4c44" }}>{s.product_slug ?? "—"}</td>
                <td className="px-4 py-3" style={{ color: "#111" }}>
                  Step {s.sequence_step} of 7 {s.sequence_paused && (
                    <span className="ml-1 rounded-full px-2 py-0.5 text-[10px]" style={{ backgroundColor: "#e5e7eb", color: "#374151" }}>paused</span>
                  )}
                </td>
                <td className="px-4 py-3" style={{ color: "#6b4c44" }}>{new Date(s.subscribed_at).toLocaleDateString()}</td>
                <td className="px-4 py-3" style={{ color: "#6b4c44" }}>
                  {s.last_emailed_at ? new Date(s.last_emailed_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {s.sequence_paused ? (
                      <button
                        onClick={async () => { await toggle({ data: { id: s.id, paused: false } }); refresh(); }}
                        className="text-xs underline"
                        style={{ color: "#111" }}
                      >Resume</button>
                    ) : (
                      <button
                        onClick={async () => { await toggle({ data: { id: s.id, paused: true } }); refresh(); }}
                        className="text-xs underline"
                        style={{ color: "#111" }}
                      >Pause</button>
                    )}
                    <button
                      onClick={async () => { await resend({ data: { id: s.id } }); alert("Resent"); }}
                      className="text-xs underline"
                      style={{ color: "#111" }}
                    >Resend</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
