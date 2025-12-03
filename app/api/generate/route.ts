import { NextResponse } from "next/server";
import { generateWebsiteLayoutFromPrompt } from "@/lib/ai/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const layout = await generateWebsiteLayoutFromPrompt(prompt);

    return NextResponse.json({ layout });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate website" },
      { status: 500 }
    );
  }
}
