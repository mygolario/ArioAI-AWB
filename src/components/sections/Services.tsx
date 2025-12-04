import type { Section } from "@/src/lib/types";
import { tokens } from "@/src/lib/tokens";

export function ServicesSection({ section }: { section: Section }) {
  return (
    <section
      style={{
        background: tokens.colors.surface,
        padding: "60px 20px",
        borderRadius: tokens.radius,
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {section.title && (
        <h2
          style={{
            color: tokens.colors.text,
            fontSize: "2.5rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "1rem",
            fontFamily: tokens.fonts.heading,
          }}
        >
          {section.title}
        </h2>
      )}
      {section.subtitle && (
        <p
          style={{
            color: tokens.colors.textSecondary,
            fontSize: "1.125rem",
            textAlign: "center",
            marginBottom: "3rem",
            fontFamily: tokens.fonts.body,
          }}
        >
          {section.subtitle}
        </p>
      )}
      {section.items && section.items.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {section.items.map((item, index) => (
            <div
              key={index}
              style={{
                background: tokens.colors.background,
                padding: "2.5rem",
                borderRadius: tokens.radius,
                border: `2px solid ${tokens.colors.border}`,
                boxShadow: tokens.shadow,
              }}
            >
              {item.title && (
                <h3
                  style={{
                    color: tokens.colors.primary,
                    fontSize: "1.75rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    fontFamily: tokens.fonts.heading,
                  }}
                >
                  {item.title}
                </h3>
              )}
              {item.subtitle && (
                <p
                  style={{
                    color: tokens.colors.textSecondary,
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "1rem",
                    fontFamily: tokens.fonts.body,
                  }}
                >
                  {item.subtitle}
                </p>
              )}
              {item.description && (
                <p
                  style={{
                    color: tokens.colors.text,
                    fontSize: "1rem",
                    lineHeight: "1.7",
                    fontFamily: tokens.fonts.body,
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {section.ctaLabel && (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
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
            }}
          >
            {section.ctaLabel}
          </a>
        </div>
      )}
    </section>
  );
}

