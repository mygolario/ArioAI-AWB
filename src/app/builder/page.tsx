"use client";

import { useState } from "react";
import { tokens } from "@/lib/tokens";

export default function BuilderPage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error generating:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: tokens.colors.background,
        color: tokens.colors.text,
        fontFamily: tokens.fonts.body,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontFamily: tokens.fonts.heading,
          fontSize: "2rem",
          marginBottom: "1rem",
        }}
      >
        Website Builder
      </h1>
      <div
        style={{
          backgroundColor: tokens.colors.surface,
          padding: "2rem",
          borderRadius: tokens.radius,
          boxShadow: tokens.shadow,
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your website..."
          style={{
            width: "100%",
            height: "150px",
            padding: "1rem",
            borderRadius: tokens.radius,
            border: `1px solid ${tokens.colors.border}`,
            marginBottom: "1rem",
            fontFamily: tokens.fonts.body,
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            backgroundColor: tokens.colors.primary,
            color: "#fff",
            padding: "0.75rem 1.5rem",
            borderRadius: tokens.radius,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {loading ? "Generating..." : "Generate Website"}
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius,
            boxShadow: tokens.shadow,
            maxWidth: "800px",
            margin: "2rem auto",
            overflow: "auto",
          }}
        >
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
