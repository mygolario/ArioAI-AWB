"use client";

import { FeaturesSection as FeaturesSectionType } from "@/lib/types/layout";

interface FeaturesSectionProps {
  section: FeaturesSectionType;
  theme: "dark" | "light";
}

export function FeaturesSection({ section, theme }: FeaturesSectionProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={`py-20 px-6 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {section.title}
          </h2>
          {section.subtitle && (
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {section.subtitle}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.items.map((item, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                isDark ? "bg-slate-900" : "bg-white shadow-sm"
              }`}
            >
              {item.icon && <div className="text-3xl mb-4">{item.icon}</div>}
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
