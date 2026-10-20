import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { badges } from "@/lib/badges";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export const Route = createFileRoute("/skill-points")({
  head: () => ({
    meta: [
      { title: "Skill Points — Skill Verse" },
      {
        name: "description",
        content: "Track the skill points and badges you earn by teaching and learning.",
      },
      { property: "og:title", content: "Skill Points — Skill Verse" },
      { property: "og:description", content: "Your Skill Verse points and badges." },
    ],
  }),
  component: SkillPointsPage,
});

function SkillPointsPage() {
  const { user } = useRequireAuth();
  if (!user) return null;

  return (
    <AppLayout
      title="Skill Points"
      description="Points and badges you earn by teaching and learning."
    >
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Skill Points</p>
          <p className="mt-1 text-4xl font-semibold text-foreground">{user.skillPoints}</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Badges</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {badges.map((badge) => (
            <div key={badge.name} className="rounded-md border border-border p-4">
              <p className="text-2xl">{badge.icon}</p>
              <p className="mt-2 text-sm font-medium text-foreground">{badge.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
