import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];
        const staticUrls = [
          { loc: "https://mylovepattern.com/", changefreq: "weekly", lastmod: today },
          { loc: "https://mylovepattern.com/deep-reset", changefreq: "monthly", lastmod: today },
          { loc: "https://mylovepattern.com/blog", changefreq: "weekly", lastmod: today },
          { loc: "https://mylovepattern.com/shop", changefreq: "weekly", lastmod: today },
          { loc: "https://mylovepattern.com/the-over-investor", changefreq: "monthly", lastmod: today },
          { loc: "https://mylovepattern.com/the-unavailable-chaser", changefreq: "monthly", lastmod: today },
          { loc: "https://mylovepattern.com/the-validator-seeker", changefreq: "monthly", lastmod: today },
          { loc: "https://mylovepattern.com/the-boundary-softener", changefreq: "monthly", lastmod: today },
        ];

        const [{ data: posts }, { data: cats }, { data: shopProducts }] = await Promise.all([
          supabaseAdmin
            .from("blog_posts")
            .select("slug,updated_at")
            .eq("published", true),
          supabaseAdmin.from("blog_categories").select("name"),
          supabaseAdmin
            .from("shop_products")
            .select("slug,updated_at")
            .eq("active", true),
        ]);

        const postUrls = (posts ?? []).map((p) => ({
          loc: `https://mylovepattern.com/blog/${p.slug}`,
          lastmod: (p.updated_at ?? today).split("T")[0],
          changefreq: "weekly",
        }));

        const catUrls = (cats ?? []).map((c) => ({
          loc: `https://mylovepattern.com/blog/category/${encodeURIComponent(c.name)}`,
          lastmod: today,
          changefreq: "weekly",
        }));

        const shopUrls = (shopProducts ?? []).map((p) => ({
          loc: `https://mylovepattern.com/shop/${p.slug}`,
          lastmod: (p.updated_at ?? today).split("T")[0],
          changefreq: "monthly",
        }));

        const all = [...staticUrls, ...shopUrls, ...postUrls, ...catUrls];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq></url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
