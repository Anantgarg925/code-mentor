import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ListTodo } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailyTasks, useUpdateDailyTask } from "@/hooks/use-api";
import { DateSelector } from "@/components/planner/DateSelector";
import { DailyProgress } from "@/components/planner/DailyProgress";
import { TaskGroup } from "@/components/planner/TaskGroup";
import { GenerateButton } from "@/components/planner/GenerateButton";

const TOTAL_DAYS = 105;

function toDateString(d: Date) {
  return d.toISOString().split("T")[0];
}

const TASK_TYPE_ORDER = ["dsa_new", "dsa_revision", "project", "core_subjects"];

export default function DailyPlanner() {
  const [date, setDate] = useState<Date>(new Date());
  const dateStr = toDateString(date);
  const { data: tasks, isLoading } = useDailyTasks(dateStr);
  const updateTask = useUpdateDailyTask();

  const grouped = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    for (const type of TASK_TYPE_ORDER) {
      map[type] = [];
    }
    if (tasks) {
      for (const t of tasks) {
        const key = t.type || "dsa-new";
        if (!map[key]) map[key] = [];
        map[key]!.push(t);
      }
    }
    return map;
  }, [tasks]);

  const completed = tasks?.filter((t) => t.status === "completed").length ?? 0;
  const total = tasks?.length ?? 0;

  const currentDay = 9;

  function handleToggle(id: string, done: boolean) {
    updateTask.mutate({ id, status: done ? "completed" : "pending" });
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Daily Planner
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Day{" "}
          <span className="font-mono text-foreground">{currentDay}</span> of{" "}
          <span className="font-mono text-foreground">{TOTAL_DAYS}</span>
          <span className="text-border mx-2">|</span>
          2h DSA + 1.5h Project + 30min Theory
        </p>
      </motion.div>

      {/* Date selector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <DateSelector date={date} onDateChange={setDate} />
      </motion.div>

      {/* Progress + Generate */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start"
      >
        {isLoading ? (
          <Skeleton className="h-28 rounded-xl" />
        ) : (
          <DailyProgress completed={completed} total={total} />
        )}
        <div className="flex sm:flex-col gap-2">
          <GenerateButton date={dateStr} />
        </div>
      </motion.div>

      {/* Task groups */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-5"
      >
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : total === 0 ? (
          <div className="glass border-border/50 rounded-xl p-10 text-center space-y-3">
            <ListTodo className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">
              No tasks for this day yet.
            </p>
            <p className="text-xs text-muted-foreground">
              Hit "Auto-Generate" to create today's plan, or tasks will appear
              once generated.
            </p>
          </div>
        ) : (
          TASK_TYPE_ORDER.map((type) =>
            grouped[type] && grouped[type]!.length > 0 ? (
              <TaskGroup
                key={type}
                type={type}
                tasks={grouped[type]!}
                onToggle={handleToggle}
              />
            ) : null
          )
        )}
      </motion.div>
    </div>
  );
}
