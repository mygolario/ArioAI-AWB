import type { Section } from "@/src/lib/types";
import { tokens } from "@/src/lib/tokens";

export function GallerySection({ section }: { section: Section }) {
  return (
    <section
      style={{
        background: tokens.colors.background,
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
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {section.items.map((item, index) => (
            <div
              key={index}
              style={{
                background: tokens.colors.surface,
                padding: "1.5rem",
                borderRadius: tokens.radius,
                border: `1px solid ${tokens.colors.border}`,
                boxShadow: tokens.shadow,
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.title && (
                <h3
                  style={{
                    color: tokens.colors.text,
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    fontFamily: tokens.fonts.heading,
                    textAlign: "center",
                  }}
                >
                  {item.title}
                </h3>
              )}
              {item.subtitle && (
                <p
                  style={{
                    color: tokens.colors.primary,
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                    fontFamily: tokens.fonts.body,
                    textAlign: "center",
                  }}
                >
                  {item.subtitle}
                </p>
              )}
              {item.description && (
                <p
                  style={{
                    color: tokens.colors.textSecondary,
                    fontSize: "0.875rem",
                    fontFamily: tokens.fonts.body,
                    textAlign: "center",
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

