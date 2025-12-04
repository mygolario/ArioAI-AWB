import { renderPage } from "@/src/lib/renderer";
import type { Website } from "@/src/lib/types";
import { tokens } from "@/src/lib/tokens";

// Extend globalThis to include our temporary website storage
declare global {
  var __TEMP_WEBSITE__: Website | undefined;
}

interface PreviewPageProps {
  params: {
    slug: string;
  };
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const slug = params.slug;

  // TEMPORARY TEST DATA (Replace later with DB fetch)
  const website: Website | undefined = 
    typeof window !== "undefined" 
      ? (window as any).__TEMP_WEBSITE__ 
      : undefined;

  if (!website) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: tokens.colors.background,
          padding: "2rem",
          textAlign: "center",
          color: tokens.colors.text,
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          No Website Data Found
        </h1>
        <p style={{ color: tokens.colors.textSecondary }}>
          Please generate a website from the builder page first.
        </p>
      </div>
    );
  }

  const renderedPage = renderPage(website, slug);

  if (!renderedPage) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: tokens.colors.background,
          padding: "2rem",
          textAlign: "center",
          color: tokens.colors.text,
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Page Not Found
        </h1>
        <p style={{ color: tokens.colors.textSecondary }}>
          The page &quot;{slug}&quot; does not exist in this website.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: tokens.colors.background,
        color: tokens.colors.text,
      }}
    >
      {renderedPage}
    </div>
  );
}

