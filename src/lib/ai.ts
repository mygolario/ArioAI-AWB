import type { Website, DesignTokens } from "./types";
import { tokens as defaultTokens } from "./tokens";

function buildSystemPrompt(): string {
  return `You are an expert AI website builder assistant. Your task is to generate complete website data from a business description.

You MUST output ONLY valid JSON, no markdown, no comments, no code blocks. The JSON must strictly follow this structure:

{
  "brand": {
    "name": string,
    "tagline": string,
    "alternatives": string[],
    "logoDirection": string
  },
  "tokens": {
    "colors": {
      "primary": string,
      "secondary": string,
      "background": string,
      "surface": string,
      "border": string,
      "text": string,
      "textSecondary": string,
      "accent1": string,
      "accent2": string
    },
    "fonts": {
      "heading": string,
      "body": string
    },
    "radius": string,
    "shadow": string
  },
  "pages": [
    {
      "name": string,
      "slug": string,
      "sections": [
        {
          "id": string,
          "type": "hero" | "features" | "services" | "gallery" | "testimonials" | "contact" | "pricing" | "custom",
          "title": string (optional),
          "subtitle": string (optional),
          "body": string (optional),
          "items": array of { title, subtitle, description } (optional),
          "ctaLabel": string (optional),
          "ctaHref": string (optional)
        }
      ]
    }
  ]
}

IMPORTANT RULES:
- Default theme MUST be light and warm. Use warm colors (ambers, oranges, warm grays) that work well on light backgrounds.
- If you choose colors, ensure they are compatible with light backgrounds.
- Generate at least 2-3 pages (e.g., home, about, contact).
- Each page should have 2-4 relevant sections.
- Use clear, professional copy suitable for the business type.
- Section IDs should be unique strings (e.g., "hero-1", "features-1").
- Page slugs should be URL-friendly (e.g., "home", "about", "contact").`;
}

function parseWebsiteFromResponse(raw: unknown): Website {
  try {
    // Ensure we have an object
    if (typeof raw !== "object" || raw === null) {
      throw new Error("Response is not an object");
    }

    const data = raw as any;

    // Validate and parse brand
    if (!data.brand || typeof data.brand !== "object") {
      throw new Error("Missing or invalid brand field");
    }

    const brand = {
      name: String(data.brand.name || "Untitled Business"),
      tagline: String(data.brand.tagline || ""),
      alternatives: Array.isArray(data.brand.alternatives)
        ? data.brand.alternatives.map(String)
        : [],
      logoDirection: String(data.brand.logoDirection || "modern"),
    };

    // Validate and parse tokens with fallback to defaults
    let parsedTokens: DesignTokens = { ...defaultTokens };

    if (data.tokens && typeof data.tokens === "object") {
      parsedTokens = {
        colors: {
          primary:
            data.tokens.colors?.primary || defaultTokens.colors.primary,
          secondary:
            data.tokens.colors?.secondary || defaultTokens.colors.secondary,
          background:
            data.tokens.colors?.background || defaultTokens.colors.background,
          surface:
            data.tokens.colors?.surface || defaultTokens.colors.surface,
          border: data.tokens.colors?.border || defaultTokens.colors.border,
          text: data.tokens.colors?.text || defaultTokens.colors.text,
          textSecondary:
            data.tokens.colors?.textSecondary ||
            defaultTokens.colors.textSecondary,
          accent1:
            data.tokens.colors?.accent1 || defaultTokens.colors.accent1,
          accent2:
            data.tokens.colors?.accent2 || defaultTokens.colors.accent2,
        },
        fonts: {
          heading:
            data.tokens.fonts?.heading || defaultTokens.fonts.heading,
          body: data.tokens.fonts?.body || defaultTokens.fonts.body,
        },
        radius: data.tokens.radius || defaultTokens.radius,
        shadow: data.tokens.shadow || defaultTokens.shadow,
      };
    }

    // Validate and parse pages
    if (!Array.isArray(data.pages)) {
      throw new Error("Missing or invalid pages array");
    }

    const pages = data.pages.map((page: any, index: number) => {
      if (!page || typeof page !== "object") {
        throw new Error(`Invalid page at index ${index}`);
      }

      return {
        name: String(page.name || `Page ${index + 1}`),
        slug: String(page.slug || `page-${index + 1}`),
        sections: Array.isArray(page.sections)
          ? page.sections.map((section: any, secIndex: number) => ({
              id: String(section.id || `section-${index}-${secIndex}`),
              type: String(section.type || "custom") as any,
              title: section.title ? String(section.title) : undefined,
              subtitle: section.subtitle ? String(section.subtitle) : undefined,
              body: section.body ? String(section.body) : undefined,
              items: Array.isArray(section.items)
                ? section.items.map((item: any) => ({
                    title: item.title ? String(item.title) : undefined,
                    subtitle: item.subtitle
                      ? String(item.subtitle)
                      : undefined,
                    description: item.description
                      ? String(item.description)
                      : undefined,
                  }))
                : undefined,
              ctaLabel: section.ctaLabel ? String(section.ctaLabel) : undefined,
              ctaHref: section.ctaHref ? String(section.ctaHref) : undefined,
            }))
          : [],
      };
    });

    if (pages.length === 0) {
      throw new Error("Pages array is empty");
    }

    return {
      brand,
      tokens: parsedTokens,
      pages,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse website response: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Helper to strip markdown code blocks from AI response
function stripMarkdownCodeBlocks(content: string): string {
  const stripped = content.trim();
  if (stripped.startsWith("```")) {
    const firstNewline = stripped.indexOf("\n");
    const lastBackticks = stripped.lastIndexOf("```");
    if (firstNewline !== -1 && lastBackticks > firstNewline) {
      return stripped.slice(firstNewline + 1, lastBackticks).trim();
    }
  }
  return stripped;
}

export async function generateWebsiteFromDescription(
  description: string
): Promise<Website> {
  if (!description || description.trim().length === 0) {
    throw new Error("Description cannot be empty");
  }

  // Build the prompt
  const systemPrompt = buildSystemPrompt();

  // Get API configuration - support both new env vars and existing pattern
  const apiKey =
    process.env.LLM_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing API Key. Please set LLM_API_KEY, OPENAI_API_KEY, or OPENROUTER_API_KEY."
    );
  }

  const isOpenRouter =
    !!process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY;

  // Determine API URL
  let apiUrl = process.env.LLM_API_URL;
  if (!apiUrl) {
    // Fallback to existing pattern
    apiUrl = isOpenRouter
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
  } else if (!apiUrl.includes("/chat/completions")) {
    // If LLM_API_URL is set but doesn't include the endpoint, append it
    apiUrl = `${apiUrl.replace(/\/$/, "")}/chat/completions`;
  }

  const model =
    process.env.LLM_MODEL ||
    (isOpenRouter
      ? process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"
      : "gpt-4o-mini");

  // Call the LLM
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(isOpenRouter && {
        "HTTP-Referer": "https://arioai.com",
        "X-Title": "ArioAI Builder",
      }),
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: description },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `AI API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content || data.content || data.message;

  if (!content) {
    throw new Error("No content received from AI response");
  }

  // Strip markdown code blocks if present
  content = stripMarkdownCodeBlocks(content);

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (parseError) {
    throw new Error(
      `Failed to parse AI response as JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`
    );
  }

  // Validate and parse into Website structure
  return parseWebsiteFromResponse(parsed);
}

