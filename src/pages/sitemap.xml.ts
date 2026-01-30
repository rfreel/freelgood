import { getChaptersIndex } from "../lib/content";

export async function GET(context: { site: URL }) {
  const base = context.site;
  const chapters = (await getChaptersIndex()).filter(
    (chapter) => chapter.status === "published",
  );

  const urls = [
    new URL("/", base),
    new URL("/chapters", base),
    new URL("/about", base),
    new URL("/search", base),
    new URL("/subscribe", base),
    ...chapters.map((chapter) => new URL(`/chapters/${chapter.slug}`, base)),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url.href}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
