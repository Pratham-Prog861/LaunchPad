"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New page created",
      desc: "Page 'dev-demo-product' was added to drafts.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      title: "SemVer Release Bounded",
      desc: "v2.4.0 release deployed successfully by Publisher.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 3,
      title: "Database Sync Completed",
      desc: "Mock CMS adapters fully synchronized with file persistence.",
      time: "5 hours ago",
      unread: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [pages, setPages] = useState<{ slug: string; title: string; status: string }[]>([]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleSearchFocus = async () => {
    setSearchFocused(true);
    try {
      const res = await fetch("/api/drafts");
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (e) {
      console.error("Failed to load search index pages", e);
    }
  };

  const staticCommands = [
    { label: "Dashboard", href: "/dashboard", desc: "Go to workspace overview" },
    { label: "Pages Table", href: "/pages", desc: "List, create, or edit pages" },
    { label: "Releases Pipeline", href: "/releases", desc: "View immutable snapshots" },
    { label: "Role Directory", href: "/roles", desc: "Check Clerk mappings" },
    { label: "Support Desk", href: "/support", desc: "Submit tickets" },
    { label: "Documentation", href: "/docs", desc: "Developer API guide" },
  ];

  const filteredPages = searchQuery
    ? pages.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredCommands = searchQuery
    ? staticCommands.filter(
        (c) =>
          c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : staticCommands;

  return (
    <header className="flex justify-between items-center px-6 w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md h-16 border-b border-[#E5E7EB] md:ml-[240px] md:w-[calc(100%-240px)]">
      {/* Search */}
      <div className="flex items-center gap-4 relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-[#6B7280]" />
          <Input
            className="pl-10 pr-4 py-1.5 bg-[#F0F3FF] border border-[#E5E7EB] rounded-lg text-sm w-64 md:w-80 focus-visible:ring-[#4F46E5]"
            placeholder="Search resources (pages, actions...)"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          />
        </div>

        {/* Spotlight Results Dropdown */}
        {searchFocused && (
          <div className="absolute top-full left-0 mt-2 w-80 md:w-[360px] bg-white border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden text-left p-2 max-h-96 overflow-y-auto">
            {searchQuery && filteredPages.length > 0 && (
              <div className="mb-2">
                <span className="text-[10px] uppercase font-bold text-text-secondary px-2 py-1 block">
                  Pages found
                </span>
                {filteredPages.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/studio/${p.slug}`}
                    className="flex flex-col px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-xs text-[#151C27]">{p.title}</span>
                    <span className="text-[10px] text-text-secondary font-mono">/{p.slug}</span>
                  </Link>
                ))}
              </div>
            )}

            {filteredCommands.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-text-secondary px-2 py-1 block">
                  Quick actions & modules
                </span>
                {filteredCommands.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="flex flex-col px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-xs text-indigo">{c.label}</span>
                    <span className="text-[10px] text-text-secondary">{c.desc}</span>
                  </Link>
                ))}
              </div>
            )}

            {searchQuery && filteredPages.length === 0 && filteredCommands.length === 0 && (
              <div className="py-4 text-center text-xs text-text-secondary">
                No matching pages or commands found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#6B7280] hover:text-[#4F46E5] relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden text-left">
              <div className="p-4 border-b border-border-subtle bg-slate-50 flex justify-between items-center">
                <span className="font-semibold text-sm text-[#151C27]">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-indigo font-bold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-border-subtle max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 hover:bg-slate-50 transition-colors ${
                      n.unread ? "bg-indigo-50/20" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-[#151C27]">{n.title}</span>
                      <span className="text-[9px] text-[#9CA3AF]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] mt-1 leading-normal">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Separator orientation="vertical" className="h-8 mx-1" />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </header>
  );
}
