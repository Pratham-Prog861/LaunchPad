import { z } from "zod/v4";

// ─── Section Type Enum ───
export const SectionType = z.enum(["hero", "cta", "features", "testimonial"]);
export type SectionType = z.infer<typeof SectionType>;

// ─── Hero Section Schema ───
export const HeroSectionSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("hero"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().default(""),
  ctaText: z.string().optional().default(""),
  ctaUrl: z.string().optional().default(""),
  backgroundImage: z.string().optional().default(""),
});

export type HeroSection = z.infer<typeof HeroSectionSchema>;

// ─── CTA Section Schema ───
export const CtaSectionSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("cta"),
  heading: z.string().min(1, "Heading is required"),
  description: z.string().optional().default(""),
  primaryAction: z
    .object({
      label: z.string(),
      url: z.string(),
    })
    .optional(),
  secondaryAction: z
    .object({
      label: z.string(),
      url: z.string(),
    })
    .optional(),
});

export type CtaSection = z.infer<typeof CtaSectionSchema>;

// ─── Features Section Schema ───
export const FeaturesSectionSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("features"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().default(""),
  feature1Title: z.string().min(1, "Feature 1 title is required"),
  feature1Desc: z.string().optional().default(""),
  feature2Title: z.string().min(1, "Feature 2 title is required"),
  feature2Desc: z.string().optional().default(""),
  feature3Title: z.string().min(1, "Feature 3 title is required"),
  feature3Desc: z.string().optional().default(""),
});

export type FeaturesSection = z.infer<typeof FeaturesSectionSchema>;

// ─── Testimonial Section Schema ───
export const TestimonialSectionSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("testimonial"),
  quote: z.string().min(1, "Quote is required"),
  author: z.string().min(1, "Author name is required"),
  role: z.string().optional().default(""),
  avatarUrl: z.string().optional().default(""),
});

export type TestimonialSection = z.infer<typeof TestimonialSectionSchema>;

// ─── Discriminated Union of all Section Types ───
export const PageSectionSchema = z.discriminatedUnion("type", [
  HeroSectionSchema,
  CtaSectionSchema,
  FeaturesSectionSchema,
  TestimonialSectionSchema,
]);

export type PageSection = z.infer<typeof PageSectionSchema>;

// ─── Page Content Schema (array of sections) ───
export const PageContentSchema = z.array(PageSectionSchema);
export type PageContent = z.infer<typeof PageContentSchema>;

// ─── Default Props Factories ───
export function createDefaultHeroProps(): Omit<HeroSection, "id"> {
  return {
    type: "hero",
    title: "Welcome to our site",
    subtitle: "Discover what we have to offer",
    ctaText: "Get Started",
    ctaUrl: "",
    backgroundImage: "",
  };
}

export function createDefaultCtaProps(): Omit<CtaSection, "id"> {
  return {
    type: "cta",
    heading: "Ready to get started?",
    description: "Join thousands of satisfied customers today.",
    primaryAction: { label: "Sign Up Now", url: "" },
    secondaryAction: { label: "Learn More", url: "" },
  };
}

export function createDefaultFeaturesProps(): Omit<FeaturesSection, "id"> {
  return {
    type: "features",
    title: "Core Capabilities",
    subtitle: "Everything you need to orchestrate content",
    feature1Title: "Schema-Driven Studio",
    feature1Desc: "Enforce strict definitions for every section.",
    feature2Title: "Deterministic Releases",
    feature2Desc: "Deploy immutable SemVer snapshots.",
    feature3Title: "Granular Access Control",
    feature3Desc: "Viewer, Editor, and Publisher roles.",
  };
}

export function createDefaultTestimonialProps(): Omit<
  TestimonialSection,
  "id"
> {
  return {
    type: "testimonial",
    quote:
      "LaunchPad transformed our content workflows. The schema-driven validation saved us from countless layout breakages in production.",
    author: "Sarah Connor",
    role: "VP of Engineering at Cyberdyne Systems",
    avatarUrl: "",
  };
}
