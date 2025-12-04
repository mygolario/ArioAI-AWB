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
    
    // Default to 500 (server error) since errors from generateWebsiteFromDescription
    // are server-side processing issues (API calls, parsing, validation, etc.)
    // Only client validation errors return 400, and those are handled above
    const statusCode = 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

