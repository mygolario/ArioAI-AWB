"use client";

import { useState } from "react";
import { FaqSection as FaqSectionType } from "@/lib/types/layout";

interface FaqSectionProps {
  section: FaqSectionType;
  theme: "dark" | "light";
}

export function FaqSection({ section, theme }: FaqSectionProps) {
  const isDark = theme === "dark";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className={`py-16 px-6 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-12 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {section.title}
        </h2>
        <div className="space-y-4">
          {section.items.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg overflow-hidden ${
                isDark ? "bg-slate-900" : "bg-white shadow-sm"
              }`}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className={`w-full px-6 py-4 text-left flex justify-between items-center ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                <span className="font-medium">{item.question}</span>
                <span
                  className={`transition-transform text-sm ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div
                  className={`px-6 pb-4 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
