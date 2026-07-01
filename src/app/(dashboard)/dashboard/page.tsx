import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";
import { getCmsAdapter } from "@/lib/adapters";
import { getPersistenceAdapter } from "@/lib/persistence/file-adapter";
import Link from "next/link";
import {
  FileText,
  CheckCircle,
  Edit3,
  History,
  Plus,
  MoreVertical,
  Zap,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export default async function DashboardPage() {
  const { orgId } = await auth();
  const persistence = getPersistenceAdapter(orgId || undefined);
  const adapter = getCmsAdapter(orgId || undefined);
  const allPages = await adapter.listPages();
  const publishedPages = allPages.filter(
    (p) => p.status === "published"
  );
  const draftPages = allPages.filter(
    (p) => p.status === "draft"
  );

  // Fetch file adapter drafts and releases to get real metrics and activities
  const localDrafts = await persistence.listDrafts();

  const allReleases: Array<{ version: string; publishedAt: string; pageTitle: string }> = [];
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
      allReleases.push({
        version: rel.version,
        publishedAt: rel.publishedAt,
        pageTitle: title,
      });

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
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <>
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-[30px] leading-[38px] font-semibold text-[#151C27] tracking-[-0.02em]">
            Dashboard
          </h2>
          <p className="text-text-secondary text-base">
            Overview of your site architecture and content flow.
          </p>
        </div>
        <Link href="/pages">
          <Button className="bg-indigo hover:bg-[#4338CA] text-white px-8 py-5 rounded-lg font-medium text-sm flex items-center gap-2 ambient-shadow">
            <Plus className="w-4 h-4" />
            Create New Page
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Pages */}
        <div className="bg-white p-6 rounded-xl border border-border-subtle ambient-shadow group hover:border-indigo transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container rounded-lg text-indigo">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-medium text-text-secondary">
            Total Pages
          </div>
          <div className="text-4xl font-bold text-[#151C27] mt-1 tracking-[-0.02em]">
            {allPages.length}
          </div>
        </div>

        {/* Published */}
        <div className="bg-white p-6 rounded-xl border border-border-subtle ambient-shadow group hover:border-indigo transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#D9DFF5] rounded-lg text-[#575E70]">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-indigo bg-indigo-light px-2 py-0.5 rounded-full">
              Stable
            </span>
          </div>
          <div className="text-sm font-medium text-text-secondary">
            Published
          </div>
          <div className="text-4xl font-bold text-[#151C27] mt-1 tracking-[-0.02em]">
            {publishedPages.length}
          </div>
        </div>

        {/* Drafts */}
        <div className="bg-white p-6 rounded-xl border border-border-subtle ambient-shadow group hover:border-indigo transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#FFF7ED] rounded-lg text-[#7E3000]">
              <Edit3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-text-secondary bg-surface-container px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <div className="text-sm font-medium text-text-secondary">Drafts</div>
          <div className="text-4xl font-bold text-[#151C27] mt-1 tracking-[-0.02em]">
            {draftPages.length}
          </div>
        </div>

        {/* Recent Releases */}
        <div className="bg-white p-6 rounded-xl border border-border-subtle ambient-shadow group hover:border-indigo transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo/5 rounded-lg text-indigo">
              <History className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-indigo bg-indigo-light px-2 py-0.5 rounded-full">
              Lifetime
            </span>
          </div>
          <div className="text-sm font-medium text-text-secondary">
            Recent Releases
          </div>
          <div className="text-4xl font-bold text-[#151C27] mt-1 tracking-[-0.02em]">
            {allReleases.length}
          </div>
        </div>
      </section>

      {/* Content Layout: Table & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Pages Table */}
        <div className="xl:col-span-2 bg-white border border-border-subtle rounded-xl overflow-hidden ambient-shadow">
          <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[#151C27]">
              Recent Pages
            </h3>
            <Link
              href="/pages"
              className="text-indigo text-sm font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {allPages.slice(0, 5).map((page) => (
                  <tr
                    key={page.slug}
                    className="hover:bg-[#F9F9FF] transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#151C27]">
                      <Link
                        href={`/studio/${page.slug}`}
                        className="hover:text-indigo"
                      >
                        {page.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                      /{page.slug}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          page.status === "published" ? "default" : "secondary"
                        }
                        className={
                          page.status === "published"
                            ? "bg-indigo/10 text-indigo hover:bg-indigo/15 border-0 font-medium"
                            : "bg-surface-container text-text-secondary hover:bg-[#D9DFF5] border-0 font-medium"
                        }
                      >
                        {page.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(page.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-text-secondary hover:bg-surface-container"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {allPages.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-text-secondary text-sm">
                      No pages found. Create a page to populate the dashboard!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-border-subtle rounded-xl p-6 ambient-shadow">
          <h3 className="text-xl font-semibold text-[#151C27] mb-6">
            Activity Feed
          </h3>
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-border-subtle">
            {sortedActivities.map((act) => (
              <div key={act.id} className="relative pl-8 flex flex-col gap-1 text-left">
                <div
                  className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                    act.iconType === "release"
                      ? "bg-indigo/10 text-indigo"
                      : act.iconType === "create"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-[#FFF7ED] text-[#7E3000]"
                  }`}
                >
                  {act.iconType === "release" ? (
                    <Zap className="w-3 h-3" />
                  ) : act.iconType === "create" ? (
                    <User className="w-3 h-3" />
                  ) : (
                    <Edit3 className="w-3 h-3" />
                  )}
                </div>
                <p className="text-sm font-medium text-[#151C27]">
                  {act.title}
                </p>
                <p className="text-xs text-text-secondary">
                  {act.desc}
                </p>
                <span className="text-[10px] text-text-muted">
                  {act.timeLabel}
                </span>
              </div>
            ))}

            {sortedActivities.length === 0 && (
              <div className="py-8 text-center text-text-secondary text-xs">
                No activity logged yet. Build or update pages to populate the feed.
              </div>
            )}
          </div>

          {/* System Status Info */}
          <div className="mt-8 p-4 bg-surface-container-low rounded-lg border border-border-subtle flex items-center gap-2.5 text-left">
            <Zap className="w-4 h-4 text-indigo shrink-0" />
            <div>
              <span className="text-xs font-semibold text-indigo block">
                LaunchPad Engine v1.0.0
              </span>
              <span className="text-[10px] text-text-secondary block mt-0.5">
                Local draft sandbox synced & ready.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
