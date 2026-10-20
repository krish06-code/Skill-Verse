import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { SkillTag } from "@/components/SkillTag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export const Route = createFileRoute("/profile/")({
  head: () => ({
    meta: [
      { title: "My Profile — Skill Verse" },
      {
        name: "description",
        content: "View your Skill Verse profile, teaching skills and learning goals.",
      },
      { property: "og:title", content: "My Profile — Skill Verse" },
      { property: "og:description", content: "Your Skill Verse student profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useRequireAuth();
  if (!user) return null;

  return (
    <AppLayout title="My Profile">
      <Card>
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-2xl font-semibold text-muted-foreground">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.college}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.branch} · {user.year}
            </p>
            <p className="mt-4 text-sm text-foreground">{user.bio || "No bio added yet."}</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/profile/edit">Edit Profile</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills I Can Teach</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {user.teachSkills.length ? (
              user.teachSkills.map((s) => <SkillTag key={s} label={s} />)
            ) : (
              <p className="text-sm text-muted-foreground">No skills added yet.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills I Want to Learn</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {user.learnSkills.length ? (
              user.learnSkills.map((s) => <SkillTag key={s} label={s} variant="outline" />)
            ) : (
              <p className="text-sm text-muted-foreground">No skills added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
