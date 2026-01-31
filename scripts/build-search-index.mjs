import fs from "node:fs/promises";
import path from "node:path";
function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((item) => item.trim());
  }
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }
  return trimmed;
}

function parseSimpleYaml(input) {
  const lines = input.split("\n");
  const items = [];
  let current = null;

  for (const line of lines) {
    if (!line.trim()) continue;
    if (line.trim().startsWith("#")) continue;
    if (line.trim().startsWith("- ")) {
      const entry = line.trim().slice(2);
      current = {};
      items.push(current);
      if (entry) {
        const [key, ...rest] = entry.split(":");
        if (key && rest.length) {
          current[key.trim()] = parseScalar(rest.join(":").trim());
        }
      }
      continue;
    }

    if (!current) continue;
    const [key, ...rest] = line.trim().split(":");
    if (!key || !rest.length) continue;
    current[key.trim()] = parseScalar(rest.join(":").trim());
  }

  return items;
}

function parseFrontmatter(input) {
  if (!input.startsWith("---")) {
    return { data: {}, content: input };
  }

  const end = input.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, content: input };
  }

  const raw = input.slice(3, end).trim();
  const content = input.slice(end + 4).trimStart();
  const data = {};
  const lines = raw.split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;
    const [key, ...rest] = line.trim().split(":");
    if (!key || !rest.length) continue;
    data[key.trim()] = parseScalar(rest.join(":").trim());
  }

  return { data, content };
}

const contentRoot = path.resolve("content");
const outputPath = path.resolve("public", "search-index.json");

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractHeadings(markdown) {
  const lines = markdown.split("\n");
  const items = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
    }
    if (inCodeBlock) continue;

    const match = /^(#{2,3})\s+(.*)/.exec(line);
    if (!match) continue;
    const depth = match[1].length;
    const title = match[2].trim();
    if (!title) continue;
    if (depth === 2 || depth === 3) {
      items.push({ title, id: slugify(title) });
    }
  }

  return items;
}

function extractFigureCaptions(markdown) {
  const matches = [...markdown.matchAll(/<Figure\s+[^>]*caption="([^"]+)"/g)];
  return matches.map((match) => match[1]);
}

async function build() {
  const rawIndex = await fs.readFile(path.join(contentRoot, "_chapters.yml"), "utf-8");
  const chapters = parseSimpleYaml(rawIndex) || [];
  chapters.sort((a, b) => a.order - b.order);

  const items = [];
  for (const chapter of chapters) {
    const raw = await fs.readFile(
      path.join(contentRoot, "chapters", `${chapter.slug}.md`),
      "utf-8",
    );
    const { data, content } = parseFrontmatter(raw);

    items.push({
      title: data.title || chapter.title,
      context: data.dek || chapter.dek,
      href: `/chapters/${chapter.slug}`,
      slug: chapter.slug,
    });

    const headings = extractHeadings(content);
    headings.forEach((heading) => {
      items.push({
        title: data.title || chapter.title,
        context: heading.title,
        href: `/chapters/${chapter.slug}#${heading.id}`,
        slug: chapter.slug,
      });
    });

    const captions = extractFigureCaptions(content);
    captions.forEach((caption) => {
      items.push({
        title: data.title || chapter.title,
        context: caption,
        href: `/chapters/${chapter.slug}`,
        slug: chapter.slug,
      });
    });
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(items, null, 2));
}

build();
