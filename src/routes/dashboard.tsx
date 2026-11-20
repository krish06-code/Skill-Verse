import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, BookOpen, GraduationCap, Sparkles, Users } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { StudentCard } from "@/components/StudentCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { matchService } from "@/services/matchService";
import { connectionService } from "@/services/connectionService";
import { connectionStateFor } from "@/lib/connections";
import type { Connection, MatchResult } from "@/lib/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Skill Verse" },
      {
        name: "description",
        content: "See your skills, connections and recommended student skill matches.",
      },
      { property: "og:title", content: "Dashboard — Skill Verse" },
      { property: "og:description", content: "Your Skill Verse overview and recommended matches." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useRequireAuth();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setIsLoading(true);
    setError(null);
    Promise.all([matchService.getMatches(user.id), connectionService.getConnections(user.id)])
      .then(([matchList, connectionList]) => {
        if (!active) return;
        setMatches(matchList);
        setConnections(connectionList);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Could not load your dashboard.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  if (!user) return null;

  const connectionCount = connections.filter((c) => c.status === "ACCEPTED").length;
  const topMatches = matches.slice(0, 4);

  return (
    <AppLayout
      title={`Welcome, ${user.name}`}
      description="Here is a quick overview of your skill exchange activity."
    >
      <section className="relative overflow-hidden rounded-3xl bg-[#20254b] px-6 py-7 text-white shadow-xl shadow-indigo-950/15 sm:px-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-indigo-300">
              <Sparkles className="h-4 w-4" /> Your exchange journey
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
              Share what you know. Find what moves you forward.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Your best next learning connection is waiting in the community.
            </p>
          </div>
          <Button
            asChild
            variant="secondary"
            className="rounded-xl bg-white text-slate-900 hover:bg-slate-100"
          >
            <Link to="/find-students">
              Find a match <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-indigo-400/30 blur-3xl" />
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Skills I can teach"
          value={user.teachSkills.length}
          icon={<GraduationCap className="h-5 w-5" />}
        />
        <StatCard
          label="Skills I want to learn"
          value={user.learnSkills.length}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          label="Connections"
          value={connectionCount}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Skill points"
          value={user.skillPoints}
          icon={<Award className="h-5 w-5" />}
        />
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Recommended for you
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Students whose skills complement yours, ranked by match score.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/find-students">See all students</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <p className="mt-6 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            {error}
          </p>
        ) : topMatches.length === 0 ? (
          <div className="mt-6 rounded-md border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
            No matches yet. Add a few skills you can teach and want to learn to get recommendations.{" "}
            <Link
              to="/profile/edit"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Update your profile
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {topMatches.map((match) => (
              <StudentCard
                key={match.user.id}
                student={match.user}
                matchPercentage={match.matchPercentage}
                match={match}
                connectionState={connectionStateFor(connections, user.id, match.user.id)}
              />
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
