import { motion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDashboard } from "@/hooks/use-api";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { PatternChart } from "@/components/dashboard/PatternChart";
import { TodayTasks } from "@/components/dashboard/TodayTasks";
import { RevisionQueue } from "@/components/dashboard/RevisionQueue";
import { QuickActions } from "@/components/dashboard/QuickActions";

const TOTAL_TARGET = 300;
const TOTAL_DAYS = 105;

function getMotivationalMessage(pct: number): string {
  if (pct < 30) return "Foundation phase — every problem builds your intuition.";
  if (pct < 60) return "Building momentum — you're finding your rhythm.";
  return "Final push mode — the finish line is in sight!";
}

export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  const problemsSolved = data?.problemsSolved ?? 0;
  const streak = data?.stats?.currentStreak ?? 0;
  const progressPct = Math.round((problemsSolved / TOTAL_TARGET) * 100);
  const currentDay = 9;
  const monthsToPlacement = "3.5";

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-border/60 glass p-6 md:p-8 space-y-6"
      >
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-14 w-1/3 max-w-[120px]" />
            <Skeleton className="h-5 w-2/3 max-w-sm" />
            <Skeleton className="h-3 w-full max-w-lg" />
          </div>
        ) : (
          <>
            {/* Top row: day counter + placement */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl md:text-7xl font-bold font-mono tracking-tight gradient-primary-text">
                    {currentDay}
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      of {TOTAL_DAYS} days
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {monthsToPlacement} months to placements
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  {getMotivationalMessage(progressPct)}
                </p>
              </div>

              {/* Streak badge */}
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 shrink-0 self-start">
                <Flame className="h-5 w-5 text-amber-400 fill-amber-400" />
                <div>
                  <p className="text-lg font-bold font-mono text-amber-400 leading-none">
                    {streak}
                  </p>
                  <p className="text-[10px] text-amber-400/70 mt-0.5">day streak</p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-foreground">
                    {problemsSolved}
                  </span>
                  <span className="text-base text-muted-foreground font-mono">
                    / {TOTAL_TARGET}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    problems solved
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold text-primary">
                  {progressPct}%
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-border/50">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-700 progress-glow"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </>
        )}
      </motion.section>

      {/* QUICK ACTIONS */}
      <section>
        <QuickActions />
      </section>

      {/* STATS GRID */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <StatsGrid data={data} isLoading={isLoading} />
      </motion.section>

      {/* TWO COLUMN LAYOUT: Pattern Chart + Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <PatternChart
            patterns={data?.patternMastery}
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <TodayTasks />
        </motion.div>
      </div>

      {/* REVISION QUEUE */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <RevisionQueue
          problems={data?.revisionQueue}
          isLoading={isLoading}
        />
      </motion.section>
    </div>
  );
}
