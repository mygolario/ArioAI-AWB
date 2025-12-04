export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    accent1: string;
    accent2: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  radius: string;
  shadow: string;
}

export interface BrandIdentity {
  name: string;
  tagline: string;
  alternatives: string[];
  logoDirection: string;
}

export type SectionType =
  | "hero"
  | "features"
  | "services"
  | "gallery"
  | "testimonials"
  | "contact"
  | "pricing"
  | "custom";

export interface Section {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  body?: string;
  items?: Array<{
    title?: string;
    subtitle?: string;
    description?: string;
  }>;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface Page {
  name: string;
  slug: string;
  sections: Section[];
}

export interface Website {
  brand: BrandIdentity;
  tokens: DesignTokens;
  pages: Page[];
}

