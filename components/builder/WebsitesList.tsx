"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SavedWebsite } from "@/lib/types/layout";
import { WebsitePreview } from "@/components/builder/WebsitePreview";
import { CURRENT_LAYOUT_SESSION_KEY } from "@/lib/utils/storage";

interface WebsitesListProps {
  initialWebsites: SavedWebsite[];
}

export function WebsitesList({ initialWebsites }: WebsitesListProps) {
  const router = useRouter();
  const [websites, setWebsites] = useState<SavedWebsite[]>(initialWebsites);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleOpenInBuilder = (site: SavedWebsite) => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      CURRENT_LAYOUT_SESSION_KEY,
      JSON.stringify(site.layout)
    );
    router.push("/app/generate");
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this website?"
    );
    if (!confirmed) return;

    setIsDeleting(id);

    try {
      const res = await fetch(`/api/websites/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete website");
        alert("Failed to delete website. Please try again.");
        setIsDeleting(null);
        return;
      }

      // Remove from local state
      setWebsites((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      console.error("Error deleting website:", error);
      alert("Failed to delete website. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Empty state
  if (websites.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🌐</div>
          <h2 className="text-xl font-semibold text-white">
            No saved websites yet
          </h2>
          <p className="text-slate-400 max-w-md">
            Generate a website layout and click &quot;Save Website&quot; to see
            it here.
          </p>
          <button
            onClick={() => router.push("/app/generate")}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Generate a Website
          </button>
        </div>
      </div>
    );
  }

  // Grid of website cards
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {websites.map((website) => (
        <div
          key={website.id}
          className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col"
        >
          {/* Card Header */}
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white truncate">
              {website.name}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Created: {new Date(website.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Preview */}
          <div className="flex-1 p-4 bg-slate-950 overflow-hidden">
            <div className="h-48 overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
              <div className="transform scale-[0.25] origin-top-left w-[400%] h-[400%]">
                <WebsitePreview layout={website.layout} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-slate-800 flex gap-3">
            <button
              onClick={() => handleOpenInBuilder(website)}
              disabled={isDeleting === website.id}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              Open in Builder
            </button>
            <button
              onClick={() => handleDelete(website.id)}
              disabled={isDeleting === website.id}
              className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-400 hover:text-red-300 text-sm font-medium transition-colors border border-red-600/30"
            >
              {isDeleting === website.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
