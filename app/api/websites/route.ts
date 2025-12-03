import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { WebsiteLayout } from "@/lib/types/layout";

// GET /api/websites - List all websites
export async function GET() {
  try {
    const websites = await prisma.website.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ websites });
  } catch (error: any) {
    console.error("Error fetching websites:", error);
    return NextResponse.json(
      { error: "Failed to fetch websites" },
      { status: 500 }
    );
  }
}

// POST /api/websites - Create a new website
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, layout } = body as {
      name?: string;
      layout?: WebsiteLayout;
    };

    // Validate name
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate layout
    if (!layout || typeof layout !== "object") {
      return NextResponse.json(
        { error: "Layout is required and must be an object" },
        { status: 400 }
      );
    }

    // Create website in database
    const website = await prisma.website.create({
      data: {
        name: name.trim(),
        layout: layout as any, // Prisma Json type
      },
    });

    return NextResponse.json({ website }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating website:", error);
    return NextResponse.json(
      { error: "Failed to create website" },
      { status: 500 }
    );
  }
}
