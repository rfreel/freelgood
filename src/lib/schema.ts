import { z } from "zod";

const dateString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Invalid date string",
});

export const chapterFrontmatterSchema = z.object({
  title: z.string().min(1),
  dek: z.string().min(1),
  domainTags: z.array(z.string().min(1)),
  publishedAt: dateString,
  updatedAt: dateString,
  status: z.enum(["published", "draft"]),
});

export const chapterIndexItemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  dek: z.string().min(1),
  domainTags: z.array(z.string().min(1)),
  status: z.enum(["published", "draft"]),
  order: z.number(),
  publishedAt: dateString.optional(),
  updatedAt: dateString.optional(),
});

export const chapterIndexSchema = z.array(chapterIndexItemSchema);

export type ChapterFrontmatter = z.infer<typeof chapterFrontmatterSchema>;
export type ChapterIndexItem = z.infer<typeof chapterIndexItemSchema>;
