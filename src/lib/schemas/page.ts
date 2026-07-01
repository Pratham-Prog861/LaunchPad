import { z } from "zod/v4";
import { PageContentSchema } from "./sections";

// ─── Page Status ───
export const PageStatus = z.enum(["draft", "published"]);
export type PageStatus = z.infer<typeof PageStatus>;

// ─── Page Metadata Schema ───
export const PageMetadataSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  title: z.string().min(1, "Title is required"),
  status: PageStatus.default("draft"),
  version: z.string().default("0.0.0"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type PageMetadata = z.infer<typeof PageMetadataSchema>;

// ─── Draft Page Schema ───
export const DraftPageSchema = z.object({
  metadata: PageMetadataSchema,
  sections: PageContentSchema,
});

export type DraftPage = z.infer<typeof DraftPageSchema>;

// ─── Release Schema (immutable snapshot) ───
export const ReleaseSchema = z.object({
  version: z.string(),
  slug: z.string(),
  snapshot: DraftPageSchema,
  publishedAt: z.string().datetime(),
  publishedBy: z.string(),
  releaseNotes: z.string().optional().default(""),
  bumpType: z.enum(["patch", "minor", "major"]).optional(),
});

export type Release = z.infer<typeof ReleaseSchema>;

// ─── SemVer Bump Type ───
export const BumpType = z.enum(["patch", "minor", "major"]);
export type BumpType = z.infer<typeof BumpType>;
