import type { Section } from "@/src/lib/types";
import { tokens } from "@/src/lib/tokens";

export function HeroSection({ section }: { section: Section }) {
  return (
    <section
      style={{
        background: tokens.colors.surface,
        padding: "80px 20px",
        borderRadius: tokens.radius,
        textAlign: "center",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {section.title && (
        <h1
          style={{
            color: tokens.colors.text,
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            fontFamily: tokens.fonts.heading,
          }}
        >
          {section.title}
        </h1>
      )}
      {section.subtitle && (
        <p
          style={{
            color: tokens.colors.textSecondary,
            fontSize: "1.25rem",
            marginBottom: "2rem",
            fontFamily: tokens.fonts.body,
          }}
        >
          {section.subtitle}
        </p>
      )}
      {section.body && (
        <p
          style={{
            color: tokens.colors.textSecondary,
            fontSize: "1rem",
            marginBottom: "2rem",
            fontFamily: tokens.fonts.body,
            maxWidth: "600px",
            margin: "0 auto 2rem",
          }}
        >
          {section.body}
        </p>
      )}
      {section.ctaLabel && (
        <a
          href={section.ctaHref ?? "#"}
          style={{
            display: "inline-block",
            background: tokens.colors.primary,
            padding: "12px 24px",
            borderRadius: tokens.radius,
            color: tokens.colors.background,
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "1rem",
            boxShadow: tokens.shadow,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          {section.ctaLabel}
        </a>
      )}
    </section>
  );
}

