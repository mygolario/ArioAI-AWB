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
  const [isToggling, setIsToggling] = useState<string | null>(null);

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

  const handleTogglePublish = async (site: SavedWebsite) => {
    setIsToggling(site.id);
    try {
      const res = await fetch(`/api/websites/${site.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !site.isPublic }),
      });

      if (!res.ok) {
        console.error("Failed to update publish status");
        alert("Failed to update publish status. Please try again.");
        return;
      }

      const data = await res.json();
      const updated = data.website as SavedWebsite;
      setWebsites((prev) =>
        prev.map((w) =>
          w.id === site.id
            ? {
                ...w,
                isPublic: updated.isPublic,
                publishedAt: updated.publishedAt ?? null,
              }
            : w
        )
      );
    } catch (error) {
      console.error("Error toggling publish:", error);
      alert("Failed to update publish status. Please try again.");
    } finally {
      setIsToggling(null);
    }
  };

  const handleOpenPublic = (site: SavedWebsite) => {
    if (!site.isPublic) return;
    window.open(`/public/${site.id}`, "_blank");
  };

  const handleCopyPublicUrl = async (site: SavedWebsite) => {
    if (!site.isPublic) return;
    const url = `${window.location.origin}/public/${site.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      alert("Failed to copy URL.");
    }
  };

  const handleDownload = (site: SavedWebsite, type: "json" | "html") => {
    window.open(`/api/websites/${site.id}/export/${type}`, "_blank");
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
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white truncate">
                  {website.name}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Created: {new Date(website.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  website.isPublic
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-slate-700/40 text-slate-200 border border-slate-700"
                }`}
              >
                {website.isPublic ? "Public" : "Private"}
              </span>
            </div>
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
          <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleOpenInBuilder(website)}
                disabled={isDeleting === website.id || isToggling === website.id}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                Open in Builder
              </button>
              <button
                onClick={() => handleTogglePublish(website)}
                disabled={isDeleting === website.id || isToggling === website.id}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  website.isPublic
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {isToggling === website.id
                  ? "Updating..."
                  : website.isPublic
                  ? "Unpublish"
                  : "Publish"}
              </button>
              {website.isPublic && (
                <>
                  <button
                    onClick={() => handleOpenPublic(website)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium transition-colors"
                  >
                    Open Public
                  </button>
                  <button
                    onClick={() => handleCopyPublicUrl(website)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium transition-colors"
                  >
                    Copy Public URL
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleDownload(website, "json")}
                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-200 text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Download JSON
              </button>
              <button
                onClick={() => handleDownload(website, "html")}
                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-200 text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Download HTML
              </button>
              <button
                onClick={() => handleDelete(website.id)}
                disabled={isDeleting === website.id || isToggling === website.id}
                className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-400 hover:text-red-300 text-sm font-medium transition-colors border border-red-600/30"
              >
                {isDeleting === website.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
