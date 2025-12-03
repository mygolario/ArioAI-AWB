"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultJson, setResultJson] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsLoading(true);
    setError(null);
    setResultJson(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setResultJson(JSON.stringify(data.layout, null, 2));
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to generate website");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "An unexpected error occurred");
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
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="font-medium text-white">
            {resultJson ? "Generated Layout (JSON)" : "Preview"}
          </h3>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p>Generating layout...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
              <p className="font-semibold mb-1">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : resultJson ? (
            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
              {resultJson}
            </pre>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 border-dashed border-2 border-slate-800 rounded-lg m-4">
              <div className="text-center space-y-2">
                <span className="text-2xl block">🤖</span>
                <p>Enter a prompt to generate a website layout.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
