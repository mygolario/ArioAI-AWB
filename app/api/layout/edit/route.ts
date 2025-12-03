import { NextResponse } from "next/server";
import { editWebsiteLayout } from "@/lib/ai/client";
import { WebsiteLayout } from "@/lib/types/layout";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { layout, instruction } = body as {
      layout?: WebsiteLayout;
      instruction?: string;
    };

    // Validate layout exists
    if (!layout || typeof layout !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid 'layout' in request body" },
        { status: 400 }
      );
    }

    // Validate layout has required structure
    if (!layout.pages || !Array.isArray(layout.pages)) {
      return NextResponse.json(
        { error: "Invalid layout: missing 'pages' array" },
        { status: 400 }
      );
    }

    // Validate instruction is a non-empty string
    if (!instruction || typeof instruction !== "string" || !instruction.trim()) {
      return NextResponse.json(
        { error: "Missing or empty 'instruction' in request body" },
        { status: 400 }
      );
    }

    // Call the AI to edit the layout
    const updatedLayout = await editWebsiteLayout(layout, instruction.trim());

    return NextResponse.json({ layout: updatedLayout }, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/layout/edit:", error);

    // Check if it's an API key error
    if (error.message?.includes("Missing API Key")) {
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    // Check if it's a parsing error
    if (error.message?.includes("JSON")) {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to edit layout" },
      { status: 500 }
    );
  }
}
