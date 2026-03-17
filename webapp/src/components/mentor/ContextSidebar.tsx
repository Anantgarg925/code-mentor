import { useState } from "react";
import {
  Brain,
  ChevronRight,
  Flame,
  Trophy,
  AlertTriangle,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DashboardData } from "@/hooks/use-api";

interface ContextSidebarProps {
  data: DashboardData | undefined;
  isLoading: boolean;
}

export function ContextSidebar({ data, isLoading }: ContextSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center py-4 px-1 border-l border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(false)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <PanelRightOpen className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const stats = data?.stats;
  const recentProblems = data?.recentProblems?.slice(0, 5) ?? [];

  // Derive weak patterns from revision queue (low confidence problems)
  const weakPatterns: string[] = [];
  if (data?.revisionQueue) {
    const seen = new Set<string>();
    for (const p of data.revisionQueue) {
      if (p.weakPoints && !seen.has(p.pattern)) {
        seen.add(p.pattern);
        weakPatterns.push(p.pattern);
      }
    }
  }

  return (
    <div className="hidden lg:flex w-[300px] shrink-0 flex-col border-l border-border bg-card/30">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Context</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(true)}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Your Progress */}
          <Section title="Your Progress">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-32 bg-secondary animate-pulse rounded" />
                <div className="h-4 w-24 bg-secondary animate-pulse rounded" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Problems Solved</span>
                  <span className="ml-auto font-semibold text-foreground">
                    {data?.problemsSolved ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Flame className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">Current Streak</span>
                  <span className="ml-auto font-semibold text-foreground">
                    {stats?.currentStreak ?? 0} days
                  </span>
                </div>
              </div>
            )}
          </Section>

          {/* Weak Points */}
          <Section title="Weak Points">
            {weakPatterns.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No weak points identified yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {weakPatterns.map((pattern) => (
                  <Badge
                    key={pattern}
                    variant="outline"
                    className="text-xs border-destructive/30 text-destructive/80"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {pattern}
                  </Badge>
                ))}
              </div>
            )}
          </Section>

          {/* Recent Problems */}
          <Section title="Recent Problems">
            {recentProblems.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No problems solved yet.
              </p>
            ) : (
              <div className="space-y-2">
                {recentProblems.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate text-foreground/80 text-xs">
                      {p.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="ml-auto text-[10px] shrink-0"
                    >
                      {p.pattern}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Suggested Next */}
          <Section title="Suggested Next">
            {weakPatterns.length > 0 ? (
              <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Focus on: {weakPatterns[0]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This pattern needs the most improvement based on your confidence
                  scores.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Complete more problems to get personalized suggestions.
              </p>
            )}
          </Section>
        </div>
      </ScrollArea>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}
