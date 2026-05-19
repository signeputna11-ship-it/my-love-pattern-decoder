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
              color: "#8A8480",
              marginBottom: "32px",
            }}
          >
            <span style={{ color: "#EDB200" }}>✦</span> {subtitle}
          </p>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "17px",
              lineHeight: 1.85,
              color: "#2c1f1a",
            }}
          >
            {children}
          </div>
          <RelatedPatterns currentSlug={currentSlug} />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
