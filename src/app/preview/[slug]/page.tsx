import type { Website, Page, Section } from "@/src/lib/types";

interface PreviewPageProps {
  params: {
    slug: string;
  };
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = params;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Preview for {slug}</h1>
      <p>Coming soon...</p>
      <p style={{ color: "#666", marginTop: "1rem" }}>
        This page will display the rendered website content for the &quot;{slug}&quot; page.
      </p>
    </div>
  );
}

