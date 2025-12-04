import { NextResponse } from "next/server";
import { generateWebsiteFromDescription } from "@/src/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description } = body;

    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Description is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const website = await generateWebsiteFromDescription(description);

    return NextResponse.json(website, { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    const errorMessage = error?.message || "Failed to generate website";
    const statusCode = errorMessage.includes("API Key") || errorMessage.includes("API Error") ? 500 : 400;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

