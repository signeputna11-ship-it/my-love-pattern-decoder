import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeToBlog } from "@/lib/blog.functions";
import { Orb } from "@/components/icons/Orb";

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const subscribe = useServerFn(subscribeToBlog);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<"idle" | "success" | "already" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await subscribe({ data: { email, first_name: firstName || null } });
      setState(res.alreadySubscribed ? "already" : "success");
      setFirstName("");
      setEmail("");
    } catch (err: any) {
      setState("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (state === "success" || state === "already") {
    return (
      <p
        className="font-serif italic"
        style={{ color: "#111111", fontSize: compact ? "20px" : "24px" }}
      >
        {state === "already" ? "You are already subscribed." : "You are in."}{" "}
        <Orb className="inline-block h-[0.8em] w-[0.8em] align-[-0.05em] text-[#C98BA0]" />
      </p>
    );
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.85)",
    border: "1px solid #E8E3DC",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "15px",
    color: "#2c1f1a",
    outline: "none",
    width: "100%",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          maxLength={100}
          style={{ ...inputStyle, flex: "0 0 30%" }}
          className="focus:!border-[#111111]"
        />
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={255}
          style={{ ...inputStyle, flex: 1 }}
          className="focus:!border-[#111111]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#111111", fontFamily: "Inter, sans-serif" }}
        >
          {loading ? "Sending..." : "Get the weekly letter →"}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-sm" style={{ color: "#a33" }}>
          {errorMsg}
        </p>
      )}
    </form>
  );
}
