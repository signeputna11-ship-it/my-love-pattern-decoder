import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/healthy-love/SiteFooter";
import mlpLogo from "@/assets/signe-coach-mark.png";
import { Orb } from "@/components/icons/Orb";

const CALENDLY = "https://calendly.com/mylovepattern/30min";
const HERO_VIDEO =
  "https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20ISLAND%20CRYSTAL%20BALL.mp4";

const labelCls =
  "inline-block font-sans text-[11px] uppercase tracking-[3px] text-[#8A8480]";

function PrimaryBtn({
  href,
  children,
  large = false,
}: {
  href: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-[#111] font-medium text-white transition hover:opacity-90"
      style={{
        padding: large ? "16px 40px" : "16px 36px",
        fontSize: large ? 16 : 15,
      }}
    >
      {children}
    </a>
  );
}

function RoseBtn({
  href,
  children,
  size = "md",
}: {
  href: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const pad =
    size === "sm" ? "12px 28px" : size === "lg" ? "16px 40px" : "14px 32px";
  const fs = size === "sm" ? 14 : 16;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full font-medium text-foreground transition hover:opacity-95"
      style={{
        padding: pad,
        fontSize: fs,
        background: "linear-gradient(135deg,#E8BAC9, #d99fb2)",
        boxShadow: "0 8px 32px rgba(160,87,78,0.4)",
      }}
    >
      {children}
    </a>
  );
}

function Star({ color = "#EDB200" }: { color?: string }) {
  return <Orb className="inline-block h-[0.8em] w-[0.8em] align-[-0.05em]" style={{ color }} />;
}

const PAIN = [
  {
    t: "You have done the work.",
    b: "You have read the books. You know your attachment style. You can describe the pattern clearly. And you are still ending up in the same place.",
  },
  {
    t: "Insight is not enough.",
    b: "Patterns do not live in the mind. They live in the nervous system, in the part of you that formed its beliefs about love before you had language for any of it.",
  },
  {
    t: "Something has to actually shift.",
    b: "Not managed. Not reframed. Updated at the level where it was formed. That is what this session does.",
  },
];

const INCLUDES = [
  "90-minute private 1:1 session with Signe",
  "Personalised 21-day reset audio meditation to anchor the shift",
  "Pre-session pattern clarity worksheet",
  "Follow-up voice note from Signe within 48 hours",
];

const STEPS = [
  {
    n: "01 · Before",
    t: "Pattern Discovery Call",
    b: "A free 20-minute conversation. We identify what is currently running, how long it has been showing up, and what shift would change the most for you right now.",
  },
  {
    n: "02 · The Session",
    t: "The Pattern Reset",
    b: "A private 90-minute session in a deeply relaxed meditative state. We go to the root of the belief and update it at the level where it was formed. You leave different.",
  },
  {
    n: "03 · After",
    t: "Your 21-Day Audio",
    b: "A personalised audio created specifically for your reset. Listen daily while the shift settles and becomes the new normal.",
  },
];

const FOR_YOU = [
  "You have done the self-development work and something still runs underneath",
  "You recognise the pattern and understand where it comes from. And it keeps happening anyway.",
  "You are ready for root-level change, not another round of managing the symptoms",
  "You want to work with someone who understands both the subconscious mechanism and the emotional reality",
  "You are willing to be honest in a session, not just insightful",
  "You are ready to invest in the shift, not just the understanding",
];

const NOT_FOR_YOU = [
  "You are looking for a quick fix or a pre-recorded course",
  "You are not ready to look honestly at your own patterns",
  "You need clinical or psychiatric support",
];

const FAQ = [
  {
    q: "What actually happens in the session?",
    a: "You enter a deeply relaxed meditative state. From there we locate the belief driving your pattern, understand where it came from, and update it using a subconscious-level approach. You leave with a personalised 21-day audio to anchor the shift.",
  },
  {
    q: "Is this therapy?",
    a: "No. It is a private 1:1 session using a focused subconscious approach. It is not talk therapy, psychiatric care, or a substitute for clinical mental health support.",
  },
  {
    q: "How quickly will I notice a difference?",
    a: "Most women notice a shift in the week following the session. The 21-day audio supports the integration. Some shifts are immediate. Some unfold over weeks. Both are normal.",
  },
  {
    q: "What is the discovery call for?",
    a: "It is a 20-minute conversation so Signe can understand what is currently running for you and confirm this is the right fit. There is no pressure and no obligation.",
  },
  {
    q: "Can I do this online?",
    a: "Yes. All sessions are held online via video call. Signe works with women globally.",
  },
  {
    q: "What if I am not sure which pattern is driving me?",
    a: "Take the free quiz at mylovepattern.com before your discovery call. It takes 60 seconds and gives Signe useful context before you speak.",
  },
];

function StepArrow() {
  return (
    <svg
      width="40"
      height="12"
      viewBox="0 0 40 12"
      fill="none"
      aria-hidden
      className="hidden md:block shrink-0"
    >
      <path
        d="M0 6 H36 M30 1 L36 6 L30 11"
        stroke="#E8E3DC"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="mt-1 shrink-0">
      <path
        d="M3 9.5 L7 13.5 L15 4.5"
        stroke="#EDB200"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="mt-1 shrink-0">
      <path
        d="M4 4 L14 14 M14 4 L4 14"
        stroke="#6B6560"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "#E8E3DC" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-sans text-[17px] font-medium text-[#111]">{q}</span>
        <span
          className="font-serif text-2xl text-[#8A8480] transition-transform"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0)" }}
        >
          +
        </span>
      </button>
      <div
        className="grid overflow-hidden transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          <p
            className="pb-5 font-sans text-[15px] text-[#6b4c44]"
            style={{ lineHeight: 1.75 }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DeepResetPage() {
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ backgroundColor: "#F8F5F0" }} className="min-h-screen">
      {/* MINIMAL NAV */}
      <header className="sticky top-0 z-40 w-full" style={{ backgroundColor: "rgba(248,245,240,0.92)", backdropFilter: "blur(10px)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/home" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-transparent">
              <img src={mlpLogo} alt="Signe Coach" className="h-full w-full object-contain" />
            </span>
            <span className="font-serif text-base text-[#111] sm:text-lg">Signe Coach</span>
          </Link>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#111] px-5 py-2.5 font-sans text-[13px] font-medium text-white transition hover:opacity-90"
          >
            Book a Discovery Call
          </a>
        </div>
      </header>

      {/* SECTION 1 — HERO */}
      <section className="relative flex min-h-[100vh] items-center justify-center overflow-hidden px-6">
        <div aria-hidden className="absolute inset-0">
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(248,245,240,0.88)" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className={labelCls}><Star color="#EDB200" /> Private 1:1 Work with Signe</p>
          <h1
            className="mx-auto mt-6 font-serif italic text-[#111]"
            style={{
              fontSize: "clamp(52px,7vw,88px)",
              lineHeight: 1.02,
              textWrap: "balance",
              maxWidth: 800,
              fontFamily: '"Instrument Serif", serif',
            }}
          >
            The pattern keeps repeating. This is where it stops.
          </h1>
          <p
            className="mx-auto font-sans text-[#6b4c44]"
            style={{ fontSize: 18, maxWidth: 520, marginTop: 28, marginBottom: 40, lineHeight: 1.75 }}
          >
            A private 90-minute session that works at the level where your pattern actually lives. Not managing it. Not understanding it. Resetting it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <PrimaryBtn href={CALENDLY}>Book Your Free Discovery Call →</PrimaryBtn>
            <button
              onClick={() => document.getElementById("whatitis")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center rounded-full bg-transparent font-sans text-[#6b4c44]"
              style={{ border: "1px solid rgba(17,17,17,0.2)", padding: "16px 28px", fontSize: 15 }}
            >
              See what is included ↓
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROBLEM */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="mx-auto" style={{ maxWidth: 760, padding: "100px 24px", textAlign: "center" }}>
          <p className={labelCls}><Star /> If this sounds familiar</p>
          <h2
            className="mt-5 font-serif italic text-[#111]"
            style={{ fontSize: 48, lineHeight: 1.1, textWrap: "balance", marginBottom: 48, fontFamily: '"Instrument Serif", serif' }}
          >
            You already know something is running underneath.
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {PAIN.map((p) => (
              <div
                key={p.t}
                className="text-left"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid #E8E3DC",
                  borderRadius: 20,
                  padding: 32,
                }}
              >
                <p className="text-sm"><Star /></p>
                <p
                  className="font-serif italic text-[#111]"
                  style={{ fontSize: 20, marginTop: 6, marginBottom: 12, fontFamily: '"Instrument Serif", serif' }}
                >
                  {p.t}
                </p>
                <p className="font-sans text-[#6b4c44]" style={{ fontSize: 15, lineHeight: 1.75 }}>
                  {p.b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHAT IT IS */}
      <section id="whatitis" style={{ backgroundColor: "#F8F5F0" }}>
        <div className="mx-auto" style={{ maxWidth: 1000, padding: "100px 24px" }}>
          <div className="grid items-start gap-12 md:grid-cols-2 md:gap-14">
            <div>
              <div
                className="relative flex items-center justify-center overflow-hidden"
                style={{
                  aspectRatio: "3 / 4",
                  borderRadius: 24,
                  background: "rgba(201,133,122,0.08)",
                  border: "1px solid #E8E3DC",
                }}
              >
                <p className="font-serif italic text-[#8A8480]" style={{ fontSize: 18, fontFamily: '"Instrument Serif", serif' }}>
                  Photo of Signe
                </p>
              </div>
              <p className="mt-3 text-center font-sans text-[#8A8480]" style={{ fontSize: 12 }}>
                Signe Putna · RTT Practitioner · 20 years experience
              </p>
            </div>

            <div>
              <p className={labelCls}><Star /> The Deep Pattern Reset</p>
              <h2
                className="mt-5 font-serif italic text-[#111]"
                style={{ fontSize: 42, lineHeight: 1.15, textWrap: "balance", marginBottom: 24, fontFamily: '"Instrument Serif", serif' }}
              >
                One session. A different nervous system story.
              </h2>
              <p className="font-sans text-[#2c1f1a]" style={{ fontSize: 17, lineHeight: 1.85, marginBottom: 20 }}>
                In the session you enter a deeply relaxed meditative state. From that place we work directly on the belief that has been driving your pattern. The one formed early, before you had words for it. We locate it, understand it with the mind of an adult, and update it.
              </p>
              <p className="font-sans text-[#2c1f1a]" style={{ fontSize: 17, lineHeight: 1.85 }}>
                This is not talk therapy. It is not coaching. It is targeted work at the subconscious level where the pattern actually lives.
              </p>

              <div style={{ borderTop: "1px solid #E8E3DC", margin: "32px 0" }} />

              <ul className="space-y-2">
                {INCLUDES.map((i) => (
                  <li key={i} className="flex gap-3 font-sans text-[#2c1f1a]" style={{ fontSize: 16, lineHeight: 1.85 }}>
                    <Star /> <span>{i}</span>
                  </li>
                ))}
              </ul>

              <p
                className="font-serif text-[#111]"
                style={{ fontSize: 56, marginTop: 32, marginBottom: 8, lineHeight: 1, fontFamily: '"Instrument Serif", serif' }}
              >
                $333
              </p>
              <p className="font-sans text-[#8A8480]" style={{ fontSize: 14, marginBottom: 28 }}>
                per private session
              </p>

              <PrimaryBtn href={CALENDLY}>Book Your Free Discovery Call →</PrimaryBtn>
              <p className="mt-4 font-sans text-[#8A8480]" style={{ fontSize: 13 }}>
                The discovery call is 20 minutes. Signe responds to every application personally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="mx-auto" style={{ maxWidth: 900, padding: "100px 24px" }}>
          <p className={`${labelCls} block text-center`}><Star /> The process</p>
          <h2
            className="mt-5 text-center font-serif italic text-[#111]"
            style={{ fontSize: 48, lineHeight: 1.1, textWrap: "balance", marginBottom: 56, fontFamily: '"Instrument Serif", serif' }}
          >
            Three steps to a different story.
          </h2>

          <div className="flex flex-col items-stretch gap-8 md:flex-row md:items-start md:gap-4">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex flex-1 items-start gap-4 md:contents">
                <div className="flex-1">
                  <p className="font-sans uppercase text-[#8A6A00]" style={{ fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>
                    {s.n}
                  </p>
                  <p className="font-serif italic text-[#111]" style={{ fontSize: 26, marginBottom: 10, fontFamily: '"Instrument Serif", serif' }}>
                    {s.t}
                  </p>
                  <p className="font-sans text-[#6b4c44]" style={{ fontSize: 15, lineHeight: 1.75 }}>
                    {s.b}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden self-center md:flex">
                    <StepArrow />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <PrimaryBtn href={CALENDLY}>Book Your Free Discovery Call →</PrimaryBtn>
          </div>
        </div>
      </section>

      {/* SECTION 5 — FOR YOU */}
      <section style={{ backgroundColor: "#F8F5F0" }}>
        <div className="mx-auto" style={{ maxWidth: 760, padding: "80px 24px" }}>
          <p className={`${labelCls} block text-center`}><Star /> This is for you</p>
          <h2
            className="mt-5 text-center font-serif italic text-[#111]"
            style={{ fontSize: 42, lineHeight: 1.1, textWrap: "balance", marginBottom: 40, fontFamily: '"Instrument Serif", serif' }}
          >
            You are ready for this if...
          </h2>

          <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
            {FOR_YOU.map((t) => (
              <div key={t} className="flex gap-3 font-sans text-[#2c1f1a]" style={{ fontSize: 16, lineHeight: 1.7 }}>
                <Check />
                <span>{t}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #E8E3DC", margin: "40px 0" }} />

          <h3
            className="text-center font-serif italic text-[#111]"
            style={{ fontSize: 28, marginBottom: 20, fontFamily: '"Instrument Serif", serif' }}
          >
            This is not for you if...
          </h3>
          <div className="mx-auto grid max-w-xl gap-y-4">
            {NOT_FOR_YOU.map((t) => (
              <div key={t} className="flex gap-3 font-sans text-[#2c1f1a]" style={{ fontSize: 16, lineHeight: 1.7 }}>
                <XIcon />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — TESTIMONIAL */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 700, padding: "80px 24px" }}>
          <p
            className="font-serif"
            style={{ fontSize: 100, color: "rgba(201,133,122,0.15)", lineHeight: 0.7, marginBottom: 16, fontFamily: '"Instrument Serif", serif' }}
          >
            “
          </p>
          <p
            className="font-serif italic text-[#2c1f1a]"
            style={{ fontSize: "clamp(22px,3vw,30px)", lineHeight: 1.6, marginBottom: 28, fontFamily: '"Instrument Serif", serif' }}
          >
            I came to Signe feeling lost despite having everything. Her intuition and method helped me rediscover joy in the simplest moments. I am no longer chasing. I am creating from alignment.
          </p>
          <div className="flex items-center justify-center gap-3.5">
            <div
              className="grid place-items-center rounded-full font-sans text-foreground"
              style={{ width: 48, height: 48, fontSize: 18, background: "linear-gradient(135deg,#E8BAC9,#8a9e8c)" }}
            >
              A
            </div>
            <div className="text-left">
              <p className="font-sans font-medium text-[#111]" style={{ fontSize: 15 }}>Alexandra T.</p>
              <p className="font-sans font-light text-[#8A8480]" style={{ fontSize: 13 }}>Deep Reset client</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — PRICING */}
      <section style={{ backgroundColor: "#F8F5F0" }}>
        <div className="mx-auto" style={{ maxWidth: 700, padding: "80px 24px" }}>
          <div
            className="relative overflow-hidden text-center"
            style={{
              background: "linear-gradient(135deg, #102440, #173D34)",
              border: "1px solid rgba(201,133,122,0.25)",
              borderRadius: 28,
              padding: "60px 52px",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                width: 250,
                height: 250,
                borderRadius: "50%",
                background: "rgba(201,133,122,0.12)",
                filter: "blur(80px)",
                top: -40,
                right: -40,
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                width: 250,
                height: 250,
                borderRadius: "50%",
                background: "rgba(122,92,138,0.08)",
                filter: "blur(80px)",
                bottom: -40,
                left: -40,
              }}
            />
            <div className="relative" style={{ zIndex: 2 }}>
              <span
                className="inline-flex items-center gap-2 rounded-full font-sans"
                style={{
                  padding: "6px 14px",
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <Star /> Limited spots each month
              </span>
              <h2
                className="mt-6 font-serif italic text-foreground"
                style={{ fontSize: 42, lineHeight: 1.1, textWrap: "balance", marginBottom: 16, fontFamily: '"Instrument Serif", serif' }}
              >
                Ready to find out if this is right for you?
              </h2>
              <p
                className="mx-auto font-sans"
                style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 440, marginBottom: 32, lineHeight: 1.7 }}
              >
                The discovery call is free, 20 minutes, and completely without pressure. Signe will tell you honestly whether this session is the right fit.
              </p>
              <p
                className="font-serif text-foreground"
                style={{ fontSize: 64, lineHeight: 1, marginBottom: 4, fontFamily: '"Instrument Serif", serif' }}
              >
                $333
              </p>
              <p className="font-sans" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>
                per private session · free discovery call first
              </p>
              <RoseBtn href={CALENDLY} size="lg">Book Your Free Discovery Call →</RoseBtn>
              <p className="font-sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 16 }}>
                Signe reads every application personally. She responds within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FAQ */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="mx-auto" style={{ maxWidth: 680, padding: "80px 24px 140px" }}>
          <p className={`${labelCls} block text-center`}><Star /> Questions</p>
          <h2
            className="mt-5 text-center font-serif italic text-[#111]"
            style={{ fontSize: 42, lineHeight: 1.1, textWrap: "balance", marginBottom: 40, fontFamily: '"Instrument Serif", serif' }}
          >
            Before you reach out.
          </h2>
          <div>
            {FAQ.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* STICKY FOOTER BAR */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[100] transition-opacity duration-500"
        style={{
          background: "rgba(17,17,17,0.97)",
          backdropFilter: "blur(20px)",
          padding: "16px 24px",
          opacity: showSticky ? 1 : 0,
          pointerEvents: showSticky ? "auto" : "none",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <p className="font-serif italic text-foreground" style={{ fontSize: 18, fontFamily: '"Instrument Serif", serif' }}>
            The Deep Pattern Reset · $333
          </p>
          <RoseBtn href={CALENDLY} size="sm">Book Free Discovery Call →</RoseBtn>
        </div>
      </div>
    </div>
  );
}
