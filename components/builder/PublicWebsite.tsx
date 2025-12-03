"use client";

import { WebsiteLayout, Section } from "@/lib/types/layout";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { PricingSection } from "./sections/PricingSection";
import { CtaSection } from "./sections/CtaSection";
import { FaqSection } from "./sections/FaqSection";

interface PublicWebsiteProps {
  layout: WebsiteLayout;
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

export function PublicWebsite({ layout }: PublicWebsiteProps) {
  const page = layout.pages[0];

  if (!page) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-6 py-12 flex flex-col">
        {page.sections.map((section) => renderSection(section, layout.theme))}
      </main>
    </div>
  );
}
