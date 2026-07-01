"use client";

import type { FeaturesSection as FeaturesSectionType } from "@/lib/schemas/sections";
import { Check } from "lucide-react";

interface FeaturesSectionProps {
  data: FeaturesSectionType;
}

export function FeaturesSection({ data }: FeaturesSectionProps) {
  const {
    title,
    subtitle,
    feature1Title,
    feature1Desc,
    feature2Title,
    feature2Desc,
    feature3Title,
    feature3Desc,
  } = data;

  const featuresList = [
    { title: feature1Title, desc: feature1Desc },
    { title: feature2Title, desc: feature2Desc },
    { title: feature3Title, desc: feature3Desc },
  ].filter(f => f.title); // only show if title is present

  return (
    <section
      className="w-full bg-white py-20 px-6 border-t border-border-subtle"
      role="region"
      aria-label={title}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#151C27] tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-text-secondary leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresList.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-border-subtle shadow-sm hover:border-indigo/30 transition-all hover:scale-[1.01]"
            >
              <div className="p-2.5 bg-indigo/10 text-indigo rounded-xl w-fit mb-6">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#151C27] mb-2">{feat.title}</h3>
              {feat.desc && (
                <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
