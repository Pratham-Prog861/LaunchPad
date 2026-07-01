"use client";

import { use, useEffect, useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { StoreProvider } from "@/lib/store/provider";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  setPage,
  selectSections,
  selectMetadata,
  selectIsDirty,
  markClean,
} from "@/lib/store/slices/draft-page-slice";
import { setCurrentVersion } from "@/lib/store/slices/publish-slice";
import { SectionList } from "@/components/editor/section-list";
import { PropertyEditor } from "@/components/editor/property-editor";
import { PageRenderer } from "@/components/renderer/page-renderer";
import { PublishDialog } from "@/components/editor/publish-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  Eye,
  Rocket,
  Loader2,
  Plus,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function StudioEditorInner({ slug }: { slug: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sections = useAppSelector(selectSections);
  const metadata = useAppSelector(selectMetadata);
  const isDirty = useAppSelector(selectIsDirty);

  const { organization, membership, isLoaded } = useOrganization();
  const canEdit =
    isLoaded &&
    (!organization ||
      membership?.role === "org:editor" ||
      membership?.role === "org:publisher" ||
      membership?.role === "org:admin" ||
      membership?.role === "admin" ||
      membership?.role === "owner");
  const canPublish =
    isLoaded &&
    (!organization ||
      membership?.role === "org:publisher" ||
      membership?.role === "org:admin" ||
      membership?.role === "admin" ||
      membership?.role === "owner");

  const [loading, setLoading] = useState(slug !== "new");
  const [saving, setSaving] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  // Wizard fields
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [wizardError, setWizardError] = useState("");

  useEffect(() => {
    if (slug === "new") return;

    async function loadPage() {
      try {
        const res = await fetch(`/api/drafts/${slug}`);
        if (!res.ok) {
          router.push("/");
          return;
        }
        const data = await res.json();
        dispatch(setPage({ metadata: data.metadata, sections: data.sections }));
        dispatch(setCurrentVersion(data.metadata.version || "0.0.0"));
      } catch (err) {
        console.error("Error loading draft", err);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [slug, dispatch, router]);

  const handleSaveDraft = async () => {
    if (!metadata || !canEdit) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/drafts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadata, sections }),
      });
      if (res.ok) {
        dispatch(markClean());
      }
    } catch (err) {
      console.error("Error saving draft", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateWizard = async (e: React.FormEvent) => {
    e.preventDefault();
    setWizardError("");

    const formattedSlug = newSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (!formattedSlug || !newTitle) {
      setWizardError("Missing slug or title.");
      return;
    }

    try {
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: formattedSlug, title: newTitle }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to create page.");
      }
      const data = await res.json();
      router.push(`/studio/${data.metadata.slug}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setWizardError(message);
    }
  };

  if (slug === "new") {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh] p-6 bg-[#F9F9FF]">
        <Card className="max-w-[400px] w-full border-border-subtle ambient-shadow">
          <CardHeader className="border-b border-border-subtle text-center pb-6">
            <div className="w-12 h-12 bg-indigo-50 text-indigo rounded-xl flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-bold text-[#151C27]">
              Create New Page
            </CardTitle>
            <CardDescription>
              Name your page and specify its unique slug path.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateWizard}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Page Title
                </label>
                <Input
                  required
                  placeholder="e.g. Developer Productivity"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      setNewSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")
                      );
                    }
                  }}
                  className="bg-white border-border-subtle"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Slug Path
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-text-muted font-mono">
                    /
                  </span>
                  <Input
                    required
                    placeholder="dev-productivity"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="pl-6 bg-white border-border-subtle font-mono text-xs"
                  />
                </div>
              </div>

              {wizardError && (
                <div className="p-3 bg-danger-bg border border-danger/20 text-danger rounded-xl text-xs font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{wizardError}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-border-subtle pt-4 flex gap-3 justify-end bg-surface-sidebar/50">
              <Link href="/dashboard">
                <Button variant="outline" className="border-border-subtle">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-indigo hover:bg-[#4338CA] text-white">
                Initialize Page
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] text-text-secondary">
        <Loader2 className="w-10 h-10 animate-spin text-indigo mb-2" />
        <span className="text-sm font-semibold">Loading page workspace...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-100">
      {/* Top Editor Bar */}
      <header className="flex justify-between items-center px-6 bg-white border-b border-border-subtle h-14 z-70 sticky top-0">
        <div className="flex items-center gap-3">
          <Link href="/pages">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-secondary hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#151C27]">
                {metadata?.title}
              </span>
              <Badge className="bg-surface-container text-text-secondary hover:bg-surface-container border-0 text-[10px] py-0 px-1.5 font-normal">
                v{metadata?.version || "0.0.0"}
              </Badge>
              {isDirty && (
                <span className="w-1.5 h-1.5 bg-warning rounded-full" title="Unsaved changes" />
              )}
            </div>
            <span className="text-[10px] font-mono text-text-secondary block">
              /{slug}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* RBAC disclaimer */}
          {!canEdit && (
            <span className="text-xs text-text-muted font-medium mr-2">
              (Viewer mode: Read Only)
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            className="border-border-subtle hover:bg-slate-50 gap-1.5 text-xs h-9"
            onClick={handleSaveDraft}
            disabled={saving || !isDirty || !canEdit}
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save Draft
          </Button>

          <a
            href={`/preview/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center border border-border-subtle hover:bg-slate-50 rounded-md gap-1.5 text-xs font-semibold text-slate-700 bg-white px-3 h-9 transition-colors focus-ring-indigo"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Live
          </a>

          <Button
            className="bg-indigo hover:bg-[#4338CA] text-white gap-1.5 text-xs h-9"
            onClick={() => setPublishOpen(true)}
            disabled={!canPublish}
          >
            <Rocket className="w-3.5 h-3.5" />
            Publish
          </Button>
        </div>
      </header>

      {/* Editor Panel Split */}
      <div className="flex-grow flex h-[calc(100vh-56px)] overflow-hidden">
        {/* Left Side: Section List */}
        <SectionList />

        {/* Center: Live Render Frame */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1024px] mx-auto bg-white rounded-2xl border border-border-subtle ambient-shadow min-h-[600px] overflow-hidden flex flex-col">
            {/* Simulated browser header */}
            <div className="bg-slate-50 border-b border-border-subtle px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>
              <div className="bg-white border border-border-subtle rounded px-3 py-0.5 text-[10px] font-mono text-text-secondary flex-1 max-w-[400px] mx-auto text-center truncate">
                https://studio.indigopages.com/preview/{slug}
              </div>
            </div>

            {/* Content Renderer */}
            <div className="flex-grow bg-white">
              <PageRenderer sections={sections} />
            </div>
          </div>
        </div>

        {/* Right Side: Property Editor */}
        <PropertyEditor />
      </div>

      <PublishDialog
        isOpen={publishOpen}
        onOpenChange={setPublishOpen}
        onPublishSuccess={() => {
          // Re-load to sync published status and new version number
          router.refresh();
        }}
      />
    </div>
  );
}

export default function StudioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <StoreProvider>
      <StudioEditorInner slug={slug} />
    </StoreProvider>
  );
}
