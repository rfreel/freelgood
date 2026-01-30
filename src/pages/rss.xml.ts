import rss from "@astrojs/rss";
import { getChaptersIndex } from "../lib/content";

export async function GET(context: { site: URL }) {
  const chapters = (await getChaptersIndex()).filter(
    (chapter) => chapter.status === "published",
  );

  return rss({
    title: "Soot + Sepia Manual",
    description: "Chapter-based manual for the modern web.",
    site: context.site,
    items: chapters.map((chapter) => ({
      title: chapter.title,
      description: chapter.dek,
      link: `/chapters/${chapter.slug}`,
      pubDate: chapter.publishedAt ? new Date(chapter.publishedAt) : undefined,
    })),
  });
}
