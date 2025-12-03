import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">
          Welcome to ArioAI Builder
        </h1>
        <p className="text-lg text-slate-400">
          Create your next website project with AI assistance.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">Generate Website</h3>
          <p className="text-slate-400">
            Describe your dream website and watch it come to life.
          </p>
          <Link href="/app/generate">
            <Button className="w-full">Start Generating</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
