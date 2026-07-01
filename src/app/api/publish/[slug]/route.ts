import { NextRequest, NextResponse } from "next/server";
import { getPersistenceAdapter } from "@/lib/persistence/file-adapter";
import { withRbac } from "@/lib/auth/with-rbac";
import { ROLES } from "@/lib/auth/rbac";
import { auth, currentUser } from "@clerk/nextjs/server";
import semverInc from "semver/functions/inc";
import type { Release } from "@/lib/schemas/page";
import { z } from "zod/v4";

const PublishBodySchema = z.object({
  bumpType: z.enum(["patch", "minor", "major"]),
  releaseNotes: z.string().optional().default(""),
});

export const POST = withRbac<{ params: Promise<{ slug: string }> }>(
  async (req, { params }) => {
    const { slug } = await params;
    const { orgId } = await auth();
    const persistence = getPersistenceAdapter(orgId || undefined);

    // Load current draft
    const draft = await persistence.loadDraft(slug);
    if (!draft) {
      return new NextResponse("Draft not found", { status: 404 });
    }

    // Parse body
    const body = await req.json();
    const parsed = PublishBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }
    const { bumpType, releaseNotes } = parsed.data;

    // Get releases to determine current version
    const releases = await persistence.listReleases(slug);
    const latestRelease = releases[0] || null;

    // Check idempotency: If the draft sections match the latest release's snapshot sections,
    // and the latest release exists, we can return the latest release.
    if (latestRelease) {
      const draftSectionsJson = JSON.stringify(draft.sections);
      const latestSectionsJson = JSON.stringify(
        latestRelease.snapshot.sections
      );
      if (draftSectionsJson === latestSectionsJson) {
        return NextResponse.json(latestRelease);
      }
    }

    // Determine current version
    const currentVersion = latestRelease ? latestRelease.version : "0.0.0";

    // Bump version
    const newVersion = semverInc(currentVersion, bumpType);
    if (!newVersion) {
      return new NextResponse("Invalid version increment", { status: 400 });
    }

    // Get current user info for auditing
    const user = await currentUser();
    const publishedBy = user
      ? [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown User"
      : "Unknown User";

    // Update draft metadata
    const now = new Date().toISOString();
    const updatedDraft = {
      ...draft,
      metadata: {
        ...draft.metadata,
        version: newVersion,
        status: "published" as const,
        updatedAt: now,
      },
    };

    // Save draft back with updated metadata
    await persistence.saveDraft(slug, updatedDraft);

    // Create and save release
    const release: Release = {
      version: newVersion,
      slug,
      snapshot: updatedDraft,
      publishedAt: now,
      publishedBy,
      releaseNotes,
      bumpType,
    };

    await persistence.saveRelease(slug, release);

    return NextResponse.json(release);
  },
  { requiredRole: ROLES.PUBLISHER }
);
