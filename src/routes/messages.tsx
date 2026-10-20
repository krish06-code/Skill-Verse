import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { connectionService } from "@/services/connectionService";
import { messageService } from "@/services/messageService";
import { userService } from "@/services/userService";
import type { Message, User } from "@/lib/types";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Skill Verse" },
      {
        name: "description",
        content: "Chat with the students you are connected with on Skill Verse.",
      },
      { property: "og:title", content: "Messages — Skill Verse" },
      { property: "og:description", content: "Your Skill Verse conversations." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const { user } = useRequireAuth();
  const [contacts, setContacts] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!user) return;
    Promise.all([
      connectionService.getConnections(user.id),
      userService.listStudents(),
      messageService.getMessages(user.id),
    ]).then(([connections, students, msgs]) => {
      const acceptedIds = connections
        .filter((c) => c.status === "ACCEPTED")
        .map((c) => (c.senderId === user.id ? c.receiverId : c.senderId));
      const list = students.filter((s) => acceptedIds.includes(s.id));
      setContacts(list);
      setMessages(msgs);
      setActiveId((prev) => prev ?? list[0]?.id ?? null);
    });
  }, [user]);

  const thread = useMemo(
    () => messages.filter((m) => m.senderId === activeId || m.receiverId === activeId),
    [messages, activeId],
  );

  const activeContact = contacts.find((c) => c.id === activeId);

  if (!user) return null;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !activeId || !draft.trim()) return;
    const created = await messageService.sendMessage(user.id, activeId, draft.trim());
    setMessages((prev) => [...prev, created]);
    setDraft("");
  }

  return (
    <AppLayout title="Messages" description="Talk with your connections about skill sessions.">
      <Card className="grid gap-0 overflow-hidden p-0 md:grid-cols-[260px_1fr]">
        <div className="border-b border-border md:border-b-0 md:border-r">
          <p className="border-b border-border px-4 py-3 text-sm font-medium">Connections</p>
          <div className="max-h-64 overflow-y-auto md:max-h-[28rem]">
            {contacts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`block w-full border-b border-border px-4 py-3 text-left text-sm transition-colors last:border-0 ${
                  c.id === activeId
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {c.name}
              </button>
            ))}
            {contacts.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">No connections yet.</p>
            ) : null}
          </div>
        </div>

        <div className="flex min-h-[24rem] flex-col">
          <p className="border-b border-border px-4 py-3 text-sm font-medium">
            {activeContact ? activeContact.name : "Select a conversation"}
          </p>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {thread.map((m) => {
              const mine = m.senderId === user.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-lg border px-3 py-2 text-sm ${
                      mine
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-muted text-foreground"
                    }`}
                  >
                    <p>{m.message}</p>
                    <p
                      className={`mt-1 text-[11px] ${mine ? "opacity-70" : "text-muted-foreground"}`}
                    >
                      {m.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
            {thread.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            ) : null}
          </div>
          <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-3">
            <Input
              placeholder="Type a message..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!activeId}
            />
            <Button type="submit" disabled={!activeId}>
              <Send className="mr-1 h-4 w-4" /> Send
            </Button>
          </form>
        </div>
      </Card>
    </AppLayout>
  );
}
