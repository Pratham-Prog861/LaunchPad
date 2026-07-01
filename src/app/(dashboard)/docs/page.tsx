import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Code,
  Layers,
  Rocket,
  Shield,
  ArrowRight,
  Terminal,
} from "lucide-react";

export default function DocsPage() {
  return (
    <>
      <div className="space-y-1">
        <h2 className="text-[30px] leading-[38px] font-semibold text-[#151C27] tracking-[-0.02em]">
          Documentation
        </h2>
        <p className="text-text-secondary text-base">
          Learn how to define layout schemas, compose sandbox drafts, and release snapshots.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Core Docs Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Quick Start Guide */}
          <Card className="border-border-subtle ambient-shadow">
            <CardHeader className="border-b border-border-subtle bg-surface-sidebar/50">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo" />
                <CardTitle className="text-lg font-semibold text-[#151C27]">
                  Developer Quick Start
                </CardTitle>
              </div>
              <CardDescription>
                Define component properties with Zod and register them in the layout pipeline.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 text-left">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  1. Define Layout Schema
                </span>
                <p className="text-xs text-text-secondary leading-normal">
                  All components inside LaunchPad must be defined as schema structures in <code className="text-xs text-indigo font-mono bg-indigo/5 px-1.5 py-0.5 rounded border border-indigo-100">src/lib/schemas/sections.ts</code>:
                </p>
                <pre className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-indigo-200 overflow-x-auto whitespace-pre">
                  <code>
                    {`export const TestimonialSectionSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("testimonial"),
  quote: z.string().min(1, "Quote is required"),
  author: z.string().min(1, "Author name is required"),
  role: z.string().optional().default(""),
});`}
                  </code>
                </pre>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-800 block">
                  2. Register in Section Registry
                </span>
                <p className="text-xs text-text-secondary leading-normal">
                  Add your new component structure to the central registry file <code className="text-xs text-indigo font-mono bg-indigo/5 px-1.5 py-0.5 rounded border border-indigo-100">src/lib/registry/section-registry.ts</code>:
                </p>
                <pre className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-indigo-200 overflow-x-auto whitespace-pre">
                  <code>
                    {`registerSection("testimonial", {
  schema: TestimonialSectionSchema as unknown as z.ZodType<PageSection>,
  defaultProps: createDefaultTestimonialProps,
  label: "Testimonial Card",
  icon: "quote",
});`}
                  </code>
                </pre>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-800 block">
                  3. Implement the Visual Component
                </span>
                <p className="text-xs text-text-secondary leading-normal">
                  Write the React visual representation in <code className="text-xs text-indigo font-mono bg-indigo/5 px-1.5 py-0.5 rounded border border-indigo-100">src/components/sections/</code> and add it to the render switch block inside [page-renderer.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/components/renderer/page-renderer.tsx).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Architecture Overview */}
          <Card className="border-border-subtle ambient-shadow">
            <CardHeader className="border-b border-border-subtle bg-surface-sidebar/50">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo" />
                <CardTitle className="text-lg font-semibold text-[#151C27]">
                  Architecture Pipeline
                </CardTitle>
              </div>
              <CardDescription>
                How LaunchPad isolates local editing sessions from stable production endpoints.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-border-subtle rounded-xl p-4 space-y-2 bg-slate-50/50">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Sandbox Drafts
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Layout structures are saved locally as raw JSON files in the <code className="text-[10px] font-mono bg-slate-100 p-0.5 rounded border">data/drafts/</code> directory during visual editing. In production, these drafts reside in Contentful or safe database staging fields.
                  </p>
                </div>

                <div className="border border-border-subtle rounded-xl p-4 space-y-2 bg-slate-50/50">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Immutable Releases
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    When a publisher releases changes, the system creates versioned snapshots inside the <code className="text-[10px] font-mono bg-slate-100 p-0.5 rounded border">data/releases/</code> directory. Bumps use SemVer notation (Major.Minor.Patch) to guarantee deterministic rendering.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Permissions Table & Guides */}
        <div className="space-y-6">
          {/* RBAC Rules Table */}
          <Card className="border-border-subtle ambient-shadow">
            <CardHeader className="border-b border-border-subtle bg-surface-sidebar/50">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo" />
                <CardTitle className="text-sm font-bold text-[#151C27] uppercase tracking-wider">
                  RBAC Hierarchy
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-left">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-subtle bg-slate-50 text-text-secondary font-semibold">
                    <th className="px-4 py-2.5 text-left font-bold">Role</th>
                    <th className="px-4 py-2.5 text-left font-bold">Level</th>
                    <th className="px-4 py-2.5 text-left font-bold">Capabilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-slate-700">
                  <tr>
                    <td className="px-4 py-2.5 font-bold">Viewer</td>
                    <td className="px-4 py-2.5 font-mono text-[10px]">Level 1</td>
                    <td className="px-4 py-2.5 text-text-secondary">Preview drafts, read audit logs.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold">Editor</td>
                    <td className="px-4 py-2.5 font-mono text-[10px]">Level 2</td>
                    <td className="px-4 py-2.5 text-text-secondary">Modify sections, save page layout drafts.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold">Publisher</td>
                    <td className="px-4 py-2.5 font-mono text-[10px]">Level 3</td>
                    <td className="px-4 py-2.5 text-text-secondary">Release snapshots, bump SemVer tags.</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card className="border-border-subtle ambient-shadow">
            <CardHeader className="border-b border-border-subtle bg-surface-sidebar/50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo" />
                <CardTitle className="text-sm font-bold text-[#151C27] uppercase tracking-wider">
                  Developer Resources
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 text-left space-y-1">
              {[
                { label: "Zod Schema Reference", href: "https://zod.dev" },
                { label: "Clerk Auth Middleware", href: "https://clerk.com/docs" },
                { label: "Contentful Delivery APIs", href: "https://www.contentful.com/developers/docs/" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo transition-colors"
                >
                  {item.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
