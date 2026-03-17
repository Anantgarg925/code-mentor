import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeekPlan {
  week: number;
  focus: string;
  daily: string;
  problems: number;
}

const WEEKS: WeekPlan[] = [
  { week: 1, focus: "Arrays & Hashing Basics", daily: "2 new + 1 revision + 30min theory", problems: 12 },
  { week: 2, focus: "Two Pointers & Prefix Sums", daily: "2 new + 1 revision + 30min theory", problems: 12 },
  { week: 3, focus: "Sliding Window Patterns", daily: "3 new + 2 revision + 30min theory", problems: 15 },
  { week: 4, focus: "Mixed Practice & Assessment", daily: "2 new + 3 revision + 30min theory", problems: 12 },
  { week: 5, focus: "Stacks & Monotonic Stack", daily: "2 new + 1 revision + 30min theory", problems: 12 },
  { week: 6, focus: "Queues & Priority Queues", daily: "2 new + 1 revision + 30min theory", problems: 12 },
  { week: 7, focus: "Linked List Patterns", daily: "2 new + 1 revision + 30min theory", problems: 12 },
  { week: 8, focus: "Heap & Mixed Review", daily: "2 new + 2 revision + 30min theory", problems: 12 },
];

export function WeeklyBreakdown() {
  const [expanded, setExpanded] = useState<number | null>(2);
  const currentWeek = 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="glass border-border/50 rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Weekly Breakdown</h3>
      </div>

      <div className="space-y-2">
        {WEEKS.map((w) => {
          const isCurrent = w.week === currentWeek;
          const isOpen = expanded === w.week;
          return (
            <div key={w.week}>
              <button
                onClick={() => setExpanded(isOpen ? null : w.week)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors",
                  "border border-border/50",
                  isCurrent
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card/50 hover:bg-card"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-xs font-mono font-semibold px-2 py-0.5 rounded",
                      isCurrent
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    W{w.week}
                  </span>
                  <span className="text-sm text-foreground">{w.focus}</span>
                  {isCurrent ? (
                    <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                      Current
                    </span>
                  ) : null}
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-3 py-3 ml-6 border-l border-border/50 space-y-1.5 text-sm"
                >
                  <p className="text-muted-foreground">
                    Daily target:{" "}
                    <span className="text-foreground">{w.daily}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Weekly problems:{" "}
                    <span className="font-mono text-foreground">
                      {w.problems}
                    </span>
                  </p>
                </motion.div>
              ) : null}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
