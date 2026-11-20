import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle, Search, Sparkles, Star, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skill Verse — Student Skill Exchange" },
      {
        name: "description",
        content:
          "Skill Verse connects students who can teach what you want to learn, while you share the skills you already know.",
      },
      { property: "og:title", content: "Skill Verse — Student Skill Exchange" },
      {
        property: "og:description",
        content: "Learn. Teach. Connect. A simple skill exchange platform for students.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fafbff] text-slate-900">
      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3 text-lg font-bold tracking-tight">
            <span className="brand-mark grid h-9 w-9 place-items-center rounded-xl text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            SkillVerse
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:pb-28 lg:pt-24">
          <div className="absolute left-1/2 top-0 -z-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-indigo-200/55 blur-3xl" />
          <div className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                For curious students
              </div>
              <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.04] tracking-[-0.05em] text-[#1a1c3d] sm:text-6xl lg:text-7xl">
                Learn with people who <span className="text-primary">get it.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                SkillVerse turns what you already know into your next learning opportunity. Meet
                peers, swap skills, and make progress together.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl px-5 shadow-lg shadow-primary/25"
                >
                  <Link to="/register">
                    Create your profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-slate-200 bg-white px-5"
                >
                  <Link to="/login">I have an account</Link>
                </Button>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-teal-600" />
                  Meaningful matches
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-teal-600" />
                  Built for students
                </span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="rounded-[2rem] border border-white bg-[#20254b] p-5 shadow-2xl shadow-indigo-950/25 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">
                      Your next match
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-white">Built around you</h2>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-cyan-300">
                    <Sparkles className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-7 rounded-2xl bg-white p-5 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-orange-300 to-rose-400 font-bold text-white">
                      A
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Aarav Mehta</p>
                      <p className="text-sm text-slate-500">Computer Science · 3rd year</p>
                    </div>
                    <span className="ml-auto rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">
                      94% fit
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-indigo-50 p-3">
                      <p className="font-bold uppercase tracking-wider text-indigo-500">
                        Teaches you
                      </p>
                      <p className="mt-1 font-semibold text-slate-700">React & UI design</p>
                    </div>
                    <div className="rounded-xl bg-teal-50 p-3">
                      <p className="font-bold uppercase tracking-wider text-teal-600">
                        Learns from you
                      </p>
                      <p className="mt-1 font-semibold text-slate-700">Java & APIs</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-4 text-white">
                    <UsersRound className="h-5 w-5 text-indigo-300" />
                    <p className="mt-4 text-2xl font-bold">Peers</p>
                    <p className="text-xs text-slate-300">who share your pace</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 text-white">
                    <Search className="h-5 w-5 text-cyan-300" />
                    <p className="mt-4 text-2xl font-bold">Skills</p>
                    <p className="text-xs text-slate-300">worth sharing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200/70 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-3 sm:px-8">
            {[
              [
                "Teach with purpose",
                "Turn your strongest subjects and practical skills into real peer impact.",
                Sparkles,
              ],
              [
                "Learn with context",
                "Meet students whose knowledge fits the exact next step in your journey.",
                Search,
              ],
              [
                "Build your circle",
                "Keep every helpful conversation, session, and collaboration in one place.",
                UsersRound,
              ],
            ].map(([title, detail, Icon]) => {
              const FeatureIcon = Icon as typeof Sparkles;
              return (
                <div key={title as string} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-primary">
                    <FeatureIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900">{title as string}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{detail as string}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1a1c3d] sm:text-4xl">
              A better way to learn beyond the classroom.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Your profile does the introductions. You decide where curiosity takes the
              conversation.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Shape your profile",
                "Add what you can confidently teach and the skills you want to develop.",
              ],
              [
                "02",
                "Discover your fit",
                "Explore complementary peers, smart match scores, and shared learning goals.",
              ],
              [
                "03",
                "Start exchanging",
                "Connect, message, plan a session, and celebrate progress together.",
              ],
            ].map(([number, title, detail]) => (
              <article
                key={number}
                className="surface-card rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7"
              >
                <span className="text-sm font-bold tracking-[0.18em] text-indigo-400">
                  {number}
                </span>
                <h3 className="mt-8 text-xl font-bold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#eff0ff]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
            <div className="rounded-[2rem] bg-[#20254b] p-7 text-white shadow-2xl shadow-indigo-950/20 sm:p-9">
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-200">
                <MessageCircle className="h-4 w-4" /> A conversation that moves things forward
              </div>
              <div className="mt-8 space-y-4">
                <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-white/10 p-4 text-sm text-slate-100">
                  I can help you plan that React dashboard. Want to swap notes after class?
                </div>
                <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-indigo-400 p-4 text-sm font-medium text-white">
                  Perfect. I can walk you through API design and testing.
                </div>
                <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-white/10 p-4 text-sm text-slate-100">
                  That sounds like a very fair exchange. Let’s do it.
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                More than a directory
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1a1c3d] sm:text-4xl">
                The best learning often starts with a simple message.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                SkillVerse gives student collaborations a home—from first match to a skill session
                that actually happens.
              </p>
              <div className="mt-7 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#eff0ff] bg-orange-300 text-xs font-bold text-white">
                    N
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#eff0ff] bg-teal-500 text-xs font-bold text-white">
                    R
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#eff0ff] bg-indigo-500 text-xs font-bold text-white">
                    S
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600">
                  <Star className="mr-1 inline h-4 w-4 fill-amber-400 text-amber-400" />
                  Built around valuable exchanges
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="rounded-[2rem] bg-gradient-to-br from-primary to-[#267ea1] px-6 py-12 text-center text-white shadow-xl shadow-primary/20 sm:px-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-100">
              Your next skill exchange is nearby
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Bring what you know. Leave with more.
            </h2>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="mt-8 h-12 rounded-xl bg-white px-6 text-primary hover:bg-indigo-50"
            >
              <Link to="/register">
                Join SkillVerse <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 text-sm text-slate-500 sm:px-8">
          <span>© {new Date().getFullYear()} SkillVerse</span>
          <span>Learn. Teach. Connect.</span>
        </div>
      </footer>
    </div>
  );
}
