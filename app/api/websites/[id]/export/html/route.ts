import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { renderWebsiteToHtml } from "@/lib/render/html";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const website = await prisma.website.findUnique({
    where: {
      id_userId: {
        id: params.id,
        userId: session.user.id,
      },
    },
  });

  if (!website) {
    return new Response("Not found", { status: 404 });
  }

  const html = renderWebsiteToHtml(website.layout as any);
  const filename =
    website.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "website";

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.html"`,
    },
  });
}
