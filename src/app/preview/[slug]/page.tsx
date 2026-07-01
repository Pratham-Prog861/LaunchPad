"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { PageRenderer } from "@/components/renderer/page-renderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Rocket, Loader2 } from "lucide-react";
import Link from "next/link";
import type { DraftPage, Release, PageMetadata } from "@/lib/schemas/page";
import type { PageSection } from "@/lib/schemas/sections";
import { PublishDialog } from "@/components/editor/publish-dialog";
import { StoreProvider } from "@/lib/store/provider";
import { useAppDispatch } from "@/lib/store/store";
import { setPage } from "@/lib/store/slices/draft-page-slice";
import { setCurrentVersion } from "@/lib/store/slices/publish-slice";

function PreviewPageInner({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const version = searchParams.get("version");

  const { organization, membership, isLoaded } = useOrganization();
  const canPublish =
    isLoaded &&
    (!organization ||
      membership?.role === "org:publisher" ||
      membership?.role === "org:admin" ||
      membership?.role === "admin" ||
      membership?.role === "owner");

  const [sections, setSections] = useState<PageSection[]>([]);
  const [pageMetadata, setPageMetadata] = useState<PageMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishOpen, setPublishOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function loadPreview() {
      setLoading(true);
      try {
        if (version) {
          const res = await fetch(`/api/releases/${slug}?version=${version}`);
          if (res.ok) {
            const data: Release = await res.json();
            setSections(data.snapshot.sections);
            setPageMetadata(data.snapshot.metadata);
          } else {
            router.push("/");
          }
        } else {
          const res = await fetch(`/api/drafts/${slug}`);
          if (res.ok) {
            const data: DraftPage = await res.json();
            setSections(data.sections);
            setPageMetadata(data.metadata);

            // Sync to Redux so PublishDialog has the correct state context
            dispatch(
              setPage({ metadata: data.metadata, sections: data.sections })
            );
            dispatch(setCurrentVersion(data.metadata.version || "0.0.0"));
          } else {
            router.push("/");
          }
        }
      } catch (err) {
        console.error("Error loading preview content", err);
      } finally {
        setLoading(false);
      }
    }
    loadPreview();
  }, [slug, version, router, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-text-secondary">
        <Loader2 className="w-10 h-10 animate-spin text-indigo mb-2" />
        <span className="text-sm font-semibold font-sans">
          Loading page preview...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Preview Bar */}
      <header className="flex justify-between items-center px-6 bg-slate-900 border-b border-slate-800 h-14 text-white z-70 sticky top-0">
        <div className="flex items-center gap-3">
          <Link href={`/studio/${slug}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800 gap-1.5 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Editor
            </Button>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Previewing:</span>
            <span className="font-semibold text-xs text-white">
              {pageMetadata?.title}
            </span>
            <Badge className="bg-slate-800 text-slate-300 border-0 text-[10px] py-0 px-1.5 font-normal font-mono">
              v{pageMetadata?.version || "0.0.0"}
            </Badge>
            {version ? (
              <Badge className="bg-success-bg/10 text-[#6EE7B7] hover:bg-success-bg/10 border-0 text-[10px] font-semibold py-0 px-1.5">
                Release Snapshot
              </Badge>
            ) : (
              <Badge className="bg-surface-container/10 text-indigo-300 hover:bg-surface-container/10 border-0 text-[10px] font-semibold py-0 px-1.5">
                Draft Content
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!version && (
            <Button
              className="bg-indigo hover:bg-[#4338CA] text-white gap-1.5 text-xs h-8"
              onClick={() => setPublishOpen(true)}
              disabled={!canPublish}
            >
              <Rocket className="w-3.5 h-3.5" />
              Publish Draft
            </Button>
          )}
        </div>
      </header>

      {/* Main Preview Render Canvas */}
      <main className="grow w-full">
        <PageRenderer sections={sections} />
      </main>

      <PublishDialog
        isOpen={publishOpen}
        onOpenChange={setPublishOpen}
        onPublishSuccess={() => {
          router.push("/releases");
        }}
      />
    </div>
  );
}

export default function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <StoreProvider>
      <PreviewPageInner slug={slug} />
    </StoreProvider>
  );
}
