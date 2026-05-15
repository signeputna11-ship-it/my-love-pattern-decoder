import { Link } from "@tanstack/react-router";
import type { BlogPost } from "@/lib/blog.functions";

export function PostCard({ post }: { post: BlogPost }) {
  const img = post.featured_image_url;
  const isVideo = img?.match(/\.(mp4|webm|mov)$/i);

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block overflow-hidden rounded-[20px] border transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
      style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        borderColor: "#E8E3DC",
      }}
    >
      <div className="relative h-[220px] w-full overflow-hidden">
        {img && !isVideo ? (
          <img src={img} alt={post.title} className="h-full w-full object-cover" />
        ) : isVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={img!} type="video/mp4" />
          </video>
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(135deg, #EDB200 0%, #F8F5F0 50%, #6b4c44 100%)",
            }}
          />
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
