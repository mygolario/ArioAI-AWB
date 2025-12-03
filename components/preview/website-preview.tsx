"use client";

import { WebsiteLayout } from "@/lib/types/layout";
import { SectionRenderer } from "./section-renderer";
import { cn } from "@/lib/utils";

interface WebsitePreviewProps {
  layout: WebsiteLayout;
}

export function WebsitePreview({ layout }: WebsitePreviewProps) {
  const isDark = layout.theme === "dark";
  const page = layout.pages[0]; // For now, just show the first page

  if (!page) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        No pages in layout
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-full",
        isDark ? "bg-slate-900" : "bg-white"
      )}
    >
      {/* Simple Header */}
      <header
        className={cn(
          "sticky top-0 z-10 px-6 py-4 border-b",
          isDark
            ? "bg-slate-900/95 backdrop-blur border-slate-800"
            : "bg-white/95 backdrop-blur border-slate-200"
        )}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className={cn(
              "text-xl font-bold",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            {layout.siteName}
          </span>
          <nav className="hidden md:flex items-center gap-6">
            {layout.pages.map((p) => (
              <a
                key={p.id}
                href={`#${p.slug}`}
                className={cn(
                  "text-sm font-medium hover:text-blue-500 transition-colors",
                  isDark ? "text-slate-300" : "text-slate-600"
                )}
              >
                {p.title}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Sections */}
      <main>
        {page.sections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            theme={layout.theme}
          />
        ))}
      </main>

      {/* Simple Footer */}
      <footer
        className={cn(
          "py-8 px-6 border-t text-center",
          isDark
            ? "bg-slate-900 border-slate-800 text-slate-400"
            : "bg-slate-50 border-slate-200 text-slate-600"
        )}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} {layout.siteName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
