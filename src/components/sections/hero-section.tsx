"use client";

import type { HeroSection as HeroSectionType } from "@/lib/schemas/sections";

interface HeroSectionProps {
  data: HeroSectionType;
}

export function HeroSection({ data }: HeroSectionProps) {
  const { title, subtitle, ctaText, ctaUrl, backgroundImage } = data;

  return (
    <section
      className="relative w-full min-h-[480px] flex items-center justify-center overflow-hidden"
      role="banner"
      aria-label={title}
    >
      {/* Background */}
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          role="img"
          aria-label="Hero background"
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] via-[#6366F1] to-[#818CF8]" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
          {title}
        </h1>

        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>
        )}

        {ctaText && (
          <a
            href={ctaUrl || "#"}
            className="inline-flex items-center gap-2 bg-white text-[#4F46E5] px-8 py-4 rounded-lg font-semibold text-base hover:bg-white/90 transition-all duration-200 ambient-shadow focus-ring-indigo"
            role="link"
          >
            {ctaText}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        )}
      </div>
    </section>
  );
}
