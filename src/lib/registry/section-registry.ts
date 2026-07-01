import type { ComponentType } from "react";
import type { z } from "zod/v4";
import {
  type SectionType,
  type PageSection,
  HeroSectionSchema,
  CtaSectionSchema,
  FeaturesSectionSchema,
  TestimonialSectionSchema,
  createDefaultHeroProps,
  createDefaultCtaProps,
  createDefaultFeaturesProps,
  createDefaultTestimonialProps,
} from "@/lib/schemas/sections";

// ─── Registry Entry Type ───
export interface SectionRegistryEntry {
  schema: z.ZodType<PageSection>;
  defaultProps: () => Omit<PageSection, "id">;
  label: string;
  icon: string; // Lucide icon name
}

// ─── Registry Map ───
const registry = new Map<SectionType, SectionRegistryEntry>();

// ─── Register a Section ───
export function registerSection(
  type: SectionType,
  entry: SectionRegistryEntry
) {
  registry.set(type, entry);
}

// ─── Get a Section Entry ───
export function getSection(type: SectionType): SectionRegistryEntry | undefined {
  return registry.get(type);
}

// ─── Get All Registered Section Types ───
export function getAllSectionTypes(): SectionType[] {
  return Array.from(registry.keys());
}

// ─── Get All Registry Entries ───
export function getAllSections(): [SectionType, SectionRegistryEntry][] {
  return Array.from(registry.entries());
}

// ─── Register Built-in Sections ───
registerSection("hero", {
  schema: HeroSectionSchema as unknown as z.ZodType<PageSection>,
  defaultProps: createDefaultHeroProps,
  label: "Hero Section",
  icon: "image",
});

registerSection("cta", {
  schema: CtaSectionSchema as unknown as z.ZodType<PageSection>,
  defaultProps: createDefaultCtaProps,
  label: "Call to Action",
  icon: "mouse-pointer-click",
});

registerSection("features", {
  schema: FeaturesSectionSchema as unknown as z.ZodType<PageSection>,
  defaultProps: createDefaultFeaturesProps,
  label: "Features List",
  icon: "layout-grid",
});

registerSection("testimonial", {
  schema: TestimonialSectionSchema as unknown as z.ZodType<PageSection>,
  defaultProps: createDefaultTestimonialProps,
  label: "Testimonial",
  icon: "quote",
});
