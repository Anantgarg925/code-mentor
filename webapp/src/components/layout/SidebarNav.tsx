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
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 glow-green">
          <Code2 className="h-4 w-4 text-primary" />
        </div>
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-foreground">
              CodeMentor
            </span>
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary">
              v1.0
            </span>
          </div>
        ) : null}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
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
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {isActive ? (
                <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
              ) : null}
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      {/* Bottom stats card */}
      {!collapsed ? (
        <div className="mx-3 mb-4 rounded-xl border border-border bg-secondary/50 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Problems</span>
            <span className="font-mono font-semibold text-primary">12/300</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: "4%" }}
            />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            <span>
              <span className="font-mono font-semibold text-accent">8</span> day
              streak
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
