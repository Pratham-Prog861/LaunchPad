import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPersistenceAdapter } from "@/lib/persistence/file-adapter";
import { getCmsAdapter } from "@/lib/adapters";
import { withRbac } from "@/lib/auth/with-rbac";
import { ROLES } from "@/lib/auth/rbac";
import type { DraftPage } from "@/lib/schemas/page";
import { revalidatePath } from "next/cache";

export const GET = withRbac<unknown>(
  async () => {
    const { orgId } = await auth();
    const persistence = getPersistenceAdapter(orgId || undefined);
    const cms = getCmsAdapter(orgId || undefined);

    const localDrafts = await persistence.listDrafts();
    const cmsPages = await cms.listPages();

    const merged = [
      ...localDrafts.map((d) => ({
        slug: d.metadata.slug,
        title: d.metadata.title,
        status: d.metadata.status,
        updatedAt: d.metadata.updatedAt || new Date().toISOString(),
      })),
    ];

    for (const cmsPage of cmsPages) {
      if (!merged.some((m) => m.slug === cmsPage.slug)) {
        merged.push({
          slug: cmsPage.slug,
          title: cmsPage.title,
          status: cmsPage.status,
          updatedAt: cmsPage.updatedAt,
        });
      }
    }

    return NextResponse.json(merged);
  },
  { requiredRole: ROLES.VIEWER }
);

export const POST = withRbac<unknown>(
  async (req: NextRequest) => {
    const body = await req.json();
    const { slug, title } = body;
    const { orgId } = await auth();
    const persistence = getPersistenceAdapter(orgId || undefined);

    if (!slug || !title) {
      return new NextResponse("Missing slug or title", { status: 400 });
    }

    // Slug validation format check
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return new NextResponse("Invalid slug format", { status: 400 });
    }

    const existing = await persistence.loadDraft(slug);
    if (existing) {
      return new NextResponse("Page with this slug already exists", {
        status: 400,
      });
    }

    const newDraft: DraftPage = {
      metadata: {
        slug,
        title,
        status: "draft",
        version: "0.0.0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      sections: [],
    };

    await persistence.saveDraft(slug, newDraft);
    revalidatePath("/dashboard");
    revalidatePath("/pages");
    return NextResponse.json(newDraft);
  },
  { requiredRole: ROLES.EDITOR }
);
