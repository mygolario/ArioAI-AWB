import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "ArioAI",
  description: "AI Website Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
