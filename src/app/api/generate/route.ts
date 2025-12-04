import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json(
        { message: "Description is required" },
        { status: 400 }
      );
    }

    // Placeholder response
    return NextResponse.json({
      status: "ok",
      message: "AI generator placeholder",
      data: {
        description,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
