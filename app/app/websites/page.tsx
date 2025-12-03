import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { SavedWebsite, WebsiteLayout } from "@/lib/types/layout";
import { WebsitesList } from "@/components/builder/WebsitesList";
import { authOptions } from "@/lib/auth";

export default async function WebsitesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        Please sign in to view your websites.
      </div>
    );
  }

  // Fetch websites from database
  const websites = await prisma.website.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Map to SavedWebsite format
  const items: SavedWebsite[] = websites.map((w: { id: string; name: string; createdAt: Date; layout: unknown }) => ({
    id: w.id,
    name: w.name,
    createdAt: w.createdAt.toISOString(),
    layout: w.layout as unknown as WebsiteLayout,
    isPublic: w.isPublic,
    publishedAt: w.publishedAt ? w.publishedAt.toISOString() : null,
  }));

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Saved Websites</h1>
        <p className="text-slate-400">
          View and manage your saved website layouts.
        </p>
      </div>

      {/* Client component with interactivity */}
      <WebsitesList initialWebsites={items} />
    </div>
  );
}
