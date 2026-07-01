import type { PersistenceAdapter } from "./types";
import type { DraftPage, Release } from "@/lib/schemas/page";
import fs from "fs/promises";
import path from "path";

export class FilePersistenceAdapter implements PersistenceAdapter {
  private baseDir: string;
  private rootDir: string;
  private staticBaseDir: string;
  private staticRootDir: string;

  constructor(private orgId?: string) {
    const isVercel = process.env.VERCEL === "1" || !!process.env.NOW_BUILDER;
    this.rootDir = isVercel
      ? path.join("/tmp", "data")
      : path.join(process.cwd(), "data");
    this.staticRootDir = path.join(process.cwd(), "data");

    this.baseDir = orgId ? path.join(this.rootDir, orgId) : this.rootDir;
    this.staticBaseDir = orgId ? path.join(this.staticRootDir, orgId) : this.staticRootDir;
  }

  private getDraftPath(slug: string, dir?: string): string {
    const base = dir || this.baseDir;
    return path.join(base, "drafts", `${slug}.json`);
  }

  private getReleasePath(slug: string, version: string, dir?: string): string {
    const base = dir || this.baseDir;
    return path.join(base, "releases", slug, `${version}.json`);
  }

  private getReleasesDir(slug: string, dir?: string): string {
    const base = dir || this.baseDir;
    return path.join(base, "releases", slug);
  }

  private async readDirRecursive(dir: string): Promise<DraftPage[]> {
    try {
      const files = await fs.readdir(dir);
      const drafts: DraftPage[] = [];
      for (const file of files) {
        if (file.endsWith(".json")) {
          const data = await fs.readFile(path.join(dir, file), "utf-8");
          drafts.push(JSON.parse(data) as DraftPage);
        }
      }
      return drafts;
    } catch {
      return [];
    }
  }

  private async ensureDir(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  async saveDraft(slug: string, draft: DraftPage): Promise<void> {
    const filePath = this.getDraftPath(slug);
    await this.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, JSON.stringify(draft, null, 2), "utf-8");
  }

  async loadDraft(slug: string): Promise<DraftPage | null> {
    const scopedPath = this.getDraftPath(slug);
    try {
      return JSON.parse(await fs.readFile(scopedPath, "utf-8")) as DraftPage;
    } catch {
      try {
        const staticScopedPath = this.getDraftPath(slug, this.staticBaseDir);
        return JSON.parse(await fs.readFile(staticScopedPath, "utf-8")) as DraftPage;
      } catch {
        if (this.orgId) {
          try {
            const fallbackPath = this.getDraftPath(slug, this.rootDir);
            return JSON.parse(await fs.readFile(fallbackPath, "utf-8")) as DraftPage;
          } catch {
            try {
              const staticFallbackPath = this.getDraftPath(slug, this.staticRootDir);
              return JSON.parse(await fs.readFile(staticFallbackPath, "utf-8")) as DraftPage;
            } catch {
              return null;
            }
          }
        }
        return null;
      }
    }
  }

  async listDrafts(): Promise<DraftPage[]> {
    const scoped = await this.readDirRecursive(path.join(this.baseDir, "drafts"));
    const staticScoped = await this.readDirRecursive(path.join(this.staticBaseDir, "drafts"));

    const mergedScoped = [...scoped];
    for (const d of staticScoped) {
      if (!mergedScoped.some((m) => m.metadata.slug === d.metadata.slug)) {
        mergedScoped.push(d);
      }
    }

    if (!this.orgId) return mergedScoped;

    const root = await this.readDirRecursive(path.join(this.rootDir, "drafts"));
    const staticRoot = await this.readDirRecursive(path.join(this.staticRootDir, "drafts"));

    const mergedRoot = [...root];
    for (const d of staticRoot) {
      if (!mergedRoot.some((m) => m.metadata.slug === d.metadata.slug)) {
        mergedRoot.push(d);
      }
    }

    const seen = new Set(mergedScoped.map((d) => d.metadata.slug));
    return [...mergedScoped, ...mergedRoot.filter((d) => !seen.has(d.metadata.slug))];
  }

  async saveRelease(slug: string, release: Release): Promise<void> {
    const filePath = this.getReleasePath(slug, release.version);
    await this.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, JSON.stringify(release, null, 2), "utf-8");
  }

  async listReleases(slug: string): Promise<Release[]> {
    const dir = this.getReleasesDir(slug);
    const staticDir = this.getReleasesDir(slug, this.staticBaseDir);

    const readReleasesFromDir = async (targetDir: string): Promise<Release[]> => {
      try {
        const files = await fs.readdir(targetDir);
        const releases: Release[] = [];
        for (const file of files) {
          if (file.endsWith(".json")) {
            const data = await fs.readFile(path.join(targetDir, file), "utf-8");
            releases.push(JSON.parse(data) as Release);
          }
        }
        return releases;
      } catch {
        return [];
      }
    };

    const activeReleases = await readReleasesFromDir(dir);
    const staticReleases = await readReleasesFromDir(staticDir);

    const mergedReleases = [...activeReleases];
    for (const r of staticReleases) {
      if (!mergedReleases.some((m) => m.version === r.version)) {
        mergedReleases.push(r);
      }
    }

    return mergedReleases.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getRelease(slug: string, version: string): Promise<Release | null> {
    const filePath = this.getReleasePath(slug, version);
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data) as Release;
    } catch {
      try {
        const staticFilePath = this.getReleasePath(slug, version, this.staticBaseDir);
        const data = await fs.readFile(staticFilePath, "utf-8");
        return JSON.parse(data) as Release;
      } catch {
        return null;
      }
    }
  }
}

const adapterInstances = new Map<string, PersistenceAdapter>();

export function getPersistenceAdapter(orgId?: string): PersistenceAdapter {
  const key = orgId || "__default__";
  if (!adapterInstances.has(key)) {
    adapterInstances.set(key, new FilePersistenceAdapter(orgId));
  }
  return adapterInstances.get(key)!;
}
