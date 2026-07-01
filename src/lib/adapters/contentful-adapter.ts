import type { CmsAdapter } from "./types";
import type { DraftPage } from "@/lib/schemas/page";
import type { PageSection } from "@/lib/schemas/sections";

/**
 * Contentful CMS Adapter
 *
 * Uses the Contentful Delivery API (published content) and
 * Preview API (draft content) based on the `preview` flag.
 *
 * Environment variables:
 * - CONTENTFUL_SPACE_ID
 * - CONTENTFUL_DELIVERY_TOKEN
 * - CONTENTFUL_PREVIEW_TOKEN
 * - CONTENTFUL_ENVIRONMENT (defaults to "master")
 */
export class ContentfulAdapter implements CmsAdapter {
  private spaceId: string;
  private deliveryToken: string;
  private previewToken: string;
  private environment: string;

  constructor() {
    this.spaceId = process.env.CONTENTFUL_SPACE_ID || "";
    this.deliveryToken = process.env.CONTENTFUL_DELIVERY_TOKEN || "";
    this.previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN || "";
    this.environment = process.env.CONTENTFUL_ENVIRONMENT || "master";
  }

  private getBaseUrl(preview: boolean): string {
    const host = preview
      ? "preview.contentful.com"
      : "cdn.contentful.com";
    return `https://${host}/spaces/${this.spaceId}/environments/${this.environment}`;
  }

  private getToken(preview: boolean): string {
    return preview ? this.previewToken : this.deliveryToken;
  }

  private async fetchEntries(
    contentType: string,
    query: Record<string, string> = {},
    preview = false
  ) {
    const params = new URLSearchParams({
      access_token: this.getToken(preview),
      content_type: contentType,
      ...query,
    });

    const url = `${this.getBaseUrl(preview)}/entries?${params}`;
    const response = await fetch(url, {
      next: { revalidate: preview ? 0 : 60 },
    });

    if (!response.ok) {
      throw new Error(
        `Contentful API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getPage(slug: string, preview = false): Promise<DraftPage | null> {
    try {
      const data = await this.fetchEntries(
        "page",
        { "fields.slug": slug, include: "3" },
        preview
      );

      if (!data.items || data.items.length === 0) {
        return null;
      }

      const entry = data.items[0];
      return this.mapEntryToDraftPage(entry, data.includes);
    } catch {
      console.error(`Failed to fetch page "${slug}" from Contentful`);
      return null;
    }
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
    try {
      const query: Record<string, string> = { order: "-sys.updatedAt" };
      const data = await this.fetchEntries("page", query, filter?.status === "draft");

      return (data.items || []).map((item: Record<string, unknown>) => {
        const sys = item.sys as Record<string, unknown>;
        const fields = item.fields as Record<string, unknown>;
        return {
          slug: fields.slug as string,
          title: fields.title as string,
          status: (sys.publishedAt ? "published" : "draft") as "draft" | "published",
          updatedAt: sys.updatedAt as string,
        };
      });
    } catch {
      console.error("Failed to list pages from Contentful");
      return [];
    }
  }

  async getPageVersions(
    slug: string
  ): Promise<Array<{ version: string; publishedAt: string }>> {
    // Contentful doesn't natively expose version history via API
    // This would require the Contentful Management API
    console.warn("Version history not available via Contentful Delivery API");
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapEntryToDraftPage(entry: any, includes: any): DraftPage {
    const fields = entry.fields;
    const sys = entry.sys;

    return {
      metadata: {
        slug: fields.slug || "",
        title: fields.title || "",
        status: sys.publishedAt ? "published" : "draft",
        version: `${sys.revision || 1}.0.0`,
        createdAt: sys.createdAt,
        updatedAt: sys.updatedAt,
      },
      sections: this.mapSections(fields.sections || [], includes),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapSections(sectionLinks: any[], includes: any) {
    if (!sectionLinks || !includes?.Entry) return [];

    return sectionLinks
      .map((link: Record<string, unknown>) => {
        const sys = link.sys as Record<string, unknown>;
        const entryId = sys.id as string;
        const entry = includes.Entry.find(
          (e: Record<string, unknown>) => (e.sys as Record<string, unknown>).id === entryId
        );
        if (!entry) return null;

        const contentType = (entry.sys as Record<string, unknown>).contentType as Record<string, unknown>;
        const contentTypeSys = contentType.sys as Record<string, string>;
        const type = contentTypeSys.id;
        const fields = entry.fields as Record<string, unknown>;

        if (type === "heroSection") {
          return {
            id: entryId,
            type: "hero" as const,
            title: (fields.title as string) || "",
            subtitle: (fields.subtitle as string) || "",
            ctaText: (fields.ctaText as string) || "",
            ctaUrl: (fields.ctaUrl as string) || "",
            backgroundImage: (fields.backgroundImage as string) || "",
          };
        }

        if (type === "ctaSection") {
          return {
            id: entryId,
            type: "cta" as const,
            heading: (fields.heading as string) || "",
            description: (fields.description as string) || "",
            primaryAction: fields.primaryAction as { label: string; url: string } | undefined,
            secondaryAction: fields.secondaryAction as { label: string; url: string } | undefined,
          };
        }

        return null;
      })
      .filter(Boolean) as PageSection[];
  }
}
