import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  youtube_url: string | null;
  category: string | null;
  tags: string[] | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  read_time_minutes: number | null;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

const POST_FIELDS =
  "id,title,slug,excerpt,content,featured_image_url,youtube_url,category,tags,published,published_at,created_at,updated_at,meta_title,meta_description,og_image_url,read_time_minutes";

// PUBLIC: list published posts, optional category filter
export const listPublishedPosts = createServerFn({ method: "GET" })
  .inputValidator((d: { category?: string | null } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    let q = supabaseAdmin
      .from("blog_posts")
      .select(POST_FIELDS)
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (data.category) q = q.eq("category", data.category);
    const { data: posts, error } = await q;
    if (error) throw new Error(error.message);
    return { posts: (posts ?? []) as BlogPost[] };
  });

export type MatchedProduct = {
  slug: string;
  name: string;
  short_description: string | null;
  price_cents: number;
  currency: string;
};

const FALLBACK_PRODUCT_SLUG = "love-pattern-reset-kit";

async function matchProductFor(
  tags: string[] | null,
  category: string | null,
): Promise<MatchedProduct | null> {
  const candidates: string[] = [];
  if (tags) for (const t of tags) candidates.push(t.toLowerCase().trim());
  if (category) candidates.push(category.toLowerCase().trim().replace(/\s+/g, "-"));
  candidates.push(FALLBACK_PRODUCT_SLUG);

  const { data: products } = await supabaseAdmin
    .from("shop_products")
    .select("slug,name,short_description,price_cents,currency")
    .eq("active", true)
    .in("slug", candidates);
  if (!products || products.length === 0) return null;

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  for (const c of candidates) {
    const hit = bySlug.get(c);
    if (hit) return hit as MatchedProduct;
  }
  return null;
}

// PUBLIC: single post by slug + related posts + matched shop product
export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(255) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select(POST_FIELDS)
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post)
      return { post: null, related: [] as BlogPost[], product: null as MatchedProduct | null };

    let related: BlogPost[] = [];
    if (post.category) {
      const { data: rel } = await supabaseAdmin
        .from("blog_posts")
        .select(POST_FIELDS)
        .eq("published", true)
        .eq("category", post.category)
        .neq("id", post.id)
        .order("published_at", { ascending: false })
        .limit(2);
      related = (rel ?? []) as BlogPost[];
    }

    const product = await matchProductFor(post.tags, post.category);
    return { post: post as BlogPost, related, product };
  });

// PUBLIC: list categories
export const listCategories = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("blog_categories")
      .select("id,name,slug,description")
      .order("name");
    if (error) throw new Error(error.message);
    return { categories: (data ?? []) as BlogCategory[] };
  },
);

// PUBLIC: subscribe
const subscribeSchema = z.object({
  email: z.string().trim().email().max(255),
  first_name: z.string().trim().max(100).optional().nullable(),
});
export const subscribeToBlog = createServerFn({ method: "POST" })
  .inputValidator((d) => subscribeSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("blog_subscribers")
      .insert({
        email: data.email.toLowerCase(),
        first_name: data.first_name || null,
        source: "blog",
      });
    if (error) {
      if (error.code === "23505") return { ok: true, alreadySubscribed: true };
      throw new Error(error.message);
    }
    return { ok: true, alreadySubscribed: false };
  });

// ---------- ADMIN ----------

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const adminListPosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select(POST_FIELDS)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { posts: (data ?? []) as BlogPost[] };
  });

export const adminGetPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select(POST_FIELDS)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { post: post as BlogPost | null };
  });

const upsertSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().trim().min(1).max(300),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  excerpt: z.string().max(1000).optional().nullable(),
  content: z.string().optional().nullable(),
  featured_image_url: z.string().max(1000).optional().nullable(),
  youtube_url: z.string().max(500).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  tags: z.array(z.string().max(60)).max(30).optional().nullable(),
  published: z.boolean(),
  published_at: z.string().optional().nullable(),
  meta_title: z.string().max(200).optional().nullable(),
  meta_description: z.string().max(400).optional().nullable(),
  og_image_url: z.string().max(1000).optional().nullable(),
  read_time_minutes: z.number().int().min(1).max(120).optional().nullable(),
});

export const adminUpsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => upsertSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...payload } = data;
    const row = {
      ...payload,
      published_at:
        payload.published && !payload.published_at
          ? new Date().toISOString()
          : payload.published_at || null,
    };
    if (id) {
      const { data: updated, error } = await supabaseAdmin
        .from("blog_posts")
        .update(row)
        .eq("id", id)
        .select(POST_FIELDS)
        .single();
      if (error) throw new Error(error.message);
      return { post: updated as BlogPost };
    }
    const { data: created, error } = await supabaseAdmin
      .from("blog_posts")
      .insert(row)
      .select(POST_FIELDS)
      .single();
    if (error) throw new Error(error.message);
    return { post: created as BlogPost };
  });

export const adminTogglePublish = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; published: boolean }) =>
    z.object({ id: z.string().uuid(), published: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await supabaseAdmin
      .from("blog_posts")
      .update({
        published: data.published,
        published_at: data.published ? new Date().toISOString() : null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
