import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  User,
  Users,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/find-students", label: "Find Students", icon: Search },
  { to: "/profile", label: "My Profile", icon: User },
  { to: "/connections", label: "Connections", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/skill-points", label: "Skill Points", icon: Award },
] as const;

interface AppLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AppLayout({ title, description, children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          activeProps={{
            className: "bg-white/12 text-white shadow-sm hover:bg-white/12 hover:text-white",
          }}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
      <button
        type="button"
        onClick={handleLogout}
        className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,oklch(0.93_0.05_270),transparent_30%),oklch(0.985_0.006_264)]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-sidebar px-4 py-3 text-white lg:hidden">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-base font-semibold tracking-tight"
        >
          <span className="brand-mark grid h-7 w-7 place-items-center rounded-lg">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          SkillVerse
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {open ? <div className="border-b border-white/10 bg-sidebar px-4 py-3">{nav}</div> : null}

      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-sidebar p-4 text-white lg:flex">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-3 text-lg font-semibold tracking-tight"
          >
            <span className="brand-mark grid h-9 w-9 place-items-center rounded-xl">
              <Sparkles className="h-4 w-4" />
            </span>
            SkillVerse
          </Link>
          <div className="mt-8 flex-1">{nav}</div>
          {user ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{user.email}</p>
            </div>
          ) : null}
        </aside>

        <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Skill exchange workspace
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-[2rem]">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
