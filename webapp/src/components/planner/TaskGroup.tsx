import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { DailyTask } from "@/hooks/use-api";

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  dsa_new: {
    label: "DSA New",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  dsa_revision: {
    label: "DSA Revision",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  project: {
    label: "Project",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  core_subjects: {
    label: "Core Subjects",
    color: "text-teal-400",
    bg: "bg-teal-400/10 border-teal-400/20",
  },
};

interface TaskGroupProps {
  type: string;
  tasks: DailyTask[];
  onToggle: (id: string, done: boolean) => void;
}

export function TaskGroup({ type, tasks, onToggle }: TaskGroupProps) {
  const config = TYPE_CONFIG[type] ?? {
    label: type,
    color: "text-muted-foreground",
    bg: "bg-muted/50 border-border",
  };

  if (tasks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-semibold",
          config.bg,
          config.color
        )}
      >
        {config.label}
        <span className="font-mono opacity-70">{tasks.length}</span>
      </div>
      <div className="space-y-1.5">
        {tasks.map((task) => {
          const done = task.status === "completed";
          return (
            <label
              key={task.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/50 cursor-pointer",
                "hover:bg-card transition-colors",
                done && "opacity-60"
              )}
            >
              <Checkbox
                checked={done}
                onCheckedChange={(checked) =>
                  onToggle(task.id, !!checked)
                }
              />
              <span
                className={cn(
                  "text-sm text-foreground flex-1",
                  done && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </span>
              {task.priority <= 1 ? (
                <span className="h-2 w-2 rounded-full bg-red-400 flex-shrink-0" />
              ) : task.priority === 2 ? (
                <span className="h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
              ) : null}
            </label>
          );
        })}
      </div>
    </motion.div>
  );
}
