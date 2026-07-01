"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Rocket,
  Shield,
  Settings,
  HelpCircle,
  BookOpen,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pages", label: "Pages", icon: FileText },
  { href: "/releases", label: "Releases", icon: Rocket },
  { href: "/roles", label: "Roles", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

const bottomItems = [
  { href: "/support", label: "Support", icon: HelpCircle },
  { href: "/docs", label: "Documentation", icon: BookOpen },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 bg-surface-sidebar border-r border-border-subtle flex-col py-6 z-60 hidden md:flex">
      {/* Logo */}
      <div className="px-6 mb-16">
        <h1 className="text-xl font-bold text-[#151C27] tracking-tight">
          LauchPad Studio
        </h1>
        <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mt-1">
          Enterprise CMS
        </p>
      </div>

      {/* Navigation */}
      <nav className="grow space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.98]",
                isActive
                  ? "text-indigo bg-indigo/5 border-r-4 border-indigo"
                  : "text-text-secondary hover:bg-surface-container hover:text-[#151C27]"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="mt-auto px-2 space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-xs font-medium transition-all active:scale-[0.98]",
                isActive
                  ? "text-indigo bg-indigo/5 border-r-4 border-indigo font-semibold"
                  : "text-text-secondary hover:bg-surface-container hover:text-[#151C27]"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
