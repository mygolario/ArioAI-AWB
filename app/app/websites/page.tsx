import { prisma } from "@/lib/db";
import { SavedWebsite, WebsiteLayout } from "@/lib/types/layout";
import { WebsitesList } from "@/components/builder/WebsitesList";

export default async function WebsitesPage() {
  // Fetch websites from database
  const websites = await prisma.website.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Map to SavedWebsite format
  const items: SavedWebsite[] = websites.map((w) => ({
    id: w.id,
    name: w.name,
    createdAt: w.createdAt.toISOString(),
    layout: w.layout as WebsiteLayout,
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
