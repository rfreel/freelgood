export type TocItem = {
  depth: 2 | 3;
  title: string;
  id: string;
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractHeadings(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const items: TocItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
    }
    if (inCodeBlock) continue;

    const match = /^(#{2,3})\s+(.*)/.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const title = match[2].trim();
    if (!title) continue;
    items.push({ depth, title, id: slugify(title) });
  }

  return items;
}
