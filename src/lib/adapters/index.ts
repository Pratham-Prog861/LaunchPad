import type { CmsAdapter } from "./types";
import { ContentfulAdapter } from "./contentful-adapter";
import { MockAdapter } from "./mock-adapter";

const adapterInstances = new Map<string, CmsAdapter>();

/**
 * Factory function that returns the appropriate CMS adapter.
 * Uses Contentful when env vars are present, otherwise falls back to Mock.
 */
export function getCmsAdapter(orgId?: string): CmsAdapter {
  const key = orgId || "__default__";
  if (adapterInstances.has(key)) return adapterInstances.get(key)!;

  const hasContentful =
    process.env.CONTENTFUL_SPACE_ID &&
    process.env.CONTENTFUL_DELIVERY_TOKEN;

  if (hasContentful) {
    console.log("📦 Using Contentful CMS adapter");
    adapterInstances.set(key, new ContentfulAdapter());
  } else {
    console.log("🧪 Using Mock CMS adapter (Contentful credentials not found)");
    adapterInstances.set(key, new MockAdapter(orgId));
  }

  return adapterInstances.get(key)!;
}

export type { CmsAdapter };
