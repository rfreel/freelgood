import { getChapterBySlug, getChaptersIndex } from "./content";
import { extractHeadings, slugify } from "./toc";

export type SearchIndexItem = {
  title: string;
  context: string;
  href: string;
  slug: string;
};

function extractFigureCaptions(markdown: string): string[] {
  const matches = [...markdown.matchAll(/<Figure\s+[^>]*caption="([^"]+)"/g)];
  return matches.map((match) => match[1]);
}

export async function buildSearchIndex(): Promise<SearchIndexItem[]> {
  const chapters = await getChaptersIndex();
  const items: SearchIndexItem[] = [];

  for (const chapter of chapters) {
    const { frontmatter, content } = await getChapterBySlug(chapter.slug);
    items.push({
      title: frontmatter.title,
      context: frontmatter.dek,
      href: `/chapters/${chapter.slug}`,
      slug: chapter.slug,
    });

    const headings = extractHeadings(content);
    headings.forEach((heading) => {
      items.push({
        title: frontmatter.title,
        context: heading.title,
        href: `/chapters/${chapter.slug}#${heading.id || slugify(heading.title)}`,
        slug: chapter.slug,
      });
    });

    const captions = extractFigureCaptions(content);
    captions.forEach((caption) => {
      items.push({
        title: frontmatter.title,
        context: caption,
        href: `/chapters/${chapter.slug}`,
        slug: chapter.slug,
      });
    });
  }

  return items;
}
