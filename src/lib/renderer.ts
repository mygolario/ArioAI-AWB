import type { Website, Page, Section } from "./types";

export function getPageBySlug(website: Website, slug: string): Page | null {
  return website.pages.find((page) => page.slug === slug) || null;
}

export function renderSectionKey(section: Section): string {
  return section.id ?? section.type;
}

