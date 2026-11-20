import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { AuthShell } from "@/components/AuthShell";
import { BookOpen, GraduationCap, Repeat2 } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — Skill Verse" },
      {
        name: "description",
        content: "Create a Skill Verse account and start exchanging skills with students.",
      },
      { property: "og:title", content: "Create Account — Skill Verse" },
      {
        property: "og:description",
        content: "Join Skill Verse and exchange skills with other students.",
      },
    ],
  }),
  component: RegisterPage,
});

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  college: "",
  branch: "",
  year: "",
  joinAs: "both" as "giver" | "learner" | "both",
};

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const { user, token } = await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        college: form.college,
        branch: form.branch,
        year: form.year,
      });
      login(user, token);
      if (form.joinAs === "giver" || form.joinAs === "both") {
        toast.success("Your account is ready. Add the skills you can teach to get matched.");
        navigate({ to: "/profile/edit" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create your account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-lg border-0 shadow-none">
        <CardHeader>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
            Start your journey
          </p>
          <CardTitle className="mt-2 text-3xl tracking-tight">Create your profile</CardTitle>
          <CardDescription className="text-base">
            Tell us a little about yourself. Skills come next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground">
                How do you want to join?
              </legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  {
                    value: "giver" as const,
                    title: "Skill giver",
                    detail: "I can teach",
                    icon: GraduationCap,
                  },
                  {
                    value: "learner" as const,
                    title: "Learner",
                    detail: "I want to learn",
                    icon: BookOpen,
                  },
                  { value: "both" as const, title: "Both", detail: "Teach & learn", icon: Repeat2 },
                ].map(({ value, title, detail, icon: Icon }) => (
                  <label
                    key={value}
                    className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                      form.joinAs === value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-white text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="joinAs"
                      value={value}
                      checked={form.joinAs === value}
                      onChange={() => update("joinAs", value)}
                    />
                    <Icon className="h-4 w-4" />
                    <span className="mt-2 block text-sm font-semibold">{title}</span>
                    <span className="block text-xs">{detail}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College/University</Label>
              <Input
                id="college"
                required
                value={form.college}
                onChange={(e) => update("college", e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  required
                  value={form.branch}
                  onChange={(e) => update("branch", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year of Study</Label>
                <Input
                  id="year"
                  required
                  placeholder="e.g. 3rd Year"
                  value={form.year}
                  onChange={(e) => update("year", e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="h-11 w-full rounded-xl" disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
