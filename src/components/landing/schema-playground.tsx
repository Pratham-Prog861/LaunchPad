"use client";

import { useState } from "react";
import { Sliders, Code, ArrowRight } from "lucide-react";

export function SchemaPlayground() {
  const [activeTab, setActiveTab] = useState<"hero" | "cta" | "json">("hero");

  // Hero editable state
  const [heroTitle, setHeroTitle] = useState("Welcome to LaunchPad");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "A schema-driven CMS designed for high-performance content teams.",
  );
  const [heroCta, setHeroCta] = useState("Explore Studio");

  // CTA editable state
  const [ctaHeading, setCtaHeading] = useState("Start building today");
  const [ctaDesc, setCtaDesc] = useState(
    "Join the modern page orchestration revolution and lock in type safety.",
  );
  const [ctaLabel, setCtaLabel] = useState("Get Started");

  // Generate dynamic JSON representation matching the schema
  const getJsonRepresentation = () => {
    return JSON.stringify(
      {
        slug: "landing-page",
        metadata: {
          title: "LaunchPad Demo",
          version: "1.0.0",
          status: "published",
        },
        sections: [
          {
            id: "hero-section-uuid-1",
            type: "hero",
            title: heroTitle,
            subtitle: heroSubtitle,
            ctaText: heroCta,
            ctaUrl: "/explore",
          },
          {
            id: "cta-section-uuid-2",
            type: "cta",
            heading: ctaHeading,
            description: ctaDesc,
            primaryAction: {
              label: ctaLabel,
              url: "/signup",
            },
          },
        ],
      },
      null,
      2,
    );
  };

  return (
    <div className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-xl shadow-slate-100 relative z-10 flex flex-col gap-6">
      {/* Top Controller */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            Interactive Schema Playground
          </h3>
          <p className="text-xs text-slate-500">
            Edit the properties on the left and see the visual preview and Zod
            schema update in real-time.
          </p>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
          {[
            { id: "hero", label: "Hero Props", icon: Sliders },
            { id: "cta", label: "CTA Props", icon: Sliders },
            { id: "json", label: "JSON Schema", icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "hero" | "cta" | "json")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-indigo-600 border border-slate-200/85 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor & Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-slate-50 border border-slate-200/80 rounded-xl p-5 text-left">
          {activeTab === "hero" && (
            <>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Hero properties
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Subtitle
                  </label>
                  <textarea
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    rows={3}
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={heroCta}
                    onChange={(e) => setHeroCta(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "cta" && (
            <>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                CTA properties
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={ctaHeading}
                    onChange={(e) => setCtaHeading(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Description
                  </label>
                  <textarea
                    value={ctaDesc}
                    onChange={(e) => setCtaDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Action Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "json" && (
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Zod Validation Schema
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                LaunchPad validates incoming JSON files against strict schemas
                before rendering. Deploys fail safely if schema violations are
                found.
              </p>
              <div className="bg-slate-100 rounded-lg p-3 border border-slate-200 font-mono text-[10px] text-slate-700 space-y-1">
                <div>
                  <span className="text-purple-600">const</span> HeroSchema =
                  z.object(&#123;
                </div>
                <div className="pl-4">id: z.string().uuid(),</div>
                <div className="pl-4">
                  type: z.literal(
                  <span className="text-indigo-600">&quot;hero&quot;</span>),
                </div>
                <div className="pl-4">
                  title: z.string().min(
                  <span className="text-amber-600">1</span>),
                </div>
                <div className="pl-4">subtitle: z.string().optional(),</div>
                <div className="pl-4">ctaText: z.string().optional(),</div>
                <div>&#125;);</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Renderer */}
        <div className="lg:col-span-3 border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col min-h-[340px]">
          {/* Simulated Browser Frame Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
            <div className="bg-white border border-slate-200 rounded px-3 py-0.5 text-[9px] font-mono text-slate-500 flex-1 max-w-[280px] mx-auto text-center truncate">
              https://indigo-studio.com/sandbox/preview
            </div>
          </div>

          {/* Render Area */}
          <div className="flex-1 p-6 flex flex-col justify-center items-center overflow-y-auto bg-slate-50 relative">
            {activeTab === "hero" && (
              <div className="text-center w-full max-w-md animate-fade-in flex flex-col items-center">
                <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-600 mb-2 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-150">
                  Hero Component
                </span>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2 leading-tight">
                  {heroTitle || (
                    <span className="text-slate-400">Untitled Title</span>
                  )}
                </h1>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed max-w-sm">
                  {heroSubtitle || (
                    <span className="text-slate-400">No subtitle provided</span>
                  )}
                </p>
                {heroCta && (
                  <button className="bg-indigo-600 text-white rounded-md px-4 py-1.5 text-[11px] font-semibold flex items-center gap-1 hover:bg-indigo-500 active:scale-[0.98] transition-all">
                    {heroCta}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {activeTab === "cta" && (
              <div className="text-center w-full max-w-md animate-fade-in flex flex-col items-center bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
                <span className="text-[9px] uppercase font-bold tracking-widest text-purple-600 mb-2 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-150">
                  CTA Component
                </span>
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  {ctaHeading || (
                    <span className="text-slate-400">Untitled Heading</span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {ctaDesc || (
                    <span className="text-slate-400">
                      No description provided
                    </span>
                  )}
                </p>
                {ctaLabel && (
                  <button className="bg-indigo-600 text-white rounded-md px-5 py-2 text-[11px] font-semibold hover:bg-indigo-500 active:scale-[0.98] transition-all">
                    {ctaLabel}
                  </button>
                )}
              </div>
            )}

            {activeTab === "json" && (
              <pre className="w-full text-left font-mono text-[9px] leading-relaxed text-slate-700 bg-white p-2 overflow-x-auto select-all max-h-[300px] whitespace-pre-wrap animate-fade-in">
                <code>{getJsonRepresentation()}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
