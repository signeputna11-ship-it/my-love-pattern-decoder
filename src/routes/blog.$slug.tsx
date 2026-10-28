import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import DOMPurify from "isomorphic-dompurify";
import { getPostBySlug, type BlogPost } from "@/lib/blog.functions";
import { SiteNav } from "@/components/healthy-love/SiteNav";
import { SiteFooter } from "@/components/healthy-love/SiteFooter";
import { VideoBackground } from "@/components/blog/VideoBackground";
import { SubscribeForm } from "@/components/blog/SubscribeForm";
import { PostCard } from "@/components/blog/PostCard";
import { InlineProductCard } from "@/components/blog/InlineProductCard";
import "@/components/blog/blog-prose.css";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const res = await getPostBySlug({ data: { slug: params.slug } });
    if (!res.post) throw notFound();
    return res;
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Post not found · My Love Pattern" }] };
    }
    const url = `https://mylovepattern.com/blog/${post.slug}`;
    const title = post.meta_title || post.title;
    const desc = post.meta_description || post.excerpt || "";
    const image = post.og_image_url || post.featured_image_url || undefined;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt || desc,
      image: image,
      datePublished: post.published_at,
      dateModified: post.updated_at,
      author: {
        "@type": "Person",
        name: "Signe Putna",
        url: "https://mylovepattern.com/deep-reset",
      },
      publisher: {
        "@type": "Organization",
        name: "My Love Pattern",
        url: "https://mylovepattern.com",
      },
    };
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl italic" style={{ color: "#111111" }}>
          Post not found
        </h1>
        <Link to="/blog" className="mt-6 inline-block underline" style={{ color: "#111111" }}>
          ← Back to all posts
        </Link>
      </main>
      <SiteFooter />
    </>
  ),
});

function youTubeId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

function splitHtmlMidpoint(html: string): [string, string] {
  if (!html) return ["", ""];
  const target = Math.floor(html.length / 2);
  // Find the </p> closest to the midpoint
  let bestIdx = -1;
  let bestDist = Infinity;
  const re = /<\/p>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const end = m.index + m[0].length;
    const d = Math.abs(end - target);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = end;
    }
  }
  if (bestIdx < 0) return [html, ""];
  return [html.slice(0, bestIdx), html.slice(bestIdx)];
}

function PostPage() {
  const { post, related, product } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const ytId = youTubeId(post.youtube_url);
  const isVideoFeatured = post.featured_image_url?.match(/\.(mp4|webm|mov)$/i);

  const safeHtml = post.content ? DOMPurify.sanitize(post.content, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "target"],
  }) : "";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const formatDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <>
      <VideoBackground src="https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20CLOSE%20UP.mp4" />
      <SiteNav />
      <main className="relative z-[1]">
        <article
          className="mx-auto"
          style={{ maxWidth: "740px", padding: "100px 24px 80px" }}
        >
          {/* Header */}
          {post.category && (
            <Link
              to="/blog/category/$category"
              params={{ category: post.category }}
              className="inline-block rounded-full px-3 py-1 text-[11px] uppercase text-foreground"
              style={{
                backgroundColor: "#111111",
                letterSpacing: "1.5px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {post.category}
            </Link>
          )}
          <h1
            className="mt-4 italic"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(36px, 5vw, 58px)",
              color: "#111111",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            {post.title}
          </h1>
          <div
            className="flex flex-wrap items-center"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#8A8480",
              gap: "16px",
            }}
          >
            <span>{formatDate(post.published_at)}</span>
            {post.read_time_minutes && (
              <>
                <span>·</span>
                <span>{post.read_time_minutes} min read</span>
              </>
            )}
            {post.category && (
              <>
                <span>·</span>
                <span>{post.category}</span>
              </>
            )}
          </div>
          <hr style={{ border: 0, borderTop: "1px solid #E8E3DC", margin: "24px 0" }} />

          {/* Featured image / video */}
          {post.featured_image_url && !isVideoFeatured && (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full object-cover"
              style={{
                borderRadius: "16px",
                maxHeight: "480px",
                marginBottom: "40px",
              }}
            />
          )}

          {/* YouTube */}
          {ytId && (
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "40px",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title="YouTube video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>
          )}

          {/* Body */}
          {(() => {
            const [first, second] = splitHtmlMidpoint(safeHtml);
            if (!product || !second) {
              return (
                <div
                  className="blog-prose"
                  dangerouslySetInnerHTML={{ __html: safeHtml }}
                />
              );
            }
            return (
              <>
                <div className="blog-prose" dangerouslySetInnerHTML={{ __html: first }} />
                <InlineProductCard product={product} />
                <div className="blog-prose" dangerouslySetInnerHTML={{ __html: second }} />
              </>
            );
          })()}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <>
              <hr style={{ border: 0, borderTop: "1px solid #E8E3DC", margin: "48px 0 24px" }} />
              <div className="flex flex-wrap items-center gap-2">
                <span style={{ fontSize: "13px", color: "#8A8480", fontFamily: "Inter" }}>
                  Topics:
                </span>
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.7)",
                      border: "1px solid #E8E3DC",
                      color: "#6b4c44",
                      fontFamily: "Inter",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Share */}
          <div className="mt-4 flex items-center gap-3">
            <span style={{ fontSize: "13px", color: "#8A8480", fontFamily: "Inter" }}>
              Share:
            </span>
            <button
              onClick={onCopy}
              className="rounded-full px-4 py-2 text-xs"
              style={{
                backgroundColor: "rgba(255,255,255,0.85)",
                border: "1px solid #E8E3DC",
                color: "#111111",
                fontFamily: "Inter",
              }}
            >
              {copied ? "Copied ✦" : "Copy link"}
            </button>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid #E8E3DC", margin: "48px 0" }} />

          {/* CTA */}
          <div
            className="text-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.85)",
              border: "1px solid #E8E3DC",
              borderRadius: "20px",
              padding: "36px",
            }}
          >
            <p
              className="italic"
              style={{
                fontFamily: "Instrument Serif, serif",
                fontSize: "28px",
                color: "#111111",
                lineHeight: 1.2,
              }}
            >
              Find out which pattern is yours.
            </p>
            <p
              className="mt-3"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                color: "#6b4c44",
              }}
            >
              The quiz takes 60 seconds. No sign-up required.
            </p>
            <Link
              to="/home"
              hash="diagnosis"
              className="mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-foreground"
              style={{ backgroundColor: "#111111", fontFamily: "Inter" }}
            >
              Take the free quiz →
            </Link>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <>
              <hr style={{ border: 0, borderTop: "1px solid #E8E3DC", margin: "48px 0 32px" }} />
              <h2
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "18px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: "#8A8480",
                  marginBottom: "20px",
                }}
              >
                <span style={{ color: "#EDB200" }}>✦</span> Read next
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {related.map((p: BlogPost, i: number) => (
                  <PostCard key={p.id} post={p} index={i} />
                ))}
              </div>
            </>
          )}

          {/* Subscribe */}
          <hr style={{ border: 0, borderTop: "1px solid #E8E3DC", margin: "48px 0 32px" }} />
          <div>
            <p
              className="italic"
              style={{
                fontFamily: "Instrument Serif, serif",
                fontSize: "26px",
                color: "#111111",
                marginBottom: "8px",
              }}
            >
              Get the weekly letter.
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#6b4c44",
                marginBottom: "16px",
              }}
            >
              One honest piece of writing on love patterns, every Sunday.
            </p>
            <SubscribeForm />
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
