import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/healthy-love/SiteNav";
import { SiteFooter } from "@/components/healthy-love/SiteFooter";
import { VideoBackground } from "@/components/blog/VideoBackground";
import signePortrait from "@/assets/signe-her-own-roots.jpg";
import rttBadge from "@/assets/rtt-certified-badge.png";

const ABOUT_VIDEO =
  "https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20ISLAND%20SIDE%20VIEW.mp4";

const SIGNE_MAILTO =
  "mailto:mylovepattern@gmail.com?subject=Deep%20Pattern%20Reset%20%E2%80%94%20Discovery%20Call&body=Hi%20Signe%2C%20I%20am%20interested%20in%20the%20Deep%20Pattern%20Reset%20session.%20I%20would%20love%20to%20arrange%20a%20discovery%20call.%20My%20name%20is%3A";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About My Love Pattern" },
      {
        name: "description",
        content:
          "My Love Pattern was created to help women understand the relationship patterns keeping them stuck. Founded by Signe.",
      },
      { property: "og:title", content: "About My Love Pattern" },
      {
        property: "og:description",
        content:
          "My Love Pattern was created to help women understand the relationship patterns keeping them stuck. Founded by Signe.",
      },
      { property: "og:url", content: "https://mylovepattern.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://mylovepattern.com/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About My Love Pattern",
          url: "https://mylovepattern.com/about",
          mainEntity: {
            "@type": "Person",
            name: "Signe Putna",
            jobTitle: "Founder, My Love Pattern",
            url: "https://mylovepattern.com",
          },
        }),
      },
    ],
  }),
  component: AboutPage,
});

const eyebrow =
  "font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground";

function Ornament() {
  return (
    <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-6 opacity-40">
      <div className="h-px flex-1 bg-border" />
      <span className="font-serif text-xs italic tracking-[0.2em] text-muted-foreground">
        ✦
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

const FOR_ITEMS: Array<[string, string, string]> = [
  [
    "01",
    "You have done the work and something is still running",
    "You can name the pattern. You understand it. You cannot stop it. That gap between knowing and changing is where this work lives.",
  ],
  [
    "02",
    "You moved somewhere new and the same feeling followed you",
    "New city, new life, new version of you. And a few months in , the same pattern. Different context. Same root. The root travels with you until it is touched.",
  ],
  [
    "03",
    "You are exhausted from performing your own life",
    "You give before anything is established. You adjust, soften, over-explain. You have lost the thread back to yourself and are not sure when that happened.",
  ],
  [
    "04",
    "Anxiety that makes no logical sense",
    "Your nervous system learned that peace was not safe. It learned to stay alert. That is not who you are. That is a programme running. It can be changed.",
  ],
  [
    "05",
    "You keep attracting the same person",
    "Different face, same energy. The familiar feels like home even when home was painful. Your subconscious is just selecting what it already knows.",
  ],
  [
    "06",
    "You are ready for something that actually goes there",
    "Not another framework. The real thing. Work that reaches where nothing else has. You already know the difference. That is why you are still reading.",
  ],
];

const PROOF_BULLETS = [
  "Healed Juvenile Idiopathic Arthritis through Reiki and inner work. Not managed. Healed.",
  "Ended years of panic attacks in a single RTT session. Have not had one since.",
  "Broke a 15-year relationship pattern across different people, same ending, same root.",
];

const CREDENTIALS = [
  "RTT · Marisa Peer",
  "Reiki 20+ years",
  "Kundalini Yoga",
  "Intuitive Coaching",
];

const SESSION_STEPS: Array<[string, string, string]> = [
  [
    "i",
    "We find the root",
    "RTT process takes you to the subconscious origin , the original moment the pattern was installed. Not as a concept. As a felt experience.",
  ],
  [
    "ii",
    "We change it there",
    "We reframe the original decision at the root. New neural pathways form. The old response loses its grip. Not intellectually , in the body.",
  ],
  [
    "iii",
    "Energetic clearing",
    "Reiki energy work releases what the body has been holding. The mind and body are not separate. Both need to let go.",
  ],
  [
    "iv",
    "Your personalised recording",
    "A custom audio made specifically for you to continue the rewiring for 21 days after the session. This is where the change compounds.",
  ],
];

function AboutPage() {
  return (
    <>
      <VideoBackground src={ABOUT_VIDEO} />
      <SiteNav />
      <main className="relative z-[1]">
        {/* HERO */}
        <section className="px-6 pb-16 pt-20 sm:pt-28">
          <div className="mx-auto grid max-w-6xl items-end gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className={eyebrow}>About Signe ✦ Porto</p>
              <h1 className="mt-6 font-serif text-[clamp(44px,7vw,84px)] font-normal leading-[0.95] tracking-tight text-foreground">
                You already know
                <br />
                something needs
                <br />
                <em>to change.</em>
              </h1>
              <p className="mt-6 max-w-md text-base font-light leading-[1.7] text-muted-foreground sm:text-[17px]">
                One session. Ninety minutes. We go to the root of what is running
                and change it there. Not talk about it. Change it.
              </p>
            </div>

            <div className="flex flex-col items-start gap-5 md:items-end">
              <div className="md:text-right">
                <p className={eyebrow}>Deep Pattern Reset</p>
                <p className="mt-3 font-serif text-3xl italic text-foreground sm:text-4xl">
                  A private 90-minute session
                </p>
                <p className="mt-2 text-xs font-light tracking-wider text-muted-foreground">
                  Online or in person · Porto
                </p>
              </div>
              <a
                href={SIGNE_MAILTO}
                className="inline-flex items-center rounded-full bg-foreground px-7 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-background transition hover:opacity-90"
              >
                Book a Deep Pattern Reset
              </a>
              <a
                href="#session"
                className="inline-flex items-center rounded-full border border-border px-7 py-3 text-[11px] font-normal uppercase tracking-[0.15em] text-muted-foreground transition hover:border-foreground hover:text-foreground"
              >
                What happens in a session
              </a>
            </div>
          </div>

          {/* Credentials strip */}
          <div className="mx-auto mt-16 flex max-w-6xl flex-wrap items-center gap-6 border-t border-border pt-6">
            {CREDENTIALS.map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                <p className="text-[11px] font-light tracking-wider text-muted-foreground">
                  {t}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Ornament />

        {/* MIRROR */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className={eyebrow}>The truth of it</p>
              <h2 className="mt-5 font-serif text-[clamp(28px,3.5vw,44px)] font-normal leading-[1.3] text-foreground">
                You have tried
                <br />
                everything.
                <br />
                <br />
                <em>And something
                <br />
                is still there.</em>
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              <p className="text-[15px] font-light leading-[1.85] text-foreground">
                You have done the therapy. You have read every book. You have
                journalled, retreated, set intentions. You are self-aware. You
                are trying. And underneath all of it, the same pattern keeps
                running. The same feeling. The same ending.
              </p>
              <p className="text-[15px] font-light leading-[1.85] text-foreground">
                That is not weakness. That is not a lack of effort. That is what
                happens when healing stays in the mind and never reaches the
                root.
              </p>
              <p className="text-[15px] font-light leading-[1.85] text-foreground">
                The root is not in your thoughts. It is in your body, your
                subconscious, your nervous system , the decisions you made
                before you were old enough to know you were making them.{" "}
                <strong className="font-medium">
                  That is where I work. That is the only place this actually
                  changes.
                </strong>
              </p>
            </div>
          </div>
        </section>

        <Ornament />

        {/* WHO THIS IS FOR */}
        <section className="border-y border-border bg-accent/40 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <p className={eyebrow}>You are in the right place if</p>
            <h2 className="mt-5 font-serif text-[clamp(30px,4.5vw,52px)] font-normal italic leading-[1.05] text-foreground">
              Any of this sounds like your inner voice
            </h2>
            <div className="mt-10 grid gap-[2px] sm:grid-cols-2 lg:grid-cols-3">
              {FOR_ITEMS.map(([n, title, body]) => (
                <div
                  key={n}
                  className="border border-border bg-background p-7 transition hover:border-foreground"
                >
                  <p className="font-serif text-4xl italic leading-none text-border">
                    {n}
                  </p>
                  <h3 className="mt-5 text-sm font-medium leading-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs font-light leading-[1.7] text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Ornament />

        {/* ABOUT SIGNE */}
        <section id="about" className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid items-start gap-12 md:grid-cols-[1fr_1.5fr] md:gap-16">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-accent">
              <img
                src={signePortrait}
                alt="Signe Putna, founder of My Love Pattern"
                className="aspect-[3/4] h-full w-full object-cover"
              />
              <p className="absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-[0.15em] text-background/90 drop-shadow">
                Signe Putna
              </p>
            </div>
            <div>
              <p className={eyebrow}>Who you are working with</p>
              <h2 className="mt-5 font-serif text-[clamp(30px,3.5vw,48px)] font-normal leading-[1.05] text-foreground">
                I do not teach
                <br />
                what I studied.
                <br />
                <em>I show you
                <br />
                what I lived.</em>
              </h2>
              <p className="mt-6 text-[15px] font-light leading-[1.85] text-foreground">
                I have been doing this work since I was 14. Reiki found me
                first. Then meditation, kundalini, and RTT. I have used this
                work on myself first , before I ever offered it to anyone else.
              </p>

              <div className="mt-6 border-t border-border">
                {PROOF_BULLETS.map((t) => (
                  <div
                    key={t}
                    className="flex items-baseline gap-4 border-b border-border py-3"
                  >
                    <span className="shrink-0 font-serif text-xs italic text-muted-foreground">
                      ✦
                    </span>
                    <p className="text-[13px] font-light leading-[1.55] text-foreground">
                      {t}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-[15px] font-light leading-[1.85] text-foreground">
                I know exactly what you are carrying. I know because I carried
                it too. And I know what it takes to put it down.{" "}
                <strong className="font-medium">
                  Not manage it. Put it down.
                </strong>
              </p>
              <p className="mt-4 text-[15px] font-light leading-[1.85] text-foreground">
                When we work together, something ancient moves through the
                room. I am just the channel. You are the destination. You
                always were.
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {CREDENTIALS.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-border px-3 py-1 text-[9px] font-normal uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Ornament />

        {/* THE SESSION */}
        <section
          id="session"
          className="bg-foreground px-6 py-16 text-background"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-background/40">
                  The Deep Pattern Reset
                </p>
                <h2 className="mt-5 font-serif text-[clamp(36px,5vw,60px)] font-normal leading-none">
                  One session.
                  <br />
                  <em className="opacity-60">The root.</em>
                  <br />
                  Changed.
                </h2>
                <p className="mt-6 text-[15px] font-light leading-[1.82] text-background/65">
                  This is not a consultation. This is not a discovery call.
                  This is the work itself , 90 minutes that go to the exact
                  origin of the pattern and change it there.
                </p>
              </div>

              <div>
                {SESSION_STEPS.map(([n, title, desc]) => (
                  <div
                    key={n}
                    className="grid grid-cols-[2rem_1fr] items-start gap-5 border-b border-background/10 py-5"
                  >
                    <span className="pt-0.5 font-serif text-sm italic text-background/30">
                      {n}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium tracking-wide">
                        {title}
                      </p>
                      <p className="mt-1 text-xs font-light leading-[1.65] text-background/55">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
                <a
                  href={SIGNE_MAILTO}
                  className="mt-8 inline-flex items-center rounded-full bg-background px-7 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground transition hover:opacity-90"
                >
                  Book a Deep Pattern Reset
                </a>
              </div>
            </div>
          </div>
        </section>

        <Ornament />

        {/* CLOSING */}
        <section className="relative overflow-hidden px-6 py-24 text-center">
          <p
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[18vw] italic leading-none text-border/50"
          >
            Return
          </p>
          <p className={`${eyebrow} relative`}>You have been looking for this</p>
          <h2 className="relative mt-5 font-serif text-[clamp(40px,6vw,76px)] font-normal leading-[0.95] text-foreground">
            You are not here
            <br />
            <em>by accident.</em>
          </h2>
          <p className="relative mx-auto mt-6 max-w-md text-[17px] font-light leading-[1.7] text-muted-foreground">
            Something in you recognises this. That recognition is not coincidence.
            It is you, knowing you have finally found the right door. Step
            through.
          </p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={SIGNE_MAILTO}
              className="inline-flex items-center rounded-full bg-foreground px-7 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-background transition hover:opacity-90"
            >
              Book a Deep Pattern Reset
            </a>
            <a
              href={SIGNE_MAILTO}
              className="inline-flex items-center rounded-full border border-border px-7 py-3 text-[11px] font-normal uppercase tracking-[0.15em] text-muted-foreground transition hover:border-foreground hover:text-foreground"
            >
              Write to Signe first
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
