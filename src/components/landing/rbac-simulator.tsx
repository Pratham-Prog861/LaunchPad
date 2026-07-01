"use client";

import { useState } from "react";
import { ShieldCheck, Eye, Edit3, Rocket, Lock, Check } from "lucide-react";

export function RbacSimulator() {
  const [activeRole, setActiveRole] = useState<"viewer" | "editor" | "publisher">("editor");

  const permissions = [
    {
      action: "Preview Pages",
      desc: "Inspect active drafts in the live browser preview frame",
      roles: ["viewer", "editor", "publisher"],
    },
    {
      action: "Audit Release Logs",
      desc: "Read immutable SemVer snapshots and compare version histories",
      roles: ["viewer", "editor", "publisher"],
    },
    {
      action: "Modify Page Layouts",
      desc: "Reorder sections, add new components, and edit content props",
      roles: ["editor", "publisher"],
    },
    {
      action: "Save Draft Changes",
      desc: "Commit layout changes to the server database for later review",
      roles: ["editor", "publisher"],
    },
    {
      action: "Publish Live Snapshot",
      desc: "Trigger deterministic SemVer bumps (major/minor/patch) and lock releases",
      roles: ["publisher"],
    },
  ];

  return (
    <div className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-xl shadow-slate-100 relative z-10 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Interactive Role Simulator
          </h3>
          <p className="text-xs text-slate-500">
            Select a role and inspect the granted permissions across the system.
          </p>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
          {[
            { id: "viewer", label: "Viewer", icon: Eye },
            { id: "editor", label: "Editor", icon: Edit3 },
            { id: "publisher", label: "Publisher", icon: Rocket },
          ].map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id as "viewer" | "editor" | "publisher")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeRole === role.id
                    ? "bg-white text-indigo-600 border border-slate-200 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {role.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulator Panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Side: Summary Card */}
        <div className="md:col-span-2 bg-slate-50 border border-slate-200/80 rounded-xl p-5 text-left flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-600 mb-2 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-150 inline-block">
              Clerk Role Mapping
            </span>
            <h4 className="text-lg font-bold text-slate-900 mt-2 capitalize">
              org:{activeRole}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              {activeRole === "viewer" &&
                "Viewers can safely inspect the layouts, read recent page listings, and open preview states. They cannot save edits or publish changes."}
              {activeRole === "editor" &&
                "Editors have layout drafting permissions. They can create new pages, add layout sections, reorder components, and save drafts on the server."}
              {activeRole === "publisher" &&
                "Publishers have absolute control over the production pipeline. They can edit content, save drafts, bump SemVer release numbers, and publish."}
            </p>
          </div>
          
          <div className="pt-6 border-t border-slate-200 mt-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Required Role Header
            </span>
            <span className="font-mono text-[10px] text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
              x-clerk-role: org:{activeRole}
            </span>
          </div>
        </div>

        {/* Right Side: Permissions Checklist */}
        <div className="md:col-span-3 flex flex-col gap-3">
          {permissions.map((perm, idx) => {
            const hasAccess = perm.roles.includes(activeRole);
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  hasAccess
                    ? "bg-slate-50/50 border-slate-200/80"
                    : "bg-red-50/10 border-red-100 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3 text-left">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      hasAccess
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}
                  >
                    {hasAccess ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {perm.action}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                      {perm.desc}
                    </span>
                  </div>
                </div>
                <div>
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      hasAccess
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {hasAccess ? "Granted" : "Locked"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
