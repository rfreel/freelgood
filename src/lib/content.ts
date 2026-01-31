import fs from "node:fs/promises";
import path from "node:path";
import {
  validateChapterFrontmatter,
  validateChapterIndex,
  type ChapterFrontmatter,
  type ChapterIndexItem,
} from "./schema";
import { parseFrontmatter, parseSimpleYaml } from "./parse";

const contentRoot = path.resolve("content");

export async function getChaptersIndex(): Promise<ChapterIndexItem[]> {
  const filePath = path.join(contentRoot, "_chapters.yml");
  const raw = await fs.readFile(filePath, "utf-8");
  const data = parseSimpleYaml(raw);
  const parsed = validateChapterIndex(data);
  return [...parsed].sort((a, b) => a.order - b.order);
}

export async function getChapterBySlug(slug: string): Promise<{
  frontmatter: ChapterFrontmatter;
  content: string;
}> {
  const filePath = path.join(contentRoot, "chapters", `${slug}.md`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = parseFrontmatter(raw);
  const frontmatter = validateChapterFrontmatter(data);
  return { frontmatter, content };
}

export async function getAdjacent(slug: string): Promise<{
  prev: ChapterIndexItem | null;
  next: ChapterIndexItem | null;
}> {
  const chapters = await getChaptersIndex();
  const index = chapters.findIndex((item) => item.slug === slug);
  return {
    prev: index > 0 ? chapters[index - 1] : null,
    next: index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : null,
  };
}
