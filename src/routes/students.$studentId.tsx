import { useEffect, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { SkillTag } from "@/components/SkillTag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { userService } from "@/services/userService";
import { reviewService } from "@/services/reviewService";
import { connectionService } from "@/services/connectionService";
import type { Review, User } from "@/lib/types";

export const Route = createFileRoute("/students/$studentId")({
  head: () => ({
    meta: [
      { title: "Student Profile — Skill Verse" },
      {
        name: "description",
        content: "View a student's skills, skill points and reviews on Skill Verse.",
      },
      { property: "og:title", content: "Student Profile — Skill Verse" },
      { property: "og:description", content: "Student skills, skill points and reviews." },
    ],
  }),
  component: StudentProfilePage,
});

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= Math.round(rating) ? "fill-foreground text-foreground" : "text-border"}`}
        />
      ))}
    </span>
  );
}

function StudentProfilePage() {
  const { user } = useRequireAuth();
  const { studentId } = useParams({ from: "/students/$studentId" });
  const [student, setStudent] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    userService.getUser(studentId).then((s) => setStudent(s ?? null));
    reviewService.getReviews(studentId).then(setReviews);
  }, [studentId]);

  if (!user) return null;

  if (!student) {
    return (
      <AppLayout title="Student Profile">
        <p className="text-sm text-muted-foreground">Student not found.</p>
      </AppLayout>
    );
  }

  async function handleConnect() {
    if (!user || !student) return;
    await connectionService.sendRequest(user.id, student.id);
    toast.success(`Connection request sent to ${student.name}`);
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !student) return;
    const created = await reviewService.createReview({
      reviewerId: user.id,
      reviewerName: user.name,
      reviewedUserId: student.id,
      rating,
      comment,
    });
    setReviews((prev) => [created, ...prev]);
    setComment("");
    toast.success("Review submitted");
  }

  return (
    <AppLayout title={student.name} description={`${student.branch} · ${student.year}`}>
      <Card>
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-2xl font-semibold text-muted-foreground">
            {student.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">{student.college}</p>
            <p className="mt-4 text-sm text-foreground">{student.bio}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>Skill points: {student.skillPoints}</span>
              <span className="flex items-center gap-2">
                <Stars rating={student.rating ?? 0} /> {student.rating?.toFixed(1)}
              </span>
            </div>
          </div>
          <Button onClick={handleConnect}>Send Connection Request</Button>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills They Can Teach</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {student.teachSkills.map((s) => (
              <SkillTag key={s} label={s} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills They Want To Learn</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {student.learnSkills.map((s) => (
              <SkillTag key={s} label={s} variant="outline" />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{review.reviewerName}</p>
                  <Stars rating={review.rating} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))
          )}

          <form onSubmit={submitReview} className="space-y-3 border-t border-border pt-5">
            <Label htmlFor="comment">Leave a review</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star`}>
                  <Star
                    className={`h-5 w-5 ${n <= rating ? "fill-foreground text-foreground" : "text-border"}`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              id="comment"
              rows={3}
              required
              placeholder="Share how the collaboration went"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit" size="sm">
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
