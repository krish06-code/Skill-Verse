import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, Check, Star } from "lucide-react";
import { toast } from "sonner";
import { SkillTag } from "@/components/SkillTag";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { connectionService } from "@/services/connectionService";
import type { MatchResult, User } from "@/lib/types";

interface StudentCardProps {
  student: User;
  matchPercentage?: number;
  match?: Pick<MatchResult, "theyCanTeachYou" | "youCanTeachThem" | "twoWay">;
  connectionState?: "none" | "pending" | "connected";
}

export function StudentCard({
  student,
  matchPercentage,
  match,
  connectionState = "none",
}: StudentCardProps) {
  const { user } = useAuth();
  const [state, setState] = useState(connectionState);
  const [sending, setSending] = useState(false);

  async function handleConnect() {
    if (!user) return;
    setSending(true);
    try {
      await connectionService.sendRequest(user.id, student.id);
      setState("pending");
      toast.success(`Connection request sent to ${student.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send the request");
    } finally {
      setSending(false);
    }
  }

  const teachList = match?.theyCanTeachYou ?? [];
  const learnList = match?.youCanTeachThem ?? [];
  const hasHighlights = teachList.length > 0 || learnList.length > 0;

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">{student.name}</h3>
            <p className="truncate text-sm text-muted-foreground">{student.college}</p>
            <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{student.skillPoints} pts</span>
              {student.rating ? (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-foreground text-foreground" />
                  {student.rating.toFixed(1)}
                </span>
              ) : null}
            </p>
          </div>
          {matchPercentage !== undefined ? (
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="rounded-md border border-border bg-muted px-2 py-1 text-xs font-semibold">
                {matchPercentage}% Match
              </span>
              {match?.twoWay ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ArrowLeftRight className="h-3 w-3" /> Two-way swap
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        {hasHighlights ? (
          <div className="space-y-2 rounded-md border border-border bg-muted/40 p-3 text-xs">
            {teachList.length > 0 ? (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Can teach you:</span>{" "}
                {teachList.join(", ")}
              </p>
            ) : null}
            {learnList.length > 0 ? (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Wants to learn from you:</span>{" "}
                {learnList.join(", ")}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Can teach
            </p>
            <div className="flex flex-wrap gap-1.5">
              {student.teachSkills.map((s) => (
                <SkillTag key={s} label={s} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Wants to learn
            </p>
            <div className="flex flex-wrap gap-1.5">
              {student.learnSkills.map((s) => (
                <SkillTag key={s} label={s} variant="outline" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/students/$studentId" params={{ studentId: student.id }}>
              View Profile
            </Link>
          </Button>
          {state === "connected" ? (
            <Button size="sm" variant="outline" disabled>
              <Check className="mr-1 h-4 w-4" /> Connected
            </Button>
          ) : (
            <Button size="sm" onClick={handleConnect} disabled={sending || state === "pending"}>
              {state === "pending" ? "Request sent" : sending ? "Sending..." : "Connect"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
