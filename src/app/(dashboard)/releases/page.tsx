"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  User,
  GitBranch,
  Eye,
  ArrowLeftRight,
  ChevronRight,
  Package,
} from "lucide-react";
import type { Release } from "@/lib/schemas/page";
import type { PageSection } from "@/lib/schemas/sections";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function ReleasesPage() {
  const [pages, setPages] = useState<Array<{ slug: string; title: string }>>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [diffBaseRelease, setDiffBaseRelease] = useState<Release | null>(null);
  const [diffCompareRelease, setDiffCompareRelease] = useState<Release | null>(null);
  const [isDiffMode, setIsDiffMode] = useState(false);

  const fetchReleases = useCallback(async (slug: string) => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/releases/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setReleases(data.releases || []);
      }
    } catch (err) {
      console.error("Error fetching releases", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectPage = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setSelectedRelease(null);
    setDiffBaseRelease(null);
    setDiffCompareRelease(null);
    setIsDiffMode(false);
    fetchReleases(slug);
  }, [fetchReleases]);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch("/api/drafts");
        if (res.ok) {
          const data = await res.json();
          setPages(data);
          if (data.length > 0) {
            selectPage(data[0].slug);
          }
        }
      } catch (err) {
        console.error("Error fetching pages for releases", err);
      }
    }
    fetchPages();
  }, [selectPage]);


  const handleDiffCompare = () => {
    if (diffBaseRelease && diffCompareRelease) {
      setIsDiffMode(true);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-[30px] leading-[38px] font-semibold text-[#151C27] tracking-[-0.02em]">
            Releases
          </h2>
          <p className="text-[#6B7280] text-base">
            Track and audit immutable version snapshots of published pages.
          </p>
        </div>

        {pages.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-secondary">Select Page:</span>
            <Select value={selectedSlug} onValueChange={selectPage}>
              <SelectTrigger className="w-[220px] bg-white border-border-subtle focus:ring-indigo">
                <SelectValue placeholder="Select page" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Releases Table / History */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-border-subtle ambient-shadow">
            <CardHeader className="border-b border-border-subtle bg-surface-sidebar/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold text-[#151C27]">
                    Release History
                  </CardTitle>
                  <CardDescription>
                    All published versions of /{selectedSlug}
                  </CardDescription>
                </div>
                {releases.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Select
                      value={diffBaseRelease?.version || ""}
                      onValueChange={(v) =>
                        setDiffBaseRelease(releases.find((r) => r.version === v) || null)
                      }
                    >
                      <SelectTrigger className="w-[110px] h-8 text-xs">
                        <SelectValue placeholder="Base V" />
                      </SelectTrigger>
                      <SelectContent>
                        {releases.map((r) => (
                          <SelectItem key={r.version} value={r.version}>
                            v{r.version}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-text-secondary">vs</span>
                    <Select
                      value={diffCompareRelease?.version || ""}
                      onValueChange={(v) =>
                        setDiffCompareRelease(releases.find((r) => r.version === v) || null)
                      }
                    >
                      <SelectTrigger className="w-[110px] h-8 text-xs">
                        <SelectValue placeholder="Compare V" />
                      </SelectTrigger>
                      <SelectContent>
                        {releases.map((r) => (
                          <SelectItem key={r.version} value={r.version}>
                            v{r.version}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      className="h-8 bg-indigo hover:bg-[#4338CA] gap-1 text-xs"
                      disabled={!diffBaseRelease || !diffCompareRelease}
                      onClick={handleDiffCompare}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      Compare
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="py-20 text-center text-text-secondary">Loading releases...</div>
              ) : releases.length === 0 ? (
                <div className="py-20 text-center">
                  <Package className="w-12 h-12 text-text-secondary/30 mx-auto mb-3" />
                  <p className="text-sm font-medium text-[#151C27]">No releases yet</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Publish this page in the studio to generate a release snapshot.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
                      <TableHead className="w-[120px] font-medium text-text-secondary">Version</TableHead>
                      <TableHead className="font-medium text-text-secondary">Release Notes</TableHead>
                      <TableHead className="w-[100px] font-medium text-text-secondary">Type</TableHead>
                      <TableHead className="w-[160px] font-medium text-text-secondary">Published By</TableHead>
                      <TableHead className="w-[120px] font-medium text-text-secondary">Date</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {releases.map((r) => (
                      <TableRow
                        key={r.version}
                        className="hover:bg-[#F9F9FF] cursor-pointer group"
                        onClick={() => setSelectedRelease(r)}
                      >
                        <TableCell className="font-mono font-semibold text-indigo">
                          v{r.version}
                        </TableCell>
                        <TableCell className="text-sm text-[#151C27] max-w-[200px] truncate">
                          {r.releaseNotes || <span className="text-text-muted italic">No notes</span>}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              r.bumpType === "major"
                                ? "bg-danger/10 text-danger border-0"
                                : r.bumpType === "minor"
                                ? "bg-warning/10 text-warning border-0"
                                : "bg-indigo/10 text-[#3323CC] border-0"
                            }
                          >
                            {r.bumpType || "patch"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-text-secondary">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-text-muted" />
                            {r.publishedBy}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-text-secondary">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-text-muted" />
                            {new Date(r.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Release Detail Inspector Panel */}
        <div className="xl:col-span-1">
          {selectedRelease ? (
            <Card className="border-border-subtle ambient-shadow sticky top-20">
              <CardHeader className="border-b border-border-subtle">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-[#151C27]">
                      Release Inspector
                    </CardTitle>
                    <CardDescription className="font-mono text-xs text-indigo">
                      v{selectedRelease.version}
                    </CardDescription>
                  </div>
                  <Badge className="bg-indigo/10 text-[#3323CC] border-0">
                    {selectedRelease.bumpType || "patch"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Release Notes
                  </h4>
                  <p className="text-sm text-[#151C27] bg-surface-sidebar p-3 rounded-lg border border-border-subtle">
                    {selectedRelease.releaseNotes || "No release notes provided."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary block text-xs font-medium">Published By</span>
                    <span className="font-semibold text-[#151C27] mt-0.5 block truncate">
                      {selectedRelease.publishedBy}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-secondary block text-xs font-medium">Date</span>
                    <span className="font-semibold text-[#151C27] mt-0.5 block">
                      {new Date(selectedRelease.publishedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Snapshot Sections ({selectedRelease.snapshot.sections.length})
                  </h4>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                    {selectedRelease.snapshot.sections.map((sect: PageSection, idx: number) => (
                      <div
                        key={sect.id || idx}
                        className="flex items-center justify-between p-2.5 bg-white border border-border-subtle rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-3.5 h-3.5 text-indigo" />
                          <span className="font-medium text-[#151C27]">
                            {sect.type === "hero"
                              ? "Hero Section"
                              : sect.type === "features"
                              ? "Features List"
                              : sect.type === "testimonial"
                              ? "Testimonial"
                              : "CTA Section"}
                          </span>
                        </div>
                        <span className="font-mono text-text-muted">
                          {(() => {
                            if (sect.type === "hero" || sect.type === "features") {
                              return sect.title;
                            }
                            if (sect.type === "testimonial") {
                              return sect.author;
                            }
                            return sect.heading;
                          })().slice(0, 15)}...
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`/preview/${selectedSlug}?version=${selectedRelease.version}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-indigo text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#4338CA] transition-colors focus-ring-indigo"
                  >
                    <Eye className="w-4 h-4" />
                    View Live Snapshot
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border-subtle border-dashed ambient-shadow h-[380px] flex items-center justify-center text-center p-6">
              <div>
                <GitBranch className="w-12 h-12 text-text-secondary/20 mx-auto mb-4" />
                <h4 className="text-sm font-semibold text-[#151C27]">Select a Release</h4>
                <p className="text-xs text-text-secondary mt-1 max-w-[200px] mx-auto">
                  Click on any release row to inspect its immutable content snapshot.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Compare Diff Dialog */}
      <Dialog open={isDiffMode} onOpenChange={setIsDiffMode}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Version Difference</DialogTitle>
            <DialogDescription>
              Comparing v{diffBaseRelease?.version} (base) vs v{diffCompareRelease?.version} (compare)
            </DialogDescription>
          </DialogHeader>

          {diffBaseRelease && diffCompareRelease && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-sidebar rounded-lg border border-border-subtle">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                    Base: v{diffBaseRelease.version}
                  </span>
                  <span className="text-xs text-text-secondary block mt-1">
                    Published: {new Date(diffBaseRelease.publishedAt).toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-surface-container-low rounded-lg border border-indigo-light">
                  <span className="text-xs font-semibold text-indigo uppercase tracking-wider block">
                    Compare: v{diffCompareRelease.version}
                  </span>
                  <span className="text-xs text-text-secondary block mt-1">
                    Published: {new Date(diffCompareRelease.publishedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#151C27] mb-3">Sections Diff</h4>
                <div className="space-y-4">
                  {/* Left Side vs Right Side Section count */}
                  <div className="text-xs text-text-secondary">
                    Base sections: {diffBaseRelease.snapshot.sections.length} | Compare sections:{" "}
                    {diffCompareRelease.snapshot.sections.length}
                  </div>

                  <div className="border border-border-subtle rounded-lg overflow-hidden font-mono text-xs">
                    <div className="bg-surface-sidebar px-4 py-2 border-b border-border-subtle font-semibold text-[#151C27]">
                      Raw JSON Diff View
                    </div>
                    <pre className="p-4 bg-white overflow-x-auto max-h-[300px] text-[11px] leading-relaxed custom-scrollbar">
                      {/* Very simple JSON string diff to show visual modifications */}
                      {JSON.stringify(diffBaseRelease.snapshot.sections, null, 2) ===
                      JSON.stringify(diffCompareRelease.snapshot.sections, null, 2) ? (
                        <span className="text-success">No differences in content sections.</span>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-danger block">
                            - v{diffBaseRelease.version} Sections content:
                          </span>
                          <span className="text-text-muted block whitespace-pre-wrap pl-4 bg-danger/5 p-2 rounded">
                            {JSON.stringify(diffBaseRelease.snapshot.sections, null, 2)}
                          </span>
                          <span className="text-success block mt-4">
                            + v{diffCompareRelease.version} Sections content:
                          </span>
                          <span className="text-text-muted block whitespace-pre-wrap pl-4 bg-success-bg/5 p-2 rounded">
                            {JSON.stringify(diffCompareRelease.snapshot.sections, null, 2)}
                          </span>
                        </div>
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
