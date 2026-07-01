import type { PersistenceAdapter } from "./types";
import type { DraftPage, Release } from "@/lib/schemas/page";
import fs from "fs/promises";
import path from "path";
import { auth, clerkClient } from "@clerk/nextjs/server";

const hasClerkKeys =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk") &&
  !!process.env.CLERK_SECRET_KEY &&
  !process.env.CLERK_SECRET_KEY.includes("mocksecretkeyfordevelopmentonly");

async function getClerkMetadata() {
  if (!hasClerkKeys) return null;
  try {
    const { userId, orgId } = await auth();
    if (!userId) return null;

    const client = await clerkClient();
    if (orgId) {
      const org = await client.organizations.getOrganization({ organizationId: orgId });
      return {
        type: "org" as const,
        id: orgId,
        metadata: org.publicMetadata || {},
      };
    } else {
      const user = await client.users.getUser(userId);
      return {
        type: "user" as const,
        id: userId,
        metadata: user.unsafeMetadata || {},
      };
    }
  } catch {
    // Gracefully catch cases when called outside of request context (like Next.js build-time compilation)
    return null;
  }
}

async function saveClerkMetadata(data: { launchpad_drafts?: Record<string, DraftPage>; launchpad_releases?: Record<string, Release[]> }) {
  if (!hasClerkKeys) return;
  try {
    const { userId, orgId } = await auth();
    if (!userId) return;

    const client = await clerkClient();
    if (orgId) {
      const org = await client.organizations.getOrganization({ organizationId: orgId });
      const currentMetadata = org.publicMetadata || {};
      await client.organizations.updateOrganizationMetadata(orgId, {
        publicMetadata: {
          ...currentMetadata,
          ...data,
        },
      });
    } else {
      const user = await client.users.getUser(userId);
      const currentMetadata = user.unsafeMetadata || {};
      await client.users.updateUserMetadata(userId, {
        unsafeMetadata: {
          ...currentMetadata,
          ...data,
        },
      });
    }
  } catch (e) {
    console.error("Failed to save Clerk metadata:", e);
    throw e;
  }
}

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
    try {
      const clerk = await getClerkMetadata();
      if (clerk) {
        const drafts = clerk.metadata.launchpad_drafts as Record<string, DraftPage> || {};
        const updatedDrafts = { ...drafts, [slug]: draft };
        await saveClerkMetadata({ launchpad_drafts: updatedDrafts });
        return;
      }
    } catch (e) {
      console.error("Failed to save draft to Clerk metadata, falling back to files:", e);
    }

    const filePath = this.getDraftPath(slug);
    await this.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, JSON.stringify(draft, null, 2), "utf-8");
  }

  async loadDraft(slug: string): Promise<DraftPage | null> {
    try {
      const clerk = await getClerkMetadata();
      if (clerk) {
        const drafts = clerk.metadata.launchpad_drafts as Record<string, DraftPage> || {};
        if (drafts[slug]) {
          return drafts[slug];
        }
      }
    } catch (e) {
      console.error("Failed to load draft from Clerk metadata, falling back to files:", e);
    }

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
    try {
      const clerk = await getClerkMetadata();
      if (clerk) {
        const draftsObj = clerk.metadata.launchpad_drafts as Record<string, DraftPage> || {};
        const clerkDrafts = Object.values(draftsObj);

        // Merge with static files from the repository
        const staticScoped = await this.readDirRecursive(path.join(this.staticBaseDir, "drafts"));
        const staticRoot = await this.readDirRecursive(path.join(this.staticRootDir, "drafts"));
        
        const mergedStatic = [...staticScoped];
        for (const d of staticRoot) {
          if (!mergedStatic.some((m) => m.metadata.slug === d.metadata.slug)) {
            mergedStatic.push(d);
          }
        }

        const merged = [...clerkDrafts];
        for (const d of mergedStatic) {
          if (!merged.some((m) => m.metadata.slug === d.metadata.slug)) {
            merged.push(d);
          }
        }
        return merged;
      }
    } catch (e) {
      console.error("Failed to list drafts from Clerk metadata, falling back to files:", e);
    }

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
    try {
      const clerk = await getClerkMetadata();
      if (clerk) {
        const releasesObj = clerk.metadata.launchpad_releases as Record<string, Release[]> || {};
        const pageReleases = releasesObj[slug] || [];
        const updatedReleases = [release, ...pageReleases.filter(r => r.version !== release.version)];
        const updatedReleasesObj = { ...releasesObj, [slug]: updatedReleases };
        await saveClerkMetadata({ launchpad_releases: updatedReleasesObj });
        return;
      }
    } catch (e) {
      console.error("Failed to save release to Clerk metadata, falling back to files:", e);
    }

    const filePath = this.getReleasePath(slug, release.version);
    await this.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, JSON.stringify(release, null, 2), "utf-8");
  }

  async listReleases(slug: string): Promise<Release[]> {
    try {
      const clerk = await getClerkMetadata();
      if (clerk) {
        const releasesObj = clerk.metadata.launchpad_releases as Record<string, Release[]> || {};
        const activeReleases = releasesObj[slug] || [];

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
    } catch (e) {
      console.error("Failed to list releases from Clerk metadata, falling back to files:", e);
    }

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
    try {
      const clerk = await getClerkMetadata();
      if (clerk) {
        const releasesObj = clerk.metadata.launchpad_releases as Record<string, Release[]> || {};
        const pageReleases = releasesObj[slug] || [];
        const release = pageReleases.find((r) => r.version === version);
        if (release) return release;
      }
    } catch (e) {
      console.error("Failed to get release from Clerk metadata, falling back to files:", e);
    }

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
