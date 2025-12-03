import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950 text-white">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          ArioAI
        </h1>
        <h2 className="text-3xl font-semibold text-slate-200">
          AI Website Builder
        </h2>
        <p className="text-xl text-slate-400">
          Generate beautiful, production-ready websites in seconds using the power
          of AI.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/app">
            <Button size="lg" className="text-lg px-8">
              Open Builder
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
