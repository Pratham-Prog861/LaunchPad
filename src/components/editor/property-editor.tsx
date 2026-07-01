"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  selectSections,
  updateSectionProps,
} from "@/lib/store/slices/draft-page-slice";
import { selectSelectedSectionId } from "@/lib/store/slices/ui-slice";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  HeroSectionSchema,
  CtaSectionSchema,
  FeaturesSectionSchema,
  TestimonialSectionSchema,
  type HeroSection,
  type CtaSection,
  type FeaturesSection,
  type TestimonialSection,
} from "@/lib/schemas/sections";
import { useState } from "react";
import { Sliders, HelpCircle } from "lucide-react";

export function PropertyEditor() {
  const dispatch = useAppDispatch();
  const sections = useAppSelector(selectSections);
  const selectedId = useAppSelector(selectSelectedSectionId);

  const selectedSection = sections.find((s) => s.id === selectedId);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prevId, setPrevId] = useState<string | null>(null);

  // Reset errors when selected section changes directly in render
  if (selectedId !== prevId) {
    setPrevId(selectedId);
    setErrors({});
  }

  if (!selectedSection) {
    return (
      <div className="flex flex-col h-full bg-[#F9FAFB] border-l border-[#E5E7EB] w-[300px] items-center justify-center text-center p-6">
        <Sliders className="w-10 h-10 text-[#777587]/30 mb-3" />
        <h4 className="text-sm font-semibold text-[#151C27]">Property Editor</h4>
        <p className="text-xs text-[#6B7280] mt-1 max-w-[200px] mx-auto leading-relaxed">
          Select a section from the list to modify its content properties.
        </p>
      </div>
    );
  }

  const handleFieldChange = (
    field: string,
    value: unknown,
    nestedField?: string
  ) => {
    const updates: Record<string, unknown> = {};

    if (nestedField) {
      const currentVal = (selectedSection as Record<string, unknown>)[field] as Record<string, unknown> || {};
      updates[field] = {
        ...currentVal,
        [nestedField]: value,
      };
    } else {
      updates[field] = value;
    }

    // Real-time dispatch to Redux (auto-save)
    dispatch(updateSectionProps({ id: selectedSection.id, updates }));

    // Real-time validation using Zod
    const fullUpdatedSection = {
      ...selectedSection,
      ...updates,
    };

    let schema;
    if (selectedSection.type === "hero") {
      schema = HeroSectionSchema;
    } else if (selectedSection.type === "cta") {
      schema = CtaSectionSchema;
    } else if (selectedSection.type === "features") {
      schema = FeaturesSectionSchema;
    } else {
      schema = TestimonialSectionSchema;
    }
    
    const result = schema.safeParse(fullUpdatedSection);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
  };

  const isHero = selectedSection.type === "hero";
  const isCta = selectedSection.type === "cta";
  const isFeatures = selectedSection.type === "features";
  const hero = selectedSection as HeroSection;
  const cta = selectedSection as CtaSection;
  const features = selectedSection as FeaturesSection;
  const testimonial = selectedSection as TestimonialSection;

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] border-l border-[#E5E7EB] w-[300px]">
      <div className="p-4 border-b border-[#E5E7EB] bg-white">
        <h3 className="text-sm font-semibold text-[#151C27] flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-[#4F46E5]" />
          Properties
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {isHero ? (
          // Hero Section Inputs
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Hero Title
              </label>
              <Input
                value={hero.title || ""}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5]"
              />
              {errors["title"] && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors["title"]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Subtitle
              </label>
              <Textarea
                value={hero.subtitle || ""}
                onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5] min-h-[80px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                CTA Button Label
              </label>
              <Input
                value={hero.ctaText || ""}
                onChange={(e) => handleFieldChange("ctaText", e.target.value)}
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                CTA Redirect URL
              </label>
              <Input
                value={hero.ctaUrl || ""}
                onChange={(e) => handleFieldChange("ctaUrl", e.target.value)}
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5] font-mono text-xs"
                placeholder="https://..."
              />
              {errors["ctaUrl"] && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors["ctaUrl"]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Background Image URL
              </label>
              <Input
                value={hero.backgroundImage || ""}
                onChange={(e) =>
                  handleFieldChange("backgroundImage", e.target.value)
                }
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5] font-mono text-xs"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        ) : isCta ? (
          // CTA Section Inputs
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Heading
              </label>
              <Input
                value={cta.heading || ""}
                onChange={(e) => handleFieldChange("heading", e.target.value)}
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5]"
              />
              {errors["heading"] && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors["heading"]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Description
              </label>
              <Textarea
                value={cta.description || ""}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5] min-h-[80px]"
              />
            </div>

            {/* Primary Action */}
            <div className="space-y-3 p-3 bg-white border border-[#E5E7EB] rounded-xl">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                Primary Button Action
              </span>
              <div className="space-y-2">
                <Input
                  placeholder="Label"
                  value={cta.primaryAction?.label || ""}
                  onChange={(e) =>
                    handleFieldChange("primaryAction", e.target.value, "label")
                  }
                  className="bg-white border-[#E5E7EB] text-xs h-8"
                />
                <Input
                  placeholder="URL (https://...)"
                  value={cta.primaryAction?.url || ""}
                  onChange={(e) =>
                    handleFieldChange("primaryAction", e.target.value, "url")
                  }
                  className="bg-white border-[#E5E7EB] text-xs h-8 font-mono"
                />
              </div>
            </div>

            {/* Secondary Action */}
            <div className="space-y-3 p-3 bg-white border border-[#E5E7EB] rounded-xl">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                Secondary Button Action
              </span>
              <div className="space-y-2">
                <Input
                  placeholder="Label"
                  value={cta.secondaryAction?.label || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "secondaryAction",
                      e.target.value,
                      "label"
                    )
                  }
                  className="bg-white border-[#E5E7EB] text-xs h-8"
                />
                <Input
                  placeholder="URL (https://...)"
                  value={cta.secondaryAction?.url || ""}
                  onChange={(e) =>
                    handleFieldChange("secondaryAction", e.target.value, "url")
                  }
                  className="bg-white border-[#E5E7EB] text-xs h-8 font-mono"
                />
              </div>
            </div>
          </div>
        ) : isFeatures ? (
          // Features Section Inputs
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Section Title
              </label>
              <Input
                value={features.title || ""}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5]"
              />
              {errors["title"] && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors["title"]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Section Subtitle
              </label>
              <Textarea
                value={features.subtitle || ""}
                onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5] min-h-[60px]"
              />
            </div>

            {/* Feature 1 */}
            <div className="space-y-3 p-3 bg-white border border-[#E5E7EB] rounded-xl">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                Feature Item 1
              </span>
              <div className="space-y-2">
                <Input
                  placeholder="Title"
                  value={features.feature1Title || ""}
                  onChange={(e) => handleFieldChange("feature1Title", e.target.value)}
                  className="bg-white border-[#E5E7EB] text-xs h-8"
                />
                {errors["feature1Title"] && (
                  <p className="text-[11px] text-red-600 font-medium">
                    {errors["feature1Title"]}
                  </p>
                )}
                <Textarea
                  placeholder="Description"
                  value={features.feature1Desc || ""}
                  onChange={(e) => handleFieldChange("feature1Desc", e.target.value)}
                  className="bg-white border-[#E5E7EB] text-xs min-h-[40px] resize-none"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3 p-3 bg-white border border-[#E5E7EB] rounded-xl">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                Feature Item 2
              </span>
              <div className="space-y-2">
                <Input
                  placeholder="Title"
                  value={features.feature2Title || ""}
                  onChange={(e) => handleFieldChange("feature2Title", e.target.value)}
                  className="bg-white border-[#E5E7EB] text-xs h-8"
                />
                {errors["feature2Title"] && (
                  <p className="text-[11px] text-red-600 font-medium">
                    {errors["feature2Title"]}
                  </p>
                )}
                <Textarea
                  placeholder="Description"
                  value={features.feature2Desc || ""}
                  onChange={(e) => handleFieldChange("feature2Desc", e.target.value)}
                  className="bg-white border-[#E5E7EB] text-xs min-h-[40px] resize-none"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="space-y-3 p-3 bg-white border border-[#E5E7EB] rounded-xl">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                Feature Item 3
              </span>
              <div className="space-y-2">
                <Input
                  placeholder="Title"
                  value={features.feature3Title || ""}
                  onChange={(e) => handleFieldChange("feature3Title", e.target.value)}
                  className="bg-white border-[#E5E7EB] text-xs h-8"
                />
                {errors["feature3Title"] && (
                  <p className="text-[11px] text-red-600 font-medium">
                    {errors["feature3Title"]}
                  </p>
                )}
                <Textarea
                  placeholder="Description"
                  value={features.feature3Desc || ""}
                  onChange={(e) => handleFieldChange("feature3Desc", e.target.value)}
                  className="bg-white border-[#E5E7EB] text-xs min-h-[40px] resize-none"
                />
              </div>
            </div>
          </div>
        ) : (
          // Testimonial Section Inputs
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Quote
              </label>
              <Textarea
                value={testimonial.quote || ""}
                onChange={(e) => handleFieldChange("quote", e.target.value)}
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5] min-h-[100px]"
              />
              {errors["quote"] && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors["quote"]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Author
              </label>
              <Input
                value={testimonial.author || ""}
                onChange={(e) => handleFieldChange("author", e.target.value)}
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5]"
              />
              {errors["author"] && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors["author"]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Role / Subtitle
              </label>
              <Input
                value={testimonial.role || ""}
                onChange={(e) => handleFieldChange("role", e.target.value)}
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Avatar Image URL
              </label>
              <Input
                value={testimonial.avatarUrl || ""}
                onChange={(e) => handleFieldChange("avatarUrl", e.target.value)}
                className="bg-white border-[#E5E7EB] text-sm focus-visible:ring-[#4F46E5] font-mono text-xs"
                placeholder="https://..."
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#E5E7EB] bg-white flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-[#777587] shrink-0 mt-0.5" />
        <span className="text-[10px] text-[#6B7280] leading-normal">
          Changes are auto-saved to Redux state locally and persisted when you click
          &quot;Save Draft&quot;.
        </span>
      </div>
    </div>
  );
}
