import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f8ff] p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(42,33,100,0.12)] lg:grid-cols-[1.05fr_0.95fr] sm:min-h-[calc(100vh-3rem)]">
        <section className="relative hidden overflow-hidden bg-[#191d3b] p-10 text-white lg:flex lg:flex-col">
          <div className="hero-grid absolute inset-0 opacity-60" />
          <div className="relative flex items-center gap-3 text-lg font-bold tracking-tight">
            <span className="brand-mark grid h-10 w-10 place-items-center rounded-xl">
              <Sparkles className="h-4 w-4" />
            </span>
            SkillVerse
          </div>
          <div className="relative my-auto max-w-md">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-300">
              Student skill network
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-[1.06] tracking-tight">
              Make every skill a shared opportunity.
            </h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">
              Find people who complement what you know, learn faster together, and build a portfolio
              of meaningful connections.
            </p>
          </div>
          <div className="relative flex items-center gap-3 text-sm text-slate-300">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 font-semibold text-white">
              01
            </span>
            <span>Teach, learn, and grow—together.</span>
          </div>
          <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        </section>
        <section className="flex min-h-full flex-col px-6 py-7 sm:px-12 sm:py-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 lg:hidden"
          >
            <span className="brand-mark grid h-8 w-8 place-items-center rounded-lg text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>{" "}
            SkillVerse
          </Link>
          <div className="flex flex-1 items-center justify-center py-8">{children}</div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
          >
            Explore SkillVerse <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
