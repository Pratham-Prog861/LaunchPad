"use client";

import type { PageSection } from "@/lib/schemas/sections";
import { HeroSection } from "@/components/sections/hero-section";
import { CtaSection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PageRendererProps {
  sections: PageSection[];
}

function SectionErrorBoundary({
  section,
  error,
}: {
  section: PageSection;
  error: string;
}) {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Section Error</AlertTitle>
      <AlertDescription>
        Failed to render {section.type} section: {error}
      </AlertDescription>
    </Alert>
  );
}

function renderSection(section: PageSection) {
  switch (section.type) {
    case "hero":
      return <HeroSection key={section.id} data={section} />;
    case "cta":
      return <CtaSection key={section.id} data={section} />;
    case "features":
      return <FeaturesSection key={section.id} data={section} />;
    case "testimonial":
      return <TestimonialSection key={section.id} data={section} />;
    default:
      return (
        <SectionErrorBoundary
          key={(section as PageSection).id}
          section={section}
          error={`Unknown section type`}
        />
      );
  }
}

export function PageRenderer({ sections }: PageRendererProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No sections yet</p>
          <p className="text-sm mt-1">
            Add sections in the editor to build your page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" role="main">
      {sections.map((section) => {
        try {
          return renderSection(section);
        } catch (err) {
          return (
            <SectionErrorBoundary
              key={section.id}
              section={section}
              error={err instanceof Error ? err.message : "Unknown error"}
            />
          );
        }
      })}
    </div>
  );
}
