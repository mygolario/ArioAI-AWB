"use client";

import { WebsiteLayout, Section } from "@/lib/types/layout";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { PricingSection } from "./sections/PricingSection";
import { CtaSection } from "./sections/CtaSection";
import { FaqSection } from "./sections/FaqSection";

interface WebsitePreviewProps {
  layout: WebsiteLayout | null;
}

function renderSection(section: Section, theme: "dark" | "light") {
  switch (section.type) {
    case "hero":
      return <HeroSection key={section.id} section={section} theme={theme} />;
    case "features":
      return <FeaturesSection key={section.id} section={section} theme={theme} />;
    case "pricing":
      return <PricingSection key={section.id} section={section} theme={theme} />;
    case "cta":
      return <CtaSection key={section.id} section={section} theme={theme} />;
    case "faq":
      return <FaqSection key={section.id} section={section} theme={theme} />;
    default:
      return null;
  }
}

export function WebsitePreview({ layout }: WebsitePreviewProps) {
  if (!layout) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 text-slate-500">
        <div className="text-center space-y-2">
          <span className="text-4xl block">🌐</span>
          <p className="text-lg">No layout generated yet.</p>
          <p className="text-sm">Enter a prompt and click Generate to see your website.</p>
        </div>
      </div>
    );
  }

  const page = layout.pages[0];

  if (!page) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 text-slate-500">
        <p>No pages in layout</p>
      </div>
    );
  }

  const isDark = layout.theme === "dark";

  return (
    <div className={`min-h-full ${isDark ? "bg-slate-900" : "bg-white"}`}>
      {/* Header */}
      <header
        className={`sticky top-0 z-10 px-6 py-4 border-b backdrop-blur ${
          isDark
            ? "bg-slate-900/95 border-slate-800"
            : "bg-white/95 border-slate-200"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {layout.siteName}
          </span>
          <nav className="hidden md:flex items-center gap-6">
            {layout.pages.map((p) => (
              <a
                key={p.id}
                href={`#${p.slug}`}
                className={`text-sm font-medium hover:text-blue-500 transition-colors ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {p.title}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Sections */}
      <main>
        {page.sections.map((section) => renderSection(section, layout.theme))}
      </main>

      {/* Footer */}
      <footer
        className={`py-8 px-6 border-t text-center ${
          isDark
            ? "bg-slate-900 border-slate-800 text-slate-400"
            : "bg-slate-50 border-slate-200 text-slate-600"
        }`}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} {layout.siteName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
