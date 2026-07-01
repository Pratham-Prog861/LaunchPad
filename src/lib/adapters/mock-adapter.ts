import type { CmsAdapter } from "./types";
import type { DraftPage } from "@/lib/schemas/page";
import { v4 as uuidv4 } from "uuid";
import { getPersistenceAdapter } from "@/lib/persistence/file-adapter";

/**
 * Mock CMS Adapter
 *
 * In-memory implementation for development when Contentful
 * credentials are not available. Provides realistic sample data.
 */

const MOCK_PAGES: DraftPage[] = [];

export class MockAdapter implements CmsAdapter {
  private pages: DraftPage[] = [];
  private orgId: string | undefined;

  constructor(orgId?: string) {
    this.orgId = orgId;
  }

  private get persistence(): ReturnType<typeof getPersistenceAdapter> {
    return getPersistenceAdapter(this.orgId);
  }

  async getPage(slug: string, _preview?: boolean): Promise<DraftPage | null> {
    const localDraft = await this.persistence.loadDraft(slug);
    if (localDraft) {
      return localDraft;
    }
    return this.pages.find((p) => p.metadata.slug === slug) || null;
  }

  async listPages(
    filter?: { status?: "draft" | "published" }
  ): Promise<
    Array<{
      slug: string;
      title: string;
      status: "draft" | "published";
      updatedAt: string;
    }>
  > {
    const localDrafts = await this.persistence.listDrafts();

    const mergedPages = [...localDrafts];
    for (const mockPage of this.pages) {
      if (!mergedPages.some((p) => p.metadata.slug === mockPage.metadata.slug)) {
        mergedPages.push(mockPage);
      }
    }

    let filtered = mergedPages;
    if (filter?.status) {
      filtered = mergedPages.filter((p) => p.metadata.status === filter.status);
    }

    return filtered.map((p) => ({
      slug: p.metadata.slug,
      title: p.metadata.title,
      status: p.metadata.status as "draft" | "published",
      updatedAt: p.metadata.updatedAt || new Date().toISOString(),
    }));
  }

  async getPageVersions(
    _slug: string
  ): Promise<Array<{ version: string; publishedAt: string }>> {
    return [
      {
        version: "1.0.0",
        publishedAt: "2024-09-15T10:00:00.000Z",
      },
      {
        version: "2.0.0",
        publishedAt: "2024-10-01T12:00:00.000Z",
      },
    ];
  }
}
