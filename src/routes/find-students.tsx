import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StudentCard } from "@/components/StudentCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { matchService } from "@/services/matchService";
import { skillService } from "@/services/skillService";
import { connectionService } from "@/services/connectionService";
import { connectionStateFor } from "@/lib/connections";
import type { Connection, MatchResult, Skill } from "@/lib/types";

export const Route = createFileRoute("/find-students")({
  head: () => ({
    meta: [
      { title: "Find Students — Skill Verse" },
      {
        name: "description",
        content: "Search students by name, college or skill and see your match score.",
      },
      { property: "og:title", content: "Find Students — Skill Verse" },
      {
        property: "og:description",
        content: "Discover students to learn from and teach on Skill Verse.",
      },
    ],
  }),
  component: FindStudentsPage,
});

type SortKey = "match" | "name" | "points" | "rating";

function FindStudentsPage() {
  const { user } = useRequireAuth();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setIsLoading(true);
    setError(null);
    Promise.all([
      matchService.getMatches(user.id),
      skillService.getSkills(),
      connectionService.getConnections(user.id),
    ])
      .then(([matchList, skillList, connectionList]) => {
        if (!active) return;
        setMatches(matchList);
        setSkills(skillList);
        setConnections(connectionList);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Could not load students.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = matches.filter(({ user: s }) => {
      const matchesTerm =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.college.toLowerCase().includes(term) ||
        s.branch.toLowerCase().includes(term) ||
        [...s.teachSkills, ...s.learnSkills].some((sk) => sk.toLowerCase().includes(term));
      const matchesSkill =
        skillFilter === "all" ||
        s.teachSkills.some((sk) => sk.toLowerCase() === skillFilter.toLowerCase());
      return matchesTerm && matchesSkill;
    });

    return [...list].sort((a, b) => {
      if (sortKey === "name") return a.user.name.localeCompare(b.user.name);
      if (sortKey === "points") return b.user.skillPoints - a.user.skillPoints;
      if (sortKey === "rating") return (b.user.rating ?? 0) - (a.user.rating ?? 0);
      return b.matchPercentage - a.matchPercentage;
    });
  }, [matches, search, skillFilter, sortKey]);

  if (!user) return null;

  return (
    <AppLayout
      title="Find Students"
      description="Discover students who teach what you want to learn."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Input
          placeholder="Search by name, college, branch or skill"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="sm:w-52">
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skills</SelectItem>
            {skills.map((skill) => (
              <SelectItem key={skill.id} value={skill.name}>
                {skill.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger className="sm:w-52">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Best match</SelectItem>
            <SelectItem value="rating">Highest rated</SelectItem>
            <SelectItem value="points">Most skill points</SelectItem>
            <SelectItem value="name">Name (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isLoading && !error ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {filtered.length} student{filtered.length === 1 ? "" : "s"} found
        </p>
      ) : null}

      {isLoading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-6 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          {error}
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No students match your search.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {filtered.map((match) => (
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
    </AppLayout>
  );
}
