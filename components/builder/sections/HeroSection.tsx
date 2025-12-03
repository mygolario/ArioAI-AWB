"use client";

import { HeroSection as HeroSectionType } from "@/lib/types/layout";

interface HeroSectionProps {
  section: HeroSectionType;
  theme: "dark" | "light";
}

export function HeroSection({ section, theme }: HeroSectionProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={`py-20 px-6 text-center ${
        isDark ? "bg-slate-900" : "bg-white"
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {section.eyebrow && (
          <p
            className={`text-sm font-medium tracking-wide uppercase ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}
          >
            {section.eyebrow}
          </p>
        )}
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {section.headline}
        </h1>
        {section.subheadline && (
          <p
            className={`text-lg md:text-xl max-w-2xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {section.subheadline}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {section.primaryCta && (
            <a
              href={section.primaryCta.href}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              {section.primaryCta.label}
            </a>
          )}
          {section.secondaryCta && (
            <a
              href={section.secondaryCta.href}
              className={`px-6 py-3 rounded-lg font-medium border transition-colors ${
                isDark
                  ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {section.secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
