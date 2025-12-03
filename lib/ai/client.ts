import { WebsiteLayout } from "@/lib/types/layout";
import { buildLayoutSystemPrompt } from "./prompts";

export async function generateWebsiteLayoutFromPrompt(
  prompt: string
): Promise<WebsiteLayout> {
  const apiKey =
    process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  const isOpenRouter = !!process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing API Key. Please set OPENAI_API_KEY or OPENROUTER_API_KEY."
    );
  }

  const baseUrl = isOpenRouter
    ? "https://openrouter.ai/api/v1"
    : "https://api.openai.com/v1";

  const model = isOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini";

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(isOpenRouter && {
          "HTTP-Referer": "https://arioai.com", // Optional for OpenRouter
          "X-Title": "ArioAI Builder", // Optional for OpenRouter
        }),
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: buildLayoutSystemPrompt() },
          { role: "user", content: prompt },
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
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    const layout = JSON.parse(content) as WebsiteLayout;
    return layout;
  } catch (error) {
    console.error("Error generating website layout:", error);
    throw error;
  }
}
