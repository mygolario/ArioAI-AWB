"use client";

import { useState } from "react";
import type { Website } from "@/src/lib/types";
import { tokens } from "@/src/lib/tokens";

export default function BuilderPage() {
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("Please enter a business description");
      return;
    }

    setLoading(true);
    setError(null);
    setWebsite(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setWebsite(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate website");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: tokens.colors.background,
        color: tokens.colors.text,
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            color: tokens.colors.text,
          }}
        >
          AI Website Builder
        </h1>

        <div
          style={{
            backgroundColor: tokens.colors.surface,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: tokens.radius,
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: tokens.shadow,
          }}
        >
          <label
            htmlFor="description"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "500",
              color: tokens.colors.text,
            }}
          >
            Business Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your business, products, services, and what kind of website you need..."
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "150px",
              padding: "0.75rem",
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radius,
              backgroundColor: tokens.colors.background,
              color: tokens.colors.text,
              fontSize: "1rem",
              fontFamily: tokens.fonts.body,
              resize: "vertical",
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.background,
              border: "none",
              borderRadius: tokens.radius,
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading || !description.trim() ? "not-allowed" : "pointer",
              opacity: loading || !description.trim() ? 0.6 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Generating..." : "Generate Website"}
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: tokens.radius,
              padding: "1rem",
              marginBottom: "2rem",
              color: "#991b1b",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {website && (
          <div
            style={{
              backgroundColor: tokens.colors.surface,
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radius,
              padding: "1.5rem",
              boxShadow: tokens.shadow,
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: tokens.colors.text,
              }}
            >
              Generated Website Summary
            </h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: tokens.colors.primary,
                }}
              >
                Brand: {website.brand.name}
              </h3>
              <p
                style={{
                  color: tokens.colors.textSecondary,
                  marginBottom: "0.5rem",
                }}
              >
                {website.brand.tagline}
              </p>
              {website.brand.alternatives.length > 0 && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: tokens.colors.textSecondary,
                  }}
                >
                  Alternatives: {website.brand.alternatives.join(", ")}
                </p>
              )}
            </div>

            <div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  color: tokens.colors.primary,
                }}
              >
                Pages ({website.pages.length})
              </h3>
              {website.pages.map((page) => (
                <div
                  key={page.slug}
                  style={{
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    backgroundColor: tokens.colors.background,
                    borderRadius: tokens.radius,
                    border: `1px solid ${tokens.colors.border}`,
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      color: tokens.colors.text,
                    }}
                  >
                    {page.name} ({page.slug})
                  </h4>
                  <div>
                    <strong style={{ color: tokens.colors.textSecondary }}>
                      Sections ({page.sections.length}):
                    </strong>
                    <ul
                      style={{
                        marginTop: "0.5rem",
                        paddingLeft: "1.5rem",
                        color: tokens.colors.textSecondary,
                      }}
                    >
                      {page.sections.map((section) => (
                        <li key={section.id}>
                          <strong>{section.type}</strong>
                          {section.title && ` - ${section.title}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

