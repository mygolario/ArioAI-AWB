import type { Section } from "@/src/lib/types";
import { tokens } from "@/src/lib/tokens";

export function TestimonialsSection({ section }: { section: Section }) {
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
                padding: "2rem",
                borderRadius: tokens.radius,
                border: `1px solid ${tokens.colors.border}`,
                boxShadow: tokens.shadow,
              }}
            >
              {item.description && (
                <p
                  style={{
                    color: tokens.colors.text,
                    fontSize: "1.125rem",
                    fontStyle: "italic",
                    lineHeight: "1.7",
                    marginBottom: "1.5rem",
                    fontFamily: tokens.fonts.body,
                  }}
                >
                  &quot;{item.description}&quot;
                </p>
              )}
              {item.title && (
                <p
                  style={{
                    color: tokens.colors.primary,
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginBottom: "0.25rem",
                    fontFamily: tokens.fonts.heading,
                  }}
                >
                  {item.title}
                </p>
              )}
              {item.subtitle && (
                <p
                  style={{
                    color: tokens.colors.textSecondary,
                    fontSize: "0.875rem",
                    fontFamily: tokens.fonts.body,
                  }}
                >
                  {item.subtitle}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

