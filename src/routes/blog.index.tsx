import { useEffect, useState } from "react";
import { useNavigate, createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listPublishedPosts, listCategories, type BlogPost, type BlogCategory } from "@/lib/blog.functions";
import { SiteNav } from "@/components/healthy-love/SiteNav";
import { SiteFooter } from "@/components/healthy-love/SiteFooter";
import { VideoBackground } from "@/components/blog/VideoBackground";
import { SubscribeForm } from "@/components/blog/SubscribeForm";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryPills } from "@/components/blog/CategoryPills";
import { Orb } from "@/components/icons/Orb";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog · My Love Pattern" },
      {
        name: "description",
        content:
          "Honest writing on love patterns, self-worth, and why the same relationship keeps finding you.",
      },
      { property: "og:title", content: "Blog · My Love Pattern" },
      {
        property: "og:description",
        content:
          "Honest writing on love patterns, self-worth, and why the same relationship keeps finding you.",
      },
      { property: "og:url", content: "https://mylovepattern.com/blog" },
    ],
    links: [{ rel: "canonical", href: "https://mylovepattern.com/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const fetchPosts = useServerFn(listPublishedPosts);
  const fetchCats = useServerFn(listCategories);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPosts({ data: {} }), fetchCats()])
      .then(([p, c]) => {
        setPosts(p.posts);
        setCategories(c.categories);
      })
      .finally(() => setLoading(false));
  }, [fetchPosts, fetchCats]);

  const filtered = active ? posts.filter((p) => p.category === active) : posts;

  return (
    <>
      <VideoBackground />
      <SiteNav />
      <main className="relative z-[1]">
        {/* Hero */}
        <section className="mx-auto max-w-[1100px] px-6 pt-16 pb-10">
          <p
            className="uppercase"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              letterSpacing: "2.5px",
              color: "#6B6560",
            }}
          >
            <Orb className="mr-1.5 inline-block h-[0.8em] w-[0.8em] align-[-0.05em]" /> Weekly Writing
          </p>
          <h1
            className="mt-4 italic"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(42px, 6vw, 68px)",
              color: "#111111",
              lineHeight: 1.05,
            }}
          >
            Understand why it keeps happening.
          </h1>
          <p
            className="mt-4 max-w-[520px]"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "18px",
              color: "#6b4c44",
              lineHeight: 1.55,
            }}
          >
            Honest writing on love patterns, self-worth, and why the same relationship keeps finding you.
          </p>
          <div className="mt-8 max-w-[640px]">
            <SubscribeForm />
          </div>
        </section>

        {/* Filters */}
        {categories.length > 0 && (
          <CategoryPills categories={categories} active={active} onChange={setActive} />
        )}

        {/* Grid */}
        <section
          className="mx-auto px-6 pb-[100px]"
          style={{ maxWidth: "1100px" }}
        >
          {loading ? (
            <p className="text-center text-sm" style={{ color: "#6B6560" }}>
              Loading...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm" style={{ color: "#6B6560" }}>
              No posts in this category yet.
            </p>
          ) : (
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
            >
              {filtered.map((p, i) => (
                <PostCard key={p.id} post={p} index={i} />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
