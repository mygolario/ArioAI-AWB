import { WebsiteLayout } from "@/lib/types/layout";
import { buildLayoutSystemPrompt } from "./prompts";
import {
  buildEditLayoutSystemPrompt,
  buildEditLayoutUserPrompt,
} from "./editPrompts";

// Shared configuration for AI API calls
function getAIConfig() {
  const apiKey =
    process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  const isOpenRouter =
    !!process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing API Key. Please set OPENAI_API_KEY or OPENROUTER_API_KEY."
    );
  }

  const baseUrl = isOpenRouter
    ? "https://openrouter.ai/api/v1"
    : "https://api.openai.com/v1";

  const model = isOpenRouter
    ? process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"
    : "gpt-4o-mini";

  return { apiKey, isOpenRouter, baseUrl, model };
}

// Helper to strip markdown code blocks from AI response
function stripMarkdownCodeBlocks(content: string): string {
  // Remove ```json ... ``` or ``` ... ``` wrappers
  const stripped = content.trim();
  if (stripped.startsWith("```")) {
    // Find the end of the first line (e.g., ```json)
    const firstNewline = stripped.indexOf("\n");
    const lastBackticks = stripped.lastIndexOf("```");
    if (firstNewline !== -1 && lastBackticks > firstNewline) {
      return stripped.slice(firstNewline + 1, lastBackticks).trim();
    }
  }
  return stripped;
}

// Shared function to call the AI API
async function callAI(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const { apiKey, isOpenRouter, baseUrl, model } = getAIConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
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
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `AI API Error: ${response.status} ${response.statusText} - ${JSON.stringify(
        errorData
      )}`
    );
  }

  const data = await response.json();
  let content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content received from AI");
  }

  // Strip markdown code blocks if present (some models wrap JSON in ```json ... ```)
  content = stripMarkdownCodeBlocks(content);

  return content;
}

export async function generateWebsiteLayoutFromPrompt(
  prompt: string
): Promise<WebsiteLayout> {
  try {
    const content = await callAI(buildLayoutSystemPrompt(), prompt);
    const layout = JSON.parse(content) as WebsiteLayout;
    return layout;
  } catch (error) {
    console.error("Error generating website layout:", error);
    throw error;
  }
}

export async function editWebsiteLayout(
  layout: WebsiteLayout,
  instruction: string
): Promise<WebsiteLayout> {
  try {
    const systemPrompt = buildEditLayoutSystemPrompt();
    const userPrompt = buildEditLayoutUserPrompt(layout, instruction);

    const content = await callAI(systemPrompt, userPrompt);
    const updatedLayout = JSON.parse(content) as WebsiteLayout;

    // Light validation
    if (!updatedLayout.pages || !Array.isArray(updatedLayout.pages)) {
      throw new Error("Invalid layout: missing pages array");
    }

    if (updatedLayout.pages.length === 0) {
      throw new Error("Invalid layout: pages array is empty");
    }

    return updatedLayout;
  } catch (error) {
    console.error("Error editing website layout:", error);
    throw error;
  }
}
