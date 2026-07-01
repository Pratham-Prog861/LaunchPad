import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPersistenceAdapter } from "@/lib/persistence/file-adapter";
import { getCmsAdapter } from "@/lib/adapters";
import { DraftPageSchema } from "@/lib/schemas/page";
import { withRbac } from "@/lib/auth/with-rbac";
import { ROLES } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export const GET = withRbac<{ params: Promise<{ slug: string }> }>(
  async (req, { params }) => {
    const { slug } = await params;
    const { orgId } = await auth();
    const persistence = getPersistenceAdapter(orgId || undefined);

    let draft = await persistence.loadDraft(slug);

    if (!draft) {
      // Fallback: try loading from CMS adapter
      const cms = getCmsAdapter(orgId || undefined);
      const cmsPage = await cms.getPage(slug, true);

      if (cmsPage) {
        draft = cmsPage;
        await persistence.saveDraft(slug, draft);
      }
    }

    if (!draft) {
      return new NextResponse("Draft not found", { status: 404 });
    }

    return NextResponse.json(draft);
  },
  { requiredRole: ROLES.VIEWER }
);

export const PUT = withRbac<{ params: Promise<{ slug: string }> }>(
  async (req, { params }) => {
    const { slug } = await params;
    const body = await req.json();
    const { orgId } = await auth();
    const persistence = getPersistenceAdapter(orgId || undefined);

    const parsed = DraftPageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }
    await persistence.saveDraft(slug, parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/pages");

    return NextResponse.json({ success: true, draft: parsed.data });
  },
  { requiredRole: ROLES.EDITOR }
);
