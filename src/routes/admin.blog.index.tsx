import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { adminListPosts, adminTogglePublish, adminDeletePost, type BlogPost } from "@/lib/blog.functions";

export const Route = createFileRoute("/admin/blog/")({
  head: () => ({ meta: [{ title: "Admin · Blog Posts" }, { name: "robots", content: "noindex" }] }),
  component: AdminBlogIndex,
});

function AdminBlogIndex() {
  const navigate = useNavigate();
  const list = useServerFn(adminListPosts);
  const toggle = useServerFn(adminTogglePublish);
  const del = useServerFn(adminDeletePost);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      setAuthChecked(true);
    });
  }, [navigate]);

  const refresh = () => {
    setLoading(true);
    list().then((r) => setPosts(r.posts)).catch((e) => alert(e?.message)).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authChecked) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked]);

  const filtered = posts.filter((p) =>
    filter === "all" ? true : filter === "published" ? p.published : !p.published,
  );

  if (!authChecked) return null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12" style={{ backgroundColor: "#F8F5F0", minHeight: "100vh" }}>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl italic" style={{ color: "#111", fontFamily: "Instrument Serif" }}>Blog Posts</h1>
        <Link to="/admin/blog/new" className="rounded-full px-5 py-2 text-sm text-white" style={{ backgroundColor: "#111" }}>+ New Post</Link>
      </div>

      <div className="mt-6 flex gap-2">
        {(["all", "published", "drafts"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-full px-3 py-1 text-xs"
            style={{
              backgroundColor: filter === f ? "#111" : "rgba(255,255,255,0.7)",
              color: filter === f ? "#fff" : "#6b4c44",
              border: "1px solid #E8E3DC",
              textTransform: "capitalize",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border bg-white" style={{ borderColor: "#E8E3DC" }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "#F8F5F0" }}>
            <tr className="text-left" style={{ color: "#6B6560" }}>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center" style={{ color: "#6B6560" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center" style={{ color: "#6B6560" }}>No posts.</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="border-t" style={{ borderColor: "#E8E3DC" }}>
                <td className="px-4 py-3" style={{ color: "#111" }}>{p.title}</td>
                <td className="px-4 py-3" style={{ color: "#6b4c44" }}>{p.category || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className="rounded-full px-2 py-0.5 text-xs"
                    style={{
                      backgroundColor: p.published ? "#dcfce7" : "#e5e7eb",
                      color: p.published ? "#166534" : "#374151",
                    }}
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: "#6b4c44" }}>
                  {p.published_at ? new Date(p.published_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link to="/admin/blog/edit/$id" params={{ id: p.id }} className="text-xs underline" style={{ color: "#111" }}>Edit</Link>
                    <button
                      onClick={async () => { await toggle({ data: { id: p.id, published: !p.published } }); refresh(); }}
                      className="text-xs underline"
                      style={{ color: "#111" }}
                    >
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={async () => { if (confirm("Delete this post?")) { await del({ data: { id: p.id } }); refresh(); } }}
                      className="text-xs underline"
                      style={{ color: "#a33" }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
