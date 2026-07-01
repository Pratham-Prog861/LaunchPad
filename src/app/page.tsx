import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Rocket,
  ShieldCheck,
  Eye,
  Sliders,
  Check,
  Lock,
  Workflow,
  Cpu,
  History,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchemaPlayground } from "@/components/landing/schema-playground";
import { RbacSimulator } from "@/components/landing/rbac-simulator";
import { FaqAccordion } from "@/components/landing/faq-accordion";

export default async function LandingPage() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500/10 selection:text-indigo-700 overflow-x-hidden">
      {/* HTML Smooth Scroll Injection */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 10s infinite ease-in-out;
        }
      `}</style>

      {/* Radiant Aura / Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[800px] pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-indigo-50/50 blur-[130px] animate-pulse-glow"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-50/40 blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-blue-50/30 blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "6s" }}
        />
      </div>

      {/* Frosted Glass Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/80 transition-all">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-600 border border-indigo-600/20">
              <Layers className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors">
                LaunchPad
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a
              href="#playground"
              className="hover:text-slate-900 transition-colors"
            >
              Playground
            </a>
            <a
              href="#process"
              className="hover:text-slate-900 transition-colors"
            >
              How it Works
            </a>
            <a
              href="#features"
              className="hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <a href="#rbac" className="hover:text-slate-900 transition-colors">
              Access Control
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQs
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-sm font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-20 pb-16 md:pt-28 md:pb-20 text-center flex flex-col items-center">
        {/* Banner Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Interactive Schema-Driven CMS</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.08] mb-6">
          The Developer CMS for <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Deterministic Deployments
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed mb-10">
          LaunchPad bridges visual design and code. Compose pages visually using
          structured components, validate them against schemas, and release with
          immutable SemVer snapshots.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 w-full sm:w-auto relative z-20">
          {isSignedIn ? (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 rounded-lg font-medium text-base shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 rounded-lg font-medium text-base shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#playground" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-8 py-6 rounded-lg font-medium text-base flex items-center justify-center gap-2 transition-all"
                >
                  Try Playground
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Signature Element: Interactive Schema Playground (Styled Dark for pop-out contrast) */}
        <div
          id="playground"
          className="scroll-mt-20 w-full flex justify-center"
        >
          <SchemaPlayground />
        </div>
      </section>

      {/* How it Works / Process Pipeline */}
      <section
        id="process"
        className="scroll-mt-20 py-24 border-y border-slate-100 bg-slate-50/50 relative z-10"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Visual editing meets code assurance
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              LaunchPad establishes a deterministic pipeline, ensuring content
              changes follow a type-safe release cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200/80 p-8 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 transition-all hover:shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-mono text-sm font-bold mb-6">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  Define Layout Schema
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Define your component layout structures as TypeScript
                  interfaces validated with Zod schemas. Specify strict types
                  for your Hero, CTA, or custom modules.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[9px] text-slate-700 text-left">
                <span className="text-purple-600">const</span> Hero =
                z.object(&#123; <br />
                &nbsp;&nbsp;title: z.string(), <br />
                &nbsp;&nbsp;ctaUrl: z.string().url() <br />
                &#125;);
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200/80 p-8 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 transition-all hover:shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-mono text-sm font-bold mb-6">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-indigo-600" />
                  Compose in the Sandbox
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Content editors build landing pages visually inside the
                  Studio. Property forms adapt dynamically to the Zod schemas,
                  preventing invalid content entry.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
                <div className="h-2 w-1/3 bg-slate-300 rounded animate-pulse" />
                <div className="h-6 w-full bg-white rounded border border-slate-200 flex items-center px-2 text-[8px] text-slate-500">
                  Welcome to LaunchPad
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200/80 p-8 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 transition-all hover:shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-mono text-sm font-bold mb-6">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  Deploy Version Snapshot
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Release page changes deterministically. Bumps generate SemVer
                  snapshots (e.g. Major, Minor, Patch) which write immutable
                  JSONs for secure rendering and simple rollbacks.
                </p>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[10px] font-mono">
                <span className="text-emerald-600 font-bold">v1.2.0</span>
                <span className="text-slate-400">→</span>
                <span className="text-indigo-600 font-bold">
                  v1.3.0 (Minor)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="scroll-mt-20 py-24 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Core Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-3 mb-4">
              Everything you need to orchestrate content
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              A comprehensive system built for speed, safety, and visual
              excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Schema-Driven Sections",
                desc: "Every section is validated against strict Zod definitions. No malformed JSON ever breaks your visual components.",
                icon: Sliders,
              },
              {
                title: "Deterministic Releases",
                desc: "Create immutable SemVer snapshots. Perfect for tracking release logs, comparing histories, and instant rollbacks.",
                icon: Rocket,
              },
              {
                title: "Granular RBAC Control",
                desc: "Secure editing pipelines with Viewer, Editor, and Publisher roles. Safely map permissions to Clerk organizations.",
                icon: ShieldCheck,
              },
              {
                title: "Visual Sandbox Editor",
                desc: "An intuitive editing workspace with a responsive mock browser preview. Type in props and see changes instantly.",
                icon: Eye,
              },
              {
                title: "Fast Local Persistence",
                desc: "Reads and writes draft layouts to local JSON databases in development. Easily swap to database adapters in staging.",
                icon: Cpu,
              },
              {
                title: "Production Ready CDN",
                desc: "Serve validated JSON snapshots through Contentful CMS or direct endpoints at ultra-low latency.",
                icon: ArrowRight,
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200/60 p-8 rounded-2xl hover:border-indigo-500/20 hover:bg-white transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/5 text-left group"
                >
                  <div className="p-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl w-fit mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RBAC Control Center */}
      <section
        id="rbac"
        className="scroll-mt-20 py-24 border-t border-slate-100 bg-slate-50/50 relative z-10"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Enterprise Security
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-3 mb-4">
              Secure editing pipelines with custom roles
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Protect your production pipelines from accidental bumps or
              unauthorized updates. Map Clerk user privileges in one-click.
            </p>
          </div>

          <RbacSimulator />
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="scroll-mt-20 py-24 relative z-10 max-w-[1440px] mx-auto px-6 md:px-12"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-3 mb-4">
            Answers to your queries
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Everything you need to know about the LaunchPad CMS.
          </p>
        </div>

        {/* Dynamic Accordion Component with Smooth transitions */}
        <FaqAccordion />
      </section>

      {/* Trust / Final Call to Action */}
      <section className="py-24 relative z-10 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="relative rounded-3xl p-8 md:p-16 max-w-4xl mx-auto flex flex-col items-center border border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-white shadow-xl shadow-slate-100 overflow-hidden">
          {/* Subtle decoration inside banner */}
          <div className="absolute -top-[50%] -left-[10%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[80px]" />
          <div className="absolute -bottom-[50%] -right-[10%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px]" />

          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 relative z-10 leading-tight">
            Ready to design your next digital canvas?
          </h2>
          <p className="text-slate-600 text-xs md:text-sm max-w-md mb-8 relative z-10 leading-relaxed">
            Get started for free and explore the sandboxed LaunchPad CMS. Set up
            layouts and deploy immutable snapshots in minutes.
          </p>
          <div className="flex items-center gap-4 relative z-10">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-5 rounded-lg font-medium text-sm shadow-md transition-all active:scale-[0.98]">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-5 rounded-lg font-medium text-sm shadow-md transition-all active:scale-[0.98]">
                  Create Free Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-12 relative z-10 text-xs text-slate-500">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">LaunchPad</span>
          </div>
          <div>
            <span>
              &copy; {new Date().getFullYear()} LaunchPad Inc. All rights
              reserved.
            </span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-800 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
