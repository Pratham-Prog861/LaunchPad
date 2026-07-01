"use client";

import type { CtaSection as CtaSectionType } from "@/lib/schemas/sections";

interface CtaSectionProps {
  data: CtaSectionType;
}

export function CtaSection({ data }: CtaSectionProps) {
  const { heading, description, primaryAction, secondaryAction } = data;

  return (
    <section
      className="w-full bg-[#F9F9FF] py-20 px-6"
      role="region"
      aria-label={heading}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#151C27] tracking-tight mb-4">
          {heading}
        </h2>

        {description && (
          <p className="text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryAction && primaryAction.label && (
            <a
              href={primaryAction.url || "#"}
              className="inline-flex items-center justify-center gap-2 bg-indigo text-white px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-[#4338CA] transition-all duration-200 ambient-shadow focus-ring-indigo min-w-[180px]"
            >
              {primaryAction.label}
            </a>
          )}

          {secondaryAction && secondaryAction.label && (
            <a
              href={secondaryAction.url || "#"}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#151C27] px-8 py-3.5 rounded-lg font-semibold text-base border border-border-subtle hover:border-indigo hover:text-indig transition-all duration-200 focus-ring-indigo min-w-[180px]"
            >
              {secondaryAction.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
