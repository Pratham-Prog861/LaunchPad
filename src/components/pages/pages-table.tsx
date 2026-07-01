"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface PageData {
  slug: string;
  title: string;
  status: "draft" | "published";
  updatedAt: string;
}

interface PagesTableProps {
  initialPages: PageData[];
}

export function PagesTable({ initialPages }: PagesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");

  const filteredPages = initialPages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            className="pl-10 bg-white border-border-subtle rounded-lg focus-visible:ring-indigo text-sm"
            placeholder="Search pages by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "draft" | "published")}
            className="w-full sm:w-auto h-10 px-3.5 rounded-lg border border-border-subtle bg-white text-sm text-[#151C27] focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white border border-border-subtle rounded-xl overflow-hidden ambient-shadow">
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
              {filteredPages.map((page) => (
                <tr
                  key={page.slug}
                  className="hover:bg-[#F9F9FF] transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-medium text-[#151C27]">
                    <Link
                      href={`/studio/${page.slug}`}
                      className="hover:text-indigo transition-colors"
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
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/studio/${page.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo hover:bg-indigo/5 text-xs"
                        >
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/preview/${page.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-text-secondary hover:bg-surface-container text-xs"
                        >
                          Preview
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-text-secondary hover:bg-surface-container"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-indigo" />
            </div>
            <h3 className="text-lg font-semibold text-[#151C27] mb-1">
              No pages match filter
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Try adjusting your search query or status filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
