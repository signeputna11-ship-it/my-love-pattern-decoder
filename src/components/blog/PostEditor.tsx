import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { adminUpsertPost, listCategories, type BlogPost, type BlogCategory } from "@/lib/blog.functions";
import "./blog-prose.css";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function calcReadTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

type FormState = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  youtube_url: string;
  category: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  og_image_url: string;
  read_time_minutes: number;
};

function initialFromPost(p: BlogPost | null): FormState {
  return {
    id: p?.id ?? null,
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    excerpt: p?.excerpt ?? "",
    content: p?.content ?? "",
    featured_image_url: p?.featured_image_url ?? "",
    youtube_url: p?.youtube_url ?? "",
    category: p?.category ?? "",
    tags: p?.tags ?? [],
    published: p?.published ?? false,
    published_at: p?.published_at ?? null,
    meta_title: p?.meta_title ?? "",
    meta_description: p?.meta_description ?? "",
    og_image_url: p?.og_image_url ?? "",
    read_time_minutes: p?.read_time_minutes ?? 1,
  };
}

export function PostEditor({ initialPost }: { initialPost: BlogPost | null }) {
  const navigate = useNavigate();
  const upsert = useServerFn(adminUpsertPost);
  const fetchCats = useServerFn(listCategories);
  const [form, setForm] = useState<FormState>(initialFromPost(initialPost));
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!!initialPost);
  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    fetchCats().then((r) => setCategories(r.categories));
  }, [fetchCats]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Youtube.configure({ controls: true, nocookie: true }),
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
    content: form.content || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setForm((f) => ({
        ...f,
        content: html,
        read_time_minutes: calcReadTime(html),
      }));
    },
  });

  const update = (patch: Partial<FormState>) =>
    setForm((f) => {
      const next = { ...f, ...patch };
      if (patch.title !== undefined && !slugTouched) {
        next.slug = slugify(patch.title);
      }
      return next;
    });

  const doSave = async (publishOverride?: boolean) => {
    if (saving) return;
    const f = formRef.current;
    if (!f.title.trim() || !f.slug.trim()) return;
    setSaving(true);
    try {
      const payload = {
        id: f.id ?? undefined,
        title: f.title,
        slug: f.slug,
        excerpt: f.excerpt || null,
        content: f.content || null,
        featured_image_url: f.featured_image_url || null,
        youtube_url: f.youtube_url || null,
        category: f.category || null,
        tags: f.tags,
        published: publishOverride ?? f.published,
        published_at: f.published_at,
        meta_title: f.meta_title || null,
        meta_description: f.meta_description || null,
        og_image_url: f.og_image_url || null,
        read_time_minutes: f.read_time_minutes,
      };
      const res = await upsert({ data: payload });
      setForm((cur) => ({ ...cur, id: res.post.id, published: res.post.published, published_at: res.post.published_at }));
      setSavedAt(new Date());
      if (!f.id && res.post.id) {
        navigate({ to: "/admin/blog/edit/$id", params: { id: res.post.id }, replace: true });
      }
    } catch (e: any) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Auto-save every 30s if there's a title
  useEffect(() => {
    const t = setInterval(() => {
      if (formRef.current.title.trim() && formRef.current.slug.trim()) doSave();
    }, 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) update({ tags: [...form.tags, t] });
    setTagInput("");
  };

  const seoPreview = useMemo(
    () => ({
      title: form.meta_title || form.title || "Post title",
      url: `mylovepattern.com/blog/${form.slug || "slug"}`,
      description: form.meta_description || form.excerpt || "",
    }),
    [form.meta_title, form.title, form.slug, form.meta_description, form.excerpt],
  );

  const btn = "rounded-md border px-2 py-1 text-xs font-medium";

  return (
    <div className="mx-auto max-w-7xl px-6 py-8" style={{ backgroundColor: "#F8F5F0", minHeight: "100vh" }}>
      <div className="mb-6 flex items-center justify-between">
        <a href="/admin/blog" className="text-sm" style={{ color: "#6b4c44" }}>← All posts</a>
        <div className="flex items-center gap-3 text-xs" style={{ color: "#8A8480" }}>
          {saving ? "Saving..." : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Not saved yet"}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Editor */}
        <div>
          <input
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Post title"
            className="w-full bg-transparent outline-none focus:border-b focus:border-[#111] pb-2"
            style={{ fontFamily: "Instrument Serif, serif", fontSize: "32px", color: "#111111" }}
          />
          <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: "#8A8480" }}>
            <span>mylovepattern.com/blog/</span>
            <input
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); update({ slug: slugify(e.target.value) }); }}
              className="bg-transparent outline-none border-b border-dashed border-[#E8E3DC]"
            />
          </div>

          <textarea
            value={form.excerpt}
            onChange={(e) => update({ excerpt: e.target.value })}
            placeholder="Excerpt (shown on the index card)"
            className="mt-4 w-full rounded-lg border p-3 text-sm"
            style={{ borderColor: "#E8E3DC", backgroundColor: "rgba(255,255,255,0.85)", minHeight: 70 }}
          />

          {/* Toolbar */}
          {editor && (
            <div className="mt-6 mb-2 flex flex-wrap gap-1">
              <button className={btn} onClick={() => editor.chain().focus().toggleBold().run()} style={{ borderColor: "#E8E3DC" }}>B</button>
              <button className={btn} onClick={() => editor.chain().focus().toggleItalic().run()} style={{ borderColor: "#E8E3DC", fontStyle: "italic" }}>I</button>
              <button className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={{ borderColor: "#E8E3DC" }}>H2</button>
              <button className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={{ borderColor: "#E8E3DC" }}>H3</button>
              <button className={btn} onClick={() => editor.chain().focus().toggleBlockquote().run()} style={{ borderColor: "#E8E3DC" }}>“ ”</button>
              <button className={btn} onClick={() => editor.chain().focus().toggleBulletList().run()} style={{ borderColor: "#E8E3DC" }}>• List</button>
              <button className={btn} onClick={() => { const url = prompt("Link URL"); if (url) editor.chain().focus().setLink({ href: url }).run(); }} style={{ borderColor: "#E8E3DC" }}>Link</button>
              <button className={btn} onClick={() => { const url = prompt("Image URL"); if (url) editor.chain().focus().setImage({ src: url }).run(); }} style={{ borderColor: "#E8E3DC" }}>Image</button>
              <button className={btn} onClick={() => { const url = prompt("YouTube URL"); if (url) editor.commands.setYoutubeVideo({ src: url }); }} style={{ borderColor: "#E8E3DC" }}>YouTube</button>
              <button className={btn} onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} style={{ borderColor: "#E8E3DC" }}>Clear</button>
            </div>
          )}

          <div
            className="rounded-2xl border"
            style={{
              borderColor: "#E8E3DC",
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: "24px",
              minHeight: "500px",
            }}
          >
            <EditorContent editor={editor} className="blog-prose" />
          </div>
        </div>

        {/* Settings */}
        <aside className="space-y-6">
          <Section title="Publish">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => update({ published: e.target.checked })} />
              {form.published ? "Published" : "Draft"}
            </label>
            <input
              type="datetime-local"
              value={form.published_at ? form.published_at.substring(0, 16) : ""}
              onChange={(e) => update({ published_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className="mt-2 w-full rounded-md border px-2 py-1 text-sm"
              style={{ borderColor: "#E8E3DC" }}
            />
            <div className="mt-3 flex gap-2">
              <button onClick={() => doSave(false)} className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: "#E8E3DC" }}>Save draft</button>
              <button onClick={() => doSave(true)} className="rounded-full px-4 py-2 text-sm text-white" style={{ backgroundColor: "#111" }}>Publish</button>
            </div>
          </Section>

          <Section title="Featured Image">
            <input
              value={form.featured_image_url}
              onChange={(e) => update({ featured_image_url: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-md border px-2 py-1 text-sm"
              style={{ borderColor: "#E8E3DC" }}
            />
            {form.featured_image_url && !form.featured_image_url.match(/\.(mp4|webm)$/i) && (
              <img src={form.featured_image_url} alt="" className="mt-2 w-full rounded-xl" />
            )}
          </Section>

          <Section title="YouTube">
            <input
              value={form.youtube_url}
              onChange={(e) => update({ youtube_url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full rounded-md border px-2 py-1 text-sm"
              style={{ borderColor: "#E8E3DC" }}
            />
          </Section>

          <Section title="Category">
            <select
              value={form.category}
              onChange={(e) => update({ category: e.target.value })}
              className="w-full rounded-md border px-2 py-1 text-sm"
              style={{ borderColor: "#E8E3DC" }}
            >
              <option value="">— None —</option>
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </Section>

          <Section title="Tags">
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag and press enter"
                className="flex-1 rounded-md border px-2 py-1 text-sm"
                style={{ borderColor: "#E8E3DC" }}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {form.tags.map((t) => (
                <button key={t} onClick={() => update({ tags: form.tags.filter((x) => x !== t) })} className="rounded-full border px-2 py-0.5 text-xs" style={{ borderColor: "#E8E3DC" }}>
                  {t} ×
                </button>
              ))}
            </div>
          </Section>

          <Section title="SEO">
            <input
              value={form.meta_title}
              onChange={(e) => update({ meta_title: e.target.value.slice(0, 60) })}
              placeholder="Meta title"
              className="w-full rounded-md border px-2 py-1 text-sm"
              style={{ borderColor: "#E8E3DC" }}
            />
            <p className="mt-1 text-[10px]" style={{ color: "#8A8480" }}>{form.meta_title.length}/60</p>
            <textarea
              value={form.meta_description}
              onChange={(e) => update({ meta_description: e.target.value.slice(0, 155) })}
              placeholder="Meta description"
              className="mt-2 w-full rounded-md border px-2 py-1 text-sm"
              style={{ borderColor: "#E8E3DC", minHeight: 60 }}
            />
            <p className="mt-1 text-[10px]" style={{ color: "#8A8480" }}>{form.meta_description.length}/155</p>
            <input
              value={form.og_image_url}
              onChange={(e) => update({ og_image_url: e.target.value })}
              placeholder="OG image URL"
              className="mt-2 w-full rounded-md border px-2 py-1 text-sm"
              style={{ borderColor: "#E8E3DC" }}
            />
            <div className="mt-3 rounded-md border p-3" style={{ borderColor: "#E8E3DC", backgroundColor: "#fff" }}>
              <p style={{ color: "#1a0dab", fontSize: "18px", lineHeight: 1.2 }}>{seoPreview.title}</p>
              <p style={{ color: "#006621", fontSize: "13px" }}>{seoPreview.url}</p>
              <p style={{ color: "#545454", fontSize: "14px" }}>{seoPreview.description}</p>
            </div>
          </Section>

          <Section title="Read Time">
            <input
              type="number"
              min={1}
              value={form.read_time_minutes}
              onChange={(e) => update({ read_time_minutes: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-24 rounded-md border px-2 py-1 text-sm"
              style={{ borderColor: "#E8E3DC" }}
            />
            <span className="ml-2 text-xs" style={{ color: "#8A8480" }}>min read</span>
          </Section>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "#E8E3DC", backgroundColor: "rgba(255,255,255,0.85)" }}>
      <h3 className="mb-3 text-xs uppercase" style={{ letterSpacing: "1.5px", color: "#8A8480", fontFamily: "Inter" }}>{title}</h3>
      {children}
    </div>
  );
}
