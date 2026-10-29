import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BOOKING_URL, MEMBER_COUPON_CODE, MEMBER_DISCOUNT_PERCENT, WORK_WITH_SIGNE, memberPrice } from "@/lib/offers";

export const Route = createFileRoute("/app/work-with-signe")({
  component: WorkWithSigne,
  head: () => ({ meta: [{ title: "Work with Signe" }, { name: "robots", content: "noindex, nofollow" }] }),
});

const euro = (n: number) => `${n.toLocaleString("en-IE")} €`;

function WorkWithSigne() {
  const [member, setMember] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await (supabase as any).rpc("has_membership", { _user_id: u.user.id });
      setMember(!!data);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">Work with Signe</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">When you want a guide beside you</h1>
      <p className="mt-3 text-sm text-foreground/70">
        Private online RTT and coaching, built around the pattern you want to change. Start with a free 30-minute call to see if it feels right.
      </p>

      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
      >
        Book your free call <ArrowRight className="h-4 w-4" />
      </a>

      <div className="mt-10 space-y-4">
        {WORK_WITH_SIGNE.map((o) => (
          <div key={o.name} className="liquid-glass-strong rounded-3xl p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-2xl">{o.name}</h2>
              <p className="text-xs uppercase tracking-widest text-foreground/50">{o.length}</p>
            </div>
            <p className="mt-2 text-sm text-foreground/70">{o.blurb}</p>
            <p className="mt-3 font-serif text-3xl">
              {euro(o.price)}
              {o.discount && member && (
                <span className="ml-3 text-base text-foreground/60">
                  Member price {euro(memberPrice(o.price))}
                </span>
              )}
            </p>
            {o.discount && !member && (
              <p className="mt-1 text-sm text-foreground/60">
                Full Members pay {euro(memberPrice(o.price))}.{" "}
                <Link to="/app/membership" className="underline underline-offset-2 hover:text-foreground">
                  See membership
                </Link>
              </p>
            )}
            {o.discount && member && MEMBER_COUPON_CODE && (
              <p className="mt-2 text-sm text-foreground/70">
                Use code <span className="rounded-md bg-foreground/10 px-2 py-0.5 font-medium">{MEMBER_COUPON_CODE}</span> at checkout for {MEMBER_DISCOUNT_PERCENT}% off.
              </p>
            )}
            {o.discount && member && !MEMBER_COUPON_CODE && (
              <p className="mt-2 text-sm text-foreground/70">Mention your membership on the call and your member price is applied.</p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-foreground/40">
        Coaching and RTT are not a replacement for medical or mental health care.
      </p>
    </div>
  );
}
