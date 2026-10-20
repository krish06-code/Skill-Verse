import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { SkillTag } from "@/components/SkillTag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { connectionService } from "@/services/connectionService";
import { userService } from "@/services/userService";
import type { Connection, ConnectionStatus, User } from "@/lib/types";

export const Route = createFileRoute("/connections")({
  head: () => ({
    meta: [
      { title: "Connections — Skill Verse" },
      {
        name: "description",
        content: "Manage pending connection requests and your accepted student connections.",
      },
      { property: "og:title", content: "Connections — Skill Verse" },
      {
        property: "og:description",
        content: "Your Skill Verse connection requests and connections.",
      },
    ],
  }),
  component: ConnectionsPage,
});

function ConnectionsPage() {
  const { user } = useRequireAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;
    connectionService.getConnections(user.id).then(setConnections);
    userService.listStudents().then(setStudents);
  }, [user]);

  if (!user) return null;

  const findUser = (id: string) => students.find((s) => s.id === id);

  const pending = connections.filter((c) => c.status === "PENDING" && c.receiverId === user.id);
  const accepted = connections.filter((c) => c.status === "ACCEPTED");

  async function respond(id: string, status: ConnectionStatus, name: string) {
    await connectionService.respond(id, status);
    setConnections((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    toast.success(
      status === "ACCEPTED"
        ? `You are now connected with ${name}`
        : `Request from ${name} rejected`,
    );
  }

  return (
    <AppLayout
      title="Connections"
      description="Requests waiting on you and students you already work with."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending requests.</p>
          ) : (
            pending.map((c) => {
              const sender = findUser(c.senderId);
              if (!sender) return null;
              return (
                <div
                  key={c.id}
                  className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{sender.name}</p>
                    <p className="text-sm text-muted-foreground">Wants to connect with you</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => respond(c.id, "ACCEPTED", sender.name)}>
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => respond(c.id, "REJECTED", sender.name)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">My Connections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {accepted.length === 0 ? (
            <p className="text-sm text-muted-foreground">No connections yet.</p>
          ) : (
            accepted.map((c) => {
              const otherId = c.senderId === user.id ? c.receiverId : c.senderId;
              const other = findUser(otherId);
              if (!other) return null;
              return (
                <div
                  key={c.id}
                  className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{other.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {other.teachSkills.map((s) => (
                        <SkillTag key={s} label={s} />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to="/students/$studentId" params={{ studentId: other.id }}>
                        View Profile
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link to="/messages">Message</Link>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
