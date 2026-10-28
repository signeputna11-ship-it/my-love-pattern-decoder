import type { ReactNode } from "react";
import { VideoBackground } from "@/components/blog/VideoBackground";
import { SiteNav } from "@/components/healthy-love/SiteNav";
import { SiteFooter } from "@/components/healthy-love/SiteFooter";
import { RelatedPatterns } from "@/components/healthy-love/RelatedPatterns";

export function PatternPageShell({
  videoSrc,
  title,
  subtitle,
  currentSlug,
  children,
}: {
  videoSrc: string;
  title: string;
  subtitle: string;
  currentSlug: string;
  children: ReactNode;
}) {
  return (
    <>
      <VideoBackground src={videoSrc} />
      <SiteNav />
      <main className="relative z-[1]">
        <article
          className="mx-auto"
          style={{ maxWidth: "740px", padding: "100px 24px 80px" }}
        >
          <h1
            className="italic"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontStyle: "italic",
              fontSize: "clamp(36px, 5vw, 56px)",
              color: "#111111",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#6B6560",
              marginBottom: "32px",
            }}
          >
            <span style={{ color: "#EDB200" }}>✦</span> {subtitle}
          </p>
          <div
            className="pattern-prose"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "17px",
              lineHeight: 1.85,
              color: "#2c1f1a",
            }}
          >
            {children}
          </div>
          <style>{`
            .pattern-prose p { margin-bottom: 20px; font-size: 17px; line-height: 1.85; color: #2c1f1a; }
            .pattern-prose p.lead { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 24px; color: #111111; line-height: 1.4; margin-bottom: 28px; }
            .pattern-prose strong { color: #111111; font-weight: 600; }
            .pattern-prose a { color: #111111; border-bottom: 1px solid #E8E3DC; text-decoration: none; }
          `}</style>
          <RelatedPatterns currentSlug={currentSlug} />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
