import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listPublishedPosts, type BlogPost } from "@/lib/blog.functions";
import { SiteNav } from "@/components/healthy-love/SiteNav";
import { SiteFooter } from "@/components/healthy-love/SiteFooter";
import { VideoBackground } from "@/components/blog/VideoBackground";
import { PostCard } from "@/components/blog/PostCard";
import { SubscribeForm } from "@/components/blog/SubscribeForm";

export const Route = createFileRoute("/blog/category/$category")({
  head: ({ params }) => {
    const cat = decodeURIComponent(params.category);
    return {
      meta: [
        { title: `${cat} · My Love Pattern Blog` },
        { name: "description", content: `Read all posts about ${cat} on My Love Pattern.` },
        { property: "og:title", content: `${cat} · My Love Pattern Blog` },
        { property: "og:description", content: `Read all posts about ${cat} on My Love Pattern.` },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://mylovepattern.com/blog/category/${encodeURIComponent(cat)}`,
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = decodeURIComponent(category);
  const fetchPosts = useServerFn(listPublishedPosts);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts({ data: { category: cat } })
      .then((r) => setPosts(r.posts))
      .finally(() => setLoading(false));
  }, [cat, fetchPosts]);

  return (
    <>
      <VideoBackground />
      <SiteNav />
      <main className="relative z-[1]">
        <section className="mx-auto max-w-[1100px] px-6 pt-16 pb-10">
          <Link to="/blog" className="text-sm" style={{ color: "#6B6560", fontFamily: "Inter" }}>
            ← All posts
          </Link>
          <p
            className="mt-4 uppercase"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              letterSpacing: "2.5px",
              color: "#6B6560",
            }}
          >
            ✦ Category
          </p>
          <h1
            className="mt-3 italic"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(42px, 6vw, 68px)",
              color: "#111111",
              lineHeight: 1.05,
            }}
          >
            {cat}
          </h1>
        </section>

        <section className="mx-auto px-6 pb-[100px]" style={{ maxWidth: "1100px" }}>
          {loading ? (
            <p className="text-center text-sm" style={{ color: "#6B6560" }}>
              Loading...
            </p>
          ) : posts.length === 0 ? (
            <p className="text-center text-sm" style={{ color: "#6B6560" }}>
              No posts in this category yet.
            </p>
          ) : (
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
            >
              {posts.map((p, i) => (
                <PostCard key={p.id} post={p} index={i} />
              ))}
            </div>
          )}
          <div className="mx-auto mt-16 max-w-[640px]">
            <SubscribeForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
