import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import type { BlogPost } from "@/lib/blog.functions";

const R2_BASE = "https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/";

const POST_VIDEOS: Record<string, string> = {
  "the-over-investor": "FLOWER%20AND%20CRYSTALS%20ISLAND%20CRYSTAL.mp4",
  "the-unavailable-chaser": "FLOWER%20AND%20CRYSTALS%20ISLAND%20SIDE%20VIEW.mp4",
  "validator-seeker-pattern": "FLOWER%20AND%20CRYSTALS%20ISLAND%20CRYSTAL%20BALL.mp4",
  "boundary-softener-pattern": "ROSES%20FAUNA%20CLOSE%20UP.mp4",
  "different-person-same-relationship": "GEMS%20ISLAND%20MOTION.mp4",
  "why-therapy-didnt-fix-dating": "GEM%20SPARKLE.mp4",
};

const FALLBACK_VIDEOS = [
  "FLOWER%20AND%20CRYSTALS%20CLOSE%20UP.mp4",
  "FLOWER%20AND%20CRYSTALS%20ISLAND%20TOP%20VIEW.mp4",
  "GEM%20SPARKLE.mp4",
  "ROSES%20FAUNA%20CLOSE%20UP.mp4",
];

function resolveMedia(post: BlogPost, index: number): { src: string; isVideo: boolean } {
  const img = post.featured_image_url;
  if (img && /\.(mp4|webm|mov)$/i.test(img)) return { src: img, isVideo: true };
  if (img) return { src: img, isVideo: false };
  const mapped = POST_VIDEOS[post.slug];
  const file = mapped ?? FALLBACK_VIDEOS[index % FALLBACK_VIDEOS.length];
  return { src: R2_BASE + file, isVideo: true };
}

export function PostCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { src, isVideo } = resolveMedia(post, index);
  const preload = index < 3 ? "metadata" : "none";

  const handleEnter = () => {
    videoRef.current?.play().catch(() => {});
  };
  const handleLeave = () => {
    videoRef.current?.pause();
  };

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group block overflow-hidden rounded-[20px] border transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
      style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        borderColor: "#E8E3DC",
      }}
    >
      <div className="relative h-[220px] w-full overflow-hidden">
        {isVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full"
            style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
            muted
            loop
            playsInline
            autoPlay
            preload={preload}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <img src={src} alt={post.title} className="h-full w-full object-cover" />
        )}
        {post.category && (
          <span
            className="absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] uppercase text-white"
            style={{
              backgroundColor: "#111111",
              letterSpacing: "1.5px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {post.category}
          </span>
        )}
      </div>

      <div className="p-6">
        <h3
          className="mb-2.5 italic"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: "clamp(20px, 2.5vw, 26px)",
            color: "#111111",
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className="mb-4 overflow-hidden"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#6b4c44",
              lineHeight: 1.65,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              color: "#8A8480",
            }}
          >
            {post.read_time_minutes ? `${post.read_time_minutes} min read` : "Read"}
          </span>
          <span
            className="transition-transform group-hover:translate-x-1"
            style={{ color: "#111111", fontSize: "16px" }}
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
