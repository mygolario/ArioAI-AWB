"use client";

import { Section } from "@/lib/types/layout";
import { HeroPreview } from "./sections/hero-preview";
import { FeaturesPreview } from "./sections/features-preview";
import { PricingPreview } from "./sections/pricing-preview";
import { CtaPreview } from "./sections/cta-preview";
import { FaqPreview } from "./sections/faq-preview";

interface SectionRendererProps {
  section: Section;
  theme: "dark" | "light";
}

export function SectionRenderer({ section, theme }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <HeroPreview section={section} theme={theme} />;
    case "features":
      return <FeaturesPreview section={section} theme={theme} />;
    case "pricing":
      return <PricingPreview section={section} theme={theme} />;
    case "cta":
      return <CtaPreview section={section} theme={theme} />;
    case "faq":
      return <FaqPreview section={section} theme={theme} />;
    default:
      return (
        <div className="p-8 text-center text-slate-500">
          Unknown section type
        </div>
      );
  }
}
