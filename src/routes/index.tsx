import { createFileRoute, Link } from "@tanstack/react-router";
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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-semibold tracking-tight">Skill Verse</span>
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

      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Skill Verse
          </h1>
          <p className="mt-3 text-lg font-medium text-foreground">Learn. Teach. Connect.</p>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Connect with students who can teach what you want to learn while sharing the skills you
            already know.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Skill Verse
        </div>
      </footer>
    </div>
  );
}
