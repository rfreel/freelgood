export type ChapterFrontmatter = {
  title: string;
  dek: string;
  domainTags: string[];
  publishedAt: string;
  updatedAt: string;
  status: "published" | "draft";
};

export type ChapterIndexItem = {
  slug: string;
  title: string;
  dek: string;
  domainTags: string[];
  status: "published" | "draft";
  order: number;
  publishedAt?: string;
  updatedAt?: string;
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isValidDate = (value: string): boolean => !Number.isNaN(Date.parse(value));

export function validateChapterFrontmatter(data: unknown): ChapterFrontmatter {
  if (!data || typeof data !== "object") {
    throw new Error("Chapter frontmatter must be an object");
  }
  const record = data as Record<string, unknown>;
  const required = ["title", "dek", "domainTags", "publishedAt", "updatedAt", "status"];
  for (const key of required) {
    if (!(key in record)) {
      throw new Error(`Missing frontmatter field: ${key}`);
    }
  }
  if (typeof record.title !== "string" || !record.title) {
    throw new Error("Frontmatter title must be a string");
  }
  if (typeof record.dek !== "string" || !record.dek) {
    throw new Error("Frontmatter dek must be a string");
  }
  if (!isStringArray(record.domainTags)) {
    throw new Error("Frontmatter domainTags must be a string array");
  }
  if (typeof record.publishedAt !== "string" || !isValidDate(record.publishedAt)) {
    throw new Error("Frontmatter publishedAt must be a date string");
  }
  if (typeof record.updatedAt !== "string" || !isValidDate(record.updatedAt)) {
    throw new Error("Frontmatter updatedAt must be a date string");
  }
  if (record.status !== "published" && record.status !== "draft") {
    throw new Error("Frontmatter status must be published or draft");
  }

  return {
    title: record.title,
    dek: record.dek,
    domainTags: record.domainTags,
    publishedAt: record.publishedAt,
    updatedAt: record.updatedAt,
    status: record.status,
  };
}

export function validateChapterIndex(data: unknown): ChapterIndexItem[] {
  if (!Array.isArray(data)) {
    throw new Error("Chapter index must be an array");
  }

  return data.map((item) => {
    if (!item || typeof item !== "object") {
      throw new Error("Chapter index item must be an object");
    }
    const record = item as Record<string, unknown>;
    const required = ["slug", "title", "dek", "domainTags", "status", "order"];
    for (const key of required) {
      if (!(key in record)) {
        throw new Error(`Missing chapter index field: ${key}`);
      }
    }
    if (typeof record.slug !== "string" || !record.slug) {
      throw new Error("Chapter slug must be a string");
    }
    if (typeof record.title !== "string" || !record.title) {
      throw new Error("Chapter title must be a string");
    }
    if (typeof record.dek !== "string" || !record.dek) {
      throw new Error("Chapter dek must be a string");
    }
    if (!isStringArray(record.domainTags)) {
      throw new Error("Chapter domainTags must be a string array");
    }
    if (record.status !== "published" && record.status !== "draft") {
      throw new Error("Chapter status must be published or draft");
    }
    if (typeof record.order !== "number" || Number.isNaN(record.order)) {
      throw new Error("Chapter order must be a number");
    }
    if (record.publishedAt && typeof record.publishedAt !== "string") {
      throw new Error("Chapter publishedAt must be a string");
    }
    if (record.updatedAt && typeof record.updatedAt !== "string") {
      throw new Error("Chapter updatedAt must be a string");
    }

    return {
      slug: record.slug,
      title: record.title,
      dek: record.dek,
      domainTags: record.domainTags,
      status: record.status,
      order: record.order,
      publishedAt: record.publishedAt as string | undefined,
      updatedAt: record.updatedAt as string | undefined,
    };
  });
}
