import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Code2,
  Bot,
  CalendarDays,
  Map,
  Kanban,
  BookOpen,
  Flame,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, route: "/" },
  { label: "DSA Tracker", icon: Code2, route: "/dsa" },
  { label: "AI Mentor", icon: Bot, route: "/mentor" },
  { label: "Daily Plan", icon: CalendarDays, route: "/planner" },
  { label: "Roadmap", icon: Map, route: "/roadmap" },
  { label: "Rakshak Board", icon: Kanban, route: "/rakshak" },
  { label: "Core Subjects", icon: BookOpen, route: "/subjects" },
];

interface SidebarNavProps {
  collapsed?: boolean;
  onNavClick?: () => void;
}

export function SidebarNav({ collapsed, onNavClick }: SidebarNavProps) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 border border-primary/25 animate-pulse-glow shrink-0">
          <Code2 className="h-4 w-4 text-primary" />
          {/* Animated active dot */}
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary border border-sidebar-background">
            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
          </span>
        </div>
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight gradient-primary-text">
              CodeMentor
            </span>
            <span className="rounded-md bg-primary/10 border border-primary/20 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary">
              v1.0
            </span>
          </div>
        ) : null}
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.route === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.route);

          return (
            <Link
              key={item.route}
              to={item.route}
              onClick={onNavClick}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/15"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground hover:scale-[1.01]"
              )}
            >
              {isActive ? (
                <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_8px_hsl(160_80%_42%/0.6)]" />
              ) : null}
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}

        {/* Gradient fade at bottom of nav list */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-sidebar-background to-transparent" />
      </nav>

      {/* Bottom stats card */}
      {!collapsed ? (
        <div className="mx-3 mb-4 rounded-xl border border-sidebar-border surface p-4 space-y-3">
          {/* Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
            <span className="font-mono text-sm font-bold text-amber-400">
              8 days
            </span>
          </div>

          {/* Problems solved */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Problems</span>
              <span className="font-mono font-semibold text-primary">
                12 / 300
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
              <div
                className="h-full rounded-full bg-primary transition-all progress-glow"
                style={{ width: "4%" }}
              />
            </div>
            <div className="mt-1 text-right">
              <span className="font-mono text-[10px] text-muted-foreground">
                4% complete
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
