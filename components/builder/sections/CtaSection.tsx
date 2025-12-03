"use client";

import { CtaSection as CtaSectionType } from "@/lib/types/layout";

interface CtaSectionProps {
  section: CtaSectionType;
  theme: "dark" | "light";
}

export function CtaSection({ section, theme }: CtaSectionProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={`py-16 px-6 ${isDark ? "bg-blue-900/30" : "bg-blue-50"}`}
    >
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {section.eyebrow && (
          <p
            className={`text-sm font-medium tracking-wide uppercase ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}
          >
            {section.eyebrow}
          </p>
        )}
        <h2
          className={`text-3xl md:text-4xl font-bold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {section.title}
        </h2>
        {section.subtitle && (
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {section.subtitle}
          </p>
        )}
        <div className="pt-4">
          <a
            href={section.primaryCta.href}
            className="inline-block px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            {section.primaryCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
