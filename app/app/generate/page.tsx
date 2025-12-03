"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { WebsiteLayout } from "@/lib/types/layout";
import { WebsitePreview } from "@/components/builder/WebsitePreview";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultJson, setResultJson] = useState<string | null>(null);
  const [layout, setLayout] = useState<WebsiteLayout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

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
            disabled={!prompt || isLoading}
          >
            {isLoading ? "Generating..." : "Generate Website"}
          </Button>
        </form>
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
          ) : error ? (
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
