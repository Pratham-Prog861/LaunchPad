import type { DraftPage } from "@/lib/schemas/page";

/**
 * CMS Adapter Interface
 * Decoupled from any specific CMS — any headless CMS can implement this.
 */
export interface CmsAdapter {
  /** Get a single page by slug. Set preview=true for draft content. */
  getPage(slug: string, preview?: boolean): Promise<DraftPage | null>;

  /** List all pages with optional status filter. */
  listPages(filter?: { status?: "draft" | "published" }): Promise<
    Array<{
      slug: string;
      title: string;
      status: "draft" | "published";
      updatedAt: string;
    }>
  >;

  /** Get version history for a specific page. */
  getPageVersions(
    slug: string
  ): Promise<Array<{ version: string; publishedAt: string }>>;
}
