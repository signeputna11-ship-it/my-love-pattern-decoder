import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/admin/codes")({
  component: AdminCodes,
  head: () => ({ meta: [{ title: "Pass codes" }, { name: "robots", content: "noindex, nofollow" }] }),
});

type Code = {
  id: string;
  code: string;
  tier: "full" | "starter";
  days: number;
  max_uses: number;
  uses: number;
  expires_at: string | null;
  note: string | null;
  active: boolean;
  created_at: string;
};

// No 0, O, 1, I or L, so codes read clearly in a message.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function randomCode(prefix: string) {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${prefix}-${chars.slice(0, 4)}-${chars.slice(4)}`;
}

function AdminCodes() {
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tier, setTier] = useState<"full" | "starter">("full");
  const [days, setDays] = useState(90);
  const [maxUses, setMaxUses] = useState(1);
  const [count, setCount] = useState(5);
  const [prefix, setPrefix] = useState("BETA");
  const [note, setNote] = useState("");

  const load = async () => {
    const { data, error } = await (supabase as any).from("access_codes").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Could not load codes. Admins only.");
    setCodes((data as Code[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const rows = Array.from({ length: Math.min(Math.max(count, 1), 100) }, () => ({
      code: randomCode(prefix.trim().toUpperCase() || "PASS"),
      tier,
      days,
      max_uses: maxUses,
      note: note.trim() || null,
      created_by: u.user?.id ?? null,
    }));
    const { error } = await (supabase as any).from("access_codes").insert(rows);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${rows.length} code${rows.length === 1 ? "" : "s"} created`);
    load();
  };

  const toggle = async (c: Code) => {
    const { error } = await (supabase as any).from("access_codes").update({ active: !c.active }).eq("id", c.id);
    if (error) return toast.error(error.message);
    load();
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied"));
  };

  const copyUnused = () => {
    const list = codes.filter((c) => c.active && c.uses < c.max_uses).map((c) => c.code).join("\n");
    if (!list) return toast.error("No unused codes");
    copy(list);
  };

  const field = "w-full rounded-2xl liquid-glass px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">Admin</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Pass codes</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Create free access codes for beta testers, friends and giveaways. Members redeem them on the Membership page.
      </p>

      <div className="mt-8 liquid-glass-strong rounded-3xl p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-xs uppercase tracking-widest text-foreground/50">
            Access level
            <select value={tier} onChange={(e) => setTier(e.target.value as any)} className={`${field} mt-1 normal-case tracking-normal`}>
              <option value="full">Full Member</option>
              <option value="starter">Starter</option>
            </select>
          </label>
          <label className="text-xs uppercase tracking-widest text-foreground/50">
            Days of access
            <input type="number" min={1} max={3650} value={days} onChange={(e) => setDays(+e.target.value || 1)} className={`${field} mt-1`} />
          </label>
          <label className="text-xs uppercase tracking-widest text-foreground/50">
            Uses per code
            <input type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(+e.target.value || 1)} className={`${field} mt-1`} />
          </label>
          <label className="text-xs uppercase tracking-widest text-foreground/50">
            How many codes
            <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(+e.target.value || 1)} className={`${field} mt-1`} />
          </label>
          <label className="text-xs uppercase tracking-widest text-foreground/50">
            Prefix
            <input value={prefix} onChange={(e) => setPrefix(e.target.value.toUpperCase())} maxLength={8} className={`${field} mt-1`} />
          </label>
          <label className="text-xs uppercase tracking-widest text-foreground/50">
            Note (private)
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. beta wave 1" className={`${field} mt-1 normal-case tracking-normal`} />
          </label>
        </div>
        <button
          onClick={create}
          disabled={busy}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create codes
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-serif text-2xl">Your codes</h2>
        <button onClick={copyUnused} className="rounded-full liquid-glass px-4 py-1.5 text-xs hover:bg-foreground/5">
          Copy all unused
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-foreground/50">Loading…</p>
      ) : codes.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/50">No codes yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {codes.map((c) => {
            const used = c.uses >= c.max_uses;
            return (
              <li key={c.id} className="liquid-glass flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl px-4 py-3 text-sm">
                <button onClick={() => copy(c.code)} className="inline-flex items-center gap-2 font-mono tracking-widest hover:text-foreground/70">
                  {c.code} <Copy className="h-3.5 w-3.5 text-foreground/40" />
                </button>
                <span className="text-foreground/60">{c.tier === "full" ? "Full Member" : "Starter"} · {c.days} days</span>
                <span className={used ? "text-foreground/40" : "text-foreground/70"}>
                  {c.uses}/{c.max_uses} used
                </span>
                {c.note && <span className="text-foreground/40">{c.note}</span>}
                <button onClick={() => toggle(c)} className="ml-auto rounded-full border border-foreground/20 px-3 py-1 text-xs hover:bg-foreground/5">
                  {c.active ? "Switch off" : "Switch on"}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Link to="/app" className="mt-10 inline-block text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground">
        Back to dashboard
      </Link>
    </div>
  );
}
