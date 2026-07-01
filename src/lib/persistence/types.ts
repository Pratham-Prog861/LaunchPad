import type { DraftPage, Release } from "@/lib/schemas/page";

export interface PersistenceAdapter {
  saveDraft(slug: string, draft: DraftPage): Promise<void>;
  loadDraft(slug: string): Promise<DraftPage | null>;
  listDrafts(): Promise<DraftPage[]>;
  saveRelease(slug: string, release: Release): Promise<void>;
  listReleases(slug: string): Promise<Release[]>;
  getRelease(slug: string, version: string): Promise<Release | null>;
}
