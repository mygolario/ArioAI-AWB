"use client";

import { PricingSection as PricingSectionType } from "@/lib/types/layout";

interface PricingSectionProps {
  section: PricingSectionType;
  theme: "dark" | "light";
}

export function PricingSection({ section, theme }: PricingSectionProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={`py-20 px-6 ${isDark ? "bg-slate-900" : "bg-white"}`}
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
          {section.plans.map((plan, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 flex flex-col ${
                plan.highlight
                  ? "border-blue-600 relative"
                  : isDark
                  ? "border-slate-700"
                  : "border-slate-200"
              } ${isDark ? "bg-slate-800" : "bg-white"}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  Popular
                </div>
              )}
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {plan.name}
              </h3>
              <div className="mb-4">
                <span
                  className={`text-4xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className={`text-sm ml-1 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    /{plan.period}
                  </span>
                )}
              </div>
              {plan.description && (
                <p
                  className={`text-sm mb-4 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {plan.description}
                </p>
              )}
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-2 text-sm ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : isDark
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                {plan.ctaLabel || "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
