"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { WebsiteLayout, SavedWebsite } from "@/lib/types/layout";
import { WebsitePreview } from "@/components/builder/WebsitePreview";
import {
  loadSavedWebsites,
  saveSavedWebsites,
  CURRENT_LAYOUT_SESSION_KEY,
} from "@/lib/utils/storage";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultJson, setResultJson] = useState<string | null>(null);
  const [layout, setLayout] = useState<WebsiteLayout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [editInstruction, setEditInstruction] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error' | 'loading'>('idle');

  // Load layout from sessionStorage if coming from Websites page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.sessionStorage.getItem(CURRENT_LAYOUT_SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as WebsiteLayout;
        setLayout(parsed);
        setResultJson(JSON.stringify(parsed, null, 2));
      } catch {
        // ignore
      } finally {
        window.sessionStorage.removeItem(CURRENT_LAYOUT_SESSION_KEY);
      }
    }
  }, []);

  const handleSaveLayout = () => {
    if (!layout) return;

    const name = window.prompt('Name for this website:', layout?.siteName ?? 'Untitled website');
    if (!name) return;

    setSaveStatus('loading');

    try {
      const existing = loadSavedWebsites();
      const newWebsite: SavedWebsite = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        layout,
      };
      saveSavedWebsites([...existing, newWebsite]);
      setSaveStatus('saved');

      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsLoading(true);
    setError(null);
    setResultJson(null);
    setLayout(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setLayout(data.layout);
        setResultJson(JSON.stringify(data.layout, null, 2));
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to generate website");
        setLayout(null);
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "An unexpected error occurred");
      setLayout(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLayout = async () => {
    if (!layout || !editInstruction.trim()) return;
    setIsEditing(true);
    setError(null);

    try {
      const res = await fetch("/api/layout/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout, instruction: editInstruction }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to edit layout");
        setIsEditing(false);
        return;
      }

      const data = await res.json();
      setLayout(data.layout);
      setResultJson(JSON.stringify(data.layout, null, 2));
      setEditInstruction("");
    } catch (err: any) {
      console.error("Edit error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Left Panel - Input */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Generate Website</h1>
          <p className="text-slate-400">
            Describe the website you want to build.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
          <textarea
            className="w-full h-64 p-4 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            placeholder="e.g. A landing page for a coffee shop with a dark theme..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!prompt || isLoading || isEditing}
          >
            {isLoading ? "Generating..." : "Generate Website"}
          </Button>
        </form>

        {/* Save Website Button */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveLayout}
              disabled={!layout || isLoading || isEditing || saveStatus === 'loading'}
              className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors"
            >
              {saveStatus === 'loading' ? 'Saving...' : 'Save Website'}
            </button>
            {saveStatus === 'saved' && (
              <span className="text-xs text-emerald-400">✓ Saved!</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-xs text-red-400">Failed to save</span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            View all saved websites in the{" "}
            <a href="/app/websites" className="text-blue-400 hover:underline">
              Websites
            </a>{" "}
            tab.
          </p>
        </div>

        {/* Refine Layout Section */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-2">Refine Layout</h3>
          <p className="text-sm text-slate-400 mb-3">
            Describe changes to apply to the current layout.
          </p>
          <div className="text-xs text-slate-500 mb-4 space-y-1">
            <p>💡 Try instructions like:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>&quot;Make the hero headline more bold and ambitious.&quot;</li>
              <li>&quot;Add a pricing section with 3 plans: Starter, Pro, Enterprise.&quot;</li>
              <li>&quot;Add an FAQ section about pricing and support.&quot;</li>
            </ul>
          </div>
          <textarea
            className="w-full h-24 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="e.g. Change the hero headline to 'Welcome to ArioAI'..."
            value={editInstruction}
            onChange={(e) => setEditInstruction(e.target.value)}
            disabled={!layout || isLoading || isEditing}
          />
          <Button
            type="button"
            className="w-full mt-3"
            size="default"
            disabled={!layout || !editInstruction.trim() || isLoading || isEditing}
            onClick={handleEditLayout}
          >
            {isEditing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Applying...
              </span>
            ) : (
              "Apply Changes"
            )}
          </Button>
          {error && !isLoading && !isEditing && (
            <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Preview/JSON */}
      <div className="flex-1 rounded-xl bg-slate-900 border border-slate-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <h3 className="font-medium text-white">Preview</h3>
          {resultJson && (
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-3 py-1 text-sm font-medium rounded-md bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {showJson ? "Hide JSON" : "Show JSON"}
            </button>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-lg">Generating your website...</p>
                <p className="text-sm text-slate-500">This may take a few seconds</p>
              </div>
            </div>
          ) : isEditing ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-lg">Applying changes...</p>
                <p className="text-sm text-slate-500">Updating your layout</p>
              </div>
            </div>
          ) : error && !layout ? (
            <div className="p-4">
              <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                <p className="font-semibold mb-1">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Website Preview */}
              <div className={`${showJson ? "flex-1" : "h-full"} overflow-auto`}>
                <WebsitePreview layout={layout} />
              </div>
              
              {/* JSON Panel */}
              {resultJson && showJson && (
                <div className="border-t border-slate-800 bg-slate-950">
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Raw JSON Output
                    </span>
                  </div>
                  <div className="p-3 overflow-auto max-h-80">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                      {resultJson}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
