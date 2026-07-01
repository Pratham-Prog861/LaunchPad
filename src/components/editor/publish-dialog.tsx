"use client";

import { useOrganization } from "@clerk/nextjs";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  selectCurrentVersion,
  selectSelectedBumpType,
  selectReleaseNotes,
  setSelectedBumpType,
  setReleaseNotes,
  setIsPublishing,
  selectIsPublishing,
  addRelease,
} from "@/lib/store/slices/publish-slice";
import { selectMetadata } from "@/lib/store/slices/draft-page-slice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, ArrowRight, AlertCircle } from "lucide-react";
import semverInc from "semver/functions/inc";
import { useState } from "react";

interface PublishDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPublishSuccess?: () => void;
}

export function PublishDialog({
  isOpen,
  onOpenChange,
  onPublishSuccess,
}: PublishDialogProps) {
  const dispatch = useAppDispatch();
  const currentVersion = useAppSelector(selectCurrentVersion);
  const bumpType = useAppSelector(selectSelectedBumpType);
  const releaseNotes = useAppSelector(selectReleaseNotes);
  const isPublishing = useAppSelector(selectIsPublishing);
  const metadata = useAppSelector(selectMetadata);

  const { organization, membership, isLoaded } = useOrganization();
  const isPublisher =
    isLoaded &&
    (!organization ||
      membership?.role === "org:publisher" ||
      membership?.role === "org:admin" ||
      membership?.role === "admin" ||
      membership?.role === "owner");

  const [errorMsg, setErrorMsg] = useState("");

  const nextVersion = semverInc(currentVersion || "0.0.0", bumpType) || "1.0.0";

  const handlePublish = async () => {
    if (!metadata) return;
    if (!isPublisher) {
      setErrorMsg("Unauthorized: Only members with the Publisher role can publish.");
      return;
    }

    dispatch(setIsPublishing(true));
    setErrorMsg("");

    try {
      const res = await fetch(`/api/publish/${metadata.slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bumpType,
          releaseNotes,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to publish page.");
      }

      const release = await res.json();
      dispatch(addRelease(release));
      dispatch(setIsPublishing(false));
      onOpenChange(false);
      if (onPublishSuccess) {
        onPublishSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred during publish.";
      setErrorMsg(message);
      dispatch(setIsPublishing(false));
    }
  };

  const bumpOptions = [
    {
      type: "patch" as const,
      label: "Patch",
      desc: "Bug fixes or minor adjustments. e.g. v1.0.0 → v1.0.1",
    },
    {
      type: "minor" as const,
      label: "Minor",
      desc: "New sections or property extensions. e.g. v1.0.0 → v1.1.0",
    },
    {
      type: "major" as const,
      label: "Major",
      desc: "Complete layout redesign or schema modifications. e.g. v1.0.0 → v2.0.0",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#151C27]">
            Publish Release
          </DialogTitle>
          <DialogDescription>
            Bumps version of /{metadata?.slug} and creates an immutable snapshot.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Version preview */}
          <div className="flex items-center justify-between p-4 bg-surface-container-low border border-indigo-light rounded-xl">
            <div>
              <span className="text-xs text-text-secondary block font-medium">Current Version</span>
              <span className="text-sm font-semibold font-mono text-text-secondary mt-0.5 block">
                v{currentVersion || "0.0.0"}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo" />
            <div className="text-right">
              <span className="text-xs text-indigo block font-semibold">New Version</span>
              <span className="text-base font-bold font-mono text-indigo mt-0.5 block">
                v{nextVersion}
              </span>
            </div>
          </div>

          {/* Bump Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
              Version Bump Type
            </label>
            <div className="space-y-2">
              {bumpOptions.map((opt) => (
                <div
                  key={opt.type}
                  className={`p-3 border rounded-xl cursor-pointer transition-all duration-150 ${
                    bumpType === opt.type
                      ? "border-indigo bg-indigo/5 ring-2 ring-indigo/10"
                      : "border-border-subtle hover:border-indigo/50 bg-white"
                  }`}
                  onClick={() => dispatch(setSelectedBumpType(opt.type))}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-[#151C27]">
                      {opt.label}
                    </span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        bumpType === opt.type
                          ? "border-indigo bg-indigo"
                          : "border-slate-300"
                      }`}
                    >
                      {bumpType === opt.type && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Release Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
              Release Notes
            </label>
            <Textarea
              placeholder="Describe the changes made in this release..."
              value={releaseNotes}
              onChange={(e) => dispatch(setReleaseNotes(e.target.value))}
              className="bg-white border-border-subtle text-sm focus-visible:ring-indigo"
            />
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="p-3 bg-danger-bg border border-danger/20 text-danger rounded-xl text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* RBAC notice */}
          {!isPublisher && (
            <Alert className="bg-warning-bg border-warning/20 p-3 flex items-start gap-2 text-amber-700">
              <ShieldAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <AlertDescription className="text-xs font-medium mt-0">
                You do not have the Publisher role in this organization. Publishing is restricted.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="border-t border-border-subtle pt-4 mt-2">
          <Button
            variant="outline"
            className="border-border-subtle"
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button
            className="bg-indigo hover:bg-[#4338CA] text-white"
            onClick={handlePublish}
            disabled={isPublishing || !isPublisher}
          >
            {isPublishing ? "Publishing..." : "Confirm Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
