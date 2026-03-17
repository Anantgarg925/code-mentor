import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-api";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { PatternChart } from "@/components/dashboard/PatternChart";
import { TodayTasks } from "@/components/dashboard/TodayTasks";
import { RevisionQueue } from "@/components/dashboard/RevisionQueue";
import { QuickActions } from "@/components/dashboard/QuickActions";

const TOTAL_TARGET = 300;
const TOTAL_DAYS = 105;

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
        className="space-y-4"
      >
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4 max-w-md" />
            <Skeleton className="h-5 w-2/3 max-w-sm" />
            <Skeleton className="h-3 w-full max-w-lg" />
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Welcome back!{" "}
                <span className="text-primary">
                  {monthsToPlacement} months to placements
                </span>
              </h1>
              <p className="mt-2 text-sm md:text-base text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-mono text-foreground">
                  {problemsSolved}/{TOTAL_TARGET}
                </span>{" "}
                problems solved
                <span className="text-border">|</span>
                <span className="inline-flex items-center gap-1">
                  <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="font-mono text-foreground">{streak}</span>{" "}
                  day streak
                </span>
                <span className="text-border">|</span>
                Day{" "}
                <span className="font-mono text-foreground">{currentDay}</span>{" "}
                of {TOTAL_DAYS}
              </p>
            </div>
            <div className="max-w-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Overall progress</span>
                <span className="font-mono">{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-2.5" />
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
