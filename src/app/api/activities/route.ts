import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPersistenceAdapter } from "@/lib/persistence/file-adapter";
import { getCmsAdapter } from "@/lib/adapters";
import { withRbac } from "@/lib/auth/with-rbac";
import { ROLES } from "@/lib/auth/rbac";

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
}

interface ActivityItem {
  id: string;
  title: string;
  desc: string;
  timeLabel: string;
  timestamp: number;
  iconType: "release" | "create" | "update";
}

export const GET = withRbac<unknown>(
  async () => {
    const { orgId } = await auth();
    const persistence = getPersistenceAdapter(orgId || undefined);
    const localDrafts = await persistence.listDrafts();

    const activities: ActivityItem[] = [];

    for (const draft of localDrafts) {
      const slug = draft.metadata.slug;
      const title = draft.metadata.title;
      const createdAt = draft.metadata.createdAt;
      const updatedAt = draft.metadata.updatedAt;

      // 1. Add creation activity
      if (createdAt) {
        activities.push({
          id: `create-${slug}`,
          title: "New draft page",
          desc: `Page "${title}" was added to drafts.`,
          timeLabel: getRelativeTime(createdAt),
          timestamp: new Date(createdAt).getTime(),
          iconType: "create",
        });
      }

      // 2. Add update activity if modified
      if (updatedAt && createdAt && new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 2000) {
        activities.push({
          id: `update-${slug}-${updatedAt}`,
          title: "Page layout updated",
          desc: `Layout changes saved for "${title}".`,
          timeLabel: getRelativeTime(updatedAt),
          timestamp: new Date(updatedAt).getTime(),
          iconType: "update",
        });
      }

      // 3. Fetch and log releases
      const pageReleases = await persistence.listReleases(slug);
      for (const rel of pageReleases) {
        activities.push({
          id: `release-${slug}-${rel.version}`,
          title: "Release deployed to Production",
          desc: `v${rel.version} of "${title}" was published live.`,
          timeLabel: getRelativeTime(rel.publishedAt),
          timestamp: new Date(rel.publishedAt).getTime(),
          iconType: "release",
        });
      }
    }

    // Sort activities by timestamp descending
    const sortedActivities = activities
      .sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json(sortedActivities);
  },
  { requiredRole: ROLES.VIEWER }
);
