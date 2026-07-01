"use client";

import type { TestimonialSection as TestimonialType } from "@/lib/schemas/sections";
import { Quote } from "lucide-react";

interface TestimonialSectionProps {
  data: TestimonialType;
}

export function TestimonialSection({ data }: TestimonialSectionProps) {
  const { quote, author, role, avatarUrl } = data;

  return (
    <section
      className="w-full bg-slate-50 py-20 px-6 border-t border-border-subtle"
      role="region"
      aria-label={`Testimonial from ${author}`}
    >
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <div className="p-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl w-fit mb-8">
          <Quote className="w-6 h-6" />
        </div>

        <blockquote className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed max-w-3xl mb-8">
          &ldquo;{quote}&rdquo;
        </blockquote>

        <div className="flex flex-col items-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={author}
              className="w-12 h-12 rounded-full object-cover mb-3 border border-slate-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-3">
              {author.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-slate-900 text-base">{author}</span>
          {role && (
            <span className="text-xs text-text-secondary mt-0.5">{role}</span>
          )}
        </div>
      </div>
    </section>
  );
}
