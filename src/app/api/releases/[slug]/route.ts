import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPersistenceAdapter } from "@/lib/persistence/file-adapter";
import { withRbac } from "@/lib/auth/with-rbac";
import { ROLES } from "@/lib/auth/rbac";

export const GET = withRbac<{ params: Promise<{ slug: string }> }>(
  async (req, { params }) => {
    const { slug } = await params;
    const { orgId } = await auth();
    const { searchParams } = new URL(req.url);
    const version = searchParams.get("version");

    const persistence = getPersistenceAdapter(orgId || undefined);

    if (version) {
      const release = await persistence.getRelease(slug, version);
      if (!release) {
        return new NextResponse("Release not found", { status: 404 });
      }
      return NextResponse.json(release);
    }

    const releases = await persistence.listReleases(slug);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedReleases = releases.slice(startIndex, endIndex);

    return NextResponse.json({
      releases: paginatedReleases,
      total: releases.length,
      page,
      limit,
    });
  },
  { requiredRole: ROLES.VIEWER }
);
