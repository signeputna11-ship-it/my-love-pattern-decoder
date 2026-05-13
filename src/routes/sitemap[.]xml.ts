import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];
        const urls = [
          "https://mylovepattern.com/",
          "https://mylovepattern.com/about",
          "https://mylovepattern.com/blog",
          "https://mylovepattern.com/blog/the-over-investor",
          "https://mylovepattern.com/the-over-investor",
          "https://mylovepattern.com/the-unavailable-chaser",
          "https://mylovepattern.com/the-validator-seeker",
          "https://mylovepattern.com/the-boundary-softener",
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq></url>`,
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
