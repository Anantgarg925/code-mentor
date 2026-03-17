import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { DailyTask } from "@/hooks/use-api";
import { useDailyTasks, useUpdateDailyTask } from "@/hooks/use-api";

const typeBadgeStyles: Record<string, string> = {
  "DSA New": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "DSA Revision": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Project: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Theory: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

function TaskRow({ task }: { task: DailyTask }) {
  const updateTask = useUpdateDailyTask();
  const isCompleted = task.status === "completed";

  function handleToggle() {
    updateTask.mutate({
      id: task.id,
      status: isCompleted ? "pending" : "completed",
    });
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left transition-colors",
        "hover:bg-muted/50",
        isCompleted && "opacity-60"
      )}
    >
      {isCompleted ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
      )}
      <span
        className={cn(
          "flex-1 text-sm font-medium",
          isCompleted && "line-through text-muted-foreground"
        )}
      >
        {task.title}
      </span>
      <Badge
        variant="outline"
        className={cn(
          "text-[10px] shrink-0",
          typeBadgeStyles[task.type] ?? "bg-muted text-muted-foreground"
        )}
      >
        {task.type}
      </Badge>
    </button>
  );
}

export function TodayTasks() {
  const { data: tasks, isLoading } = useDailyTasks();

  if (isLoading) {
    return (
      <Card className="glass border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const completedCount = tasks?.filter((t) => t.status === "completed").length ?? 0;
  const totalCount = tasks?.length ?? 0;

  return (
    <Card className="glass border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Today's Tasks
          </CardTitle>
          <span className="text-xs text-muted-foreground font-mono">
            {completedCount}/{totalCount} done
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {tasks && tasks.length > 0 ? (
          <div className="space-y-1">
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
              >
                <TaskRow task={task} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 rounded-full bg-muted/50 border border-border flex items-center justify-center">
              <CalendarPlus className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">No tasks today</p>
              <p className="text-xs text-muted-foreground mt-1">
                Generate your daily plan to get started
              </p>
            </div>
            <Button asChild size="sm" className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 shadow-none">
              <Link to="/planner">
                Generate Plan
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
