"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is a schema-driven CMS?",
      a: "Unlike traditional legacy CMSs that output unrestricted rich text, a schema-driven CMS enforces layout constraints. Layout structures are defined as JSON structures validated using Zod, ensuring visual components are rendered safely without UI breakage.",
    },
    {
      q: "How does SemVer page versioning work?",
      a: "When you publish drafts, the system forces a SemVer-compliant version bump (Patch for minor fixes, Minor for new components, Major for full layouts). Each version creates an immutable snapshot file, allowing you to track logs, audit diffs, and perform rollbacks safely.",
    },
    {
      q: "Does it support real-time visual previews?",
      a: "Yes. The Studio Editor features a side-by-side editing canvas and a mock browser preview. When you modify properties, the visual canvas rerenders instantly using your local schema properties, allowing editors to see exactly what they build before committing.",
    },
    {
      q: "How are roles mapped to users?",
      a: "The system integrates directly with Clerk Organizations. User accounts are assigned to specific roles (Viewer, Editor, Publisher) which dictate permissions for visual editing, saving drafts, and initiating deployments.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`border rounded-xl transition-all duration-300 ${
              isOpen
                ? "bg-indigo-50/20 border-indigo-200 shadow-sm"
                : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
              <h3 className="text-sm font-bold text-slate-800 pr-4">
                {faq.q}
              </h3>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${
                  isOpen ? "rotate-180 text-indigo-600" : ""
                }`}
              />
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: isOpen ? "200px" : "0px",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="p-5 pt-0 border-t border-slate-100 text-xs text-slate-600 leading-relaxed text-left">
                {faq.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
