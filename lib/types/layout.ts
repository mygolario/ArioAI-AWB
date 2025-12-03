export type SectionType = 'hero' | 'features' | 'pricing' | 'cta' | 'faq';

export interface WebsiteLayout {
  siteName: string;
  theme: 'dark' | 'light';
  pages: PageLayout[];
}

export interface PageLayout {
  id: string;
  slug: string;
  title: string;
  sections: Section[];
}

export type Section =
  | HeroSection
  | FeaturesSection
  | PricingSection
  | CtaSection
  | FaqSection;

export interface BaseSection {
  id: string;
  type: SectionType;
}

export interface HeroSection extends BaseSection {
  type: 'hero';
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  primaryCta?: ButtonConfig;
  secondaryCta?: ButtonConfig;
}

export interface FeaturesSection extends BaseSection {
  type: 'features';
  title: string;
  subtitle?: string;
  items: FeatureItem[];
}

export interface PricingSection extends BaseSection {
  type: 'pricing';
  title: string;
  subtitle?: string;
  plans: PricingPlan[];
}

export interface CtaSection extends BaseSection {
  type: 'cta';
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta: ButtonConfig;
}

export interface FaqSection extends BaseSection {
  type: 'faq';
  title: string;
  items: FaqItem[];
}

export interface ButtonConfig {
  label: string;
  href: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  highlight?: boolean;
  features: string[];
  ctaLabel?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SavedWebsite {
  id: string;
  name: string;
  createdAt: string; // ISO string
  layout: WebsiteLayout;
}
