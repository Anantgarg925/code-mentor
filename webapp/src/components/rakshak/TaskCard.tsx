import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RakshakTask } from "@/hooks/use-api";

const CATEGORY_STYLE: Record<string, string> = {
  backend: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  android: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  architecture: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  docs: "bg-amber-400/10 text-amber-400 border-amber-400/20",
};

const PRIORITY_COLOR: Record<number, string> = {
  1: "bg-red-400",
  2: "bg-amber-400",
  3: "bg-zinc-500",
};

const COLUMNS_ORDER = ["todo", "in_progress", "done"];

interface TaskCardProps {
  task: RakshakTask;
  onMove: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: RakshakTask) => void;
}

export function TaskCard({ task, onMove, onDelete, onEdit }: TaskCardProps) {
  const colIdx = COLUMNS_ORDER.indexOf(task.status);
  const canMoveLeft = colIdx > 0;
  const canMoveRight = colIdx < COLUMNS_ORDER.length - 1;
  const catStyle = CATEGORY_STYLE[task.category] ?? CATEGORY_STYLE.backend;
  const prioColor = PRIORITY_COLOR[task.priority] ?? "bg-zinc-500";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass border-border/50 rounded-lg p-3 space-y-2.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn("h-2 w-2 rounded-full flex-shrink-0", prioColor)} />
          <p className="text-sm font-medium text-foreground truncate">
            {task.title}
          </p>
        </div>
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0",
            catStyle
          )}
        >
          {task.category}
        </span>
      </div>

      {task.details ? (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.details}
        </p>
      ) : null}

      <div className="flex items-center justify-between pt-1 border-t border-border/30">
        <div className="flex gap-1">
          {canMoveLeft ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onMove(task.id, COLUMNS_ORDER[colIdx - 1])}
              title="Move left"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          ) : null}
          {canMoveRight ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onMove(task.id, COLUMNS_ORDER[colIdx + 1])}
              title="Move right"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : null}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(task)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
