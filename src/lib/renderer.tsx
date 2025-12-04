import React from "react";
import type { Website, Page, Section } from "./types";
import { HeroSection } from "@/src/components/sections/Hero";
import { FeaturesSection } from "@/src/components/sections/Features";
import { ServicesSection } from "@/src/components/sections/Services";
import { GallerySection } from "@/src/components/sections/Gallery";
import { TestimonialsSection } from "@/src/components/sections/Testimonials";
import { ContactSection } from "@/src/components/sections/Contact";

export function getPageBySlug(website: Website, slug: string): Page | null {
  // Remove leading slash if present for matching
  const normalizedSlug = slug.startsWith("/") ? slug.slice(1) : slug;
  return website.pages.find((page) => {
    const pageSlug = page.slug.startsWith("/") ? page.slug.slice(1) : page.slug;
    return pageSlug === normalizedSlug;
  }) || null;
}

export function renderSectionKey(section: Section): string {
  return section.id ?? section.type;
}

export function renderSection(section: Section): React.ReactElement {
  switch (section.type) {
    case "hero":
      return <HeroSection key={section.id} section={section} />;
    case "features":
      return <FeaturesSection key={section.id} section={section} />;
    case "services":
      return <ServicesSection key={section.id} section={section} />;
    case "gallery":
      return <GallerySection key={section.id} section={section} />;
    case "testimonials":
      return <TestimonialsSection key={section.id} section={section} />;
    case "contact":
      return <ContactSection key={section.id} section={section} />;
    case "pricing":
      // Pricing can use FeaturesSection as a fallback or create a custom one
      return <FeaturesSection key={section.id} section={section} />;
    case "custom":
    default:
      // For custom sections, render a simple container
      return (
        <section
          key={section.id}
          style={{
            padding: "40px 20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {section.title && <h2>{section.title}</h2>}
          {section.subtitle && <p>{section.subtitle}</p>}
          {section.body && <p>{section.body}</p>}
        </section>
      );
  }
}

export function renderPage(website: Website, slug: string): React.ReactElement | null {
  const page = getPageBySlug(website, slug);
  
  if (!page) {
    return null;
  }

  return (
    <>
      {page.sections.map((section) => renderSection(section))}
    </>
  );
}

