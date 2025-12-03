import AppShell from "@/components/layout/app-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ArioAI Dashboard",
  description: "AI Website Builder Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
