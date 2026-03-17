import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/rakshak/TaskCard";
import { cn } from "@/lib/utils";
import type { RakshakTask } from "@/hooks/use-api";

const COLUMN_META: Record<string, { label: string; color: string }> = {
  todo: { label: "To Do", color: "bg-blue-400" },
  in_progress: { label: "In Progress", color: "bg-amber-400" },
  done: { label: "Done", color: "bg-emerald-400" },
};

interface KanbanColumnProps {
  column: string;
  tasks: RakshakTask[];
  onMove: (id: string, column: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: RakshakTask) => void;
  onAdd: (column: string) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onMove,
  onDelete,
  onEdit,
  onAdd,
}: KanbanColumnProps) {
  const meta = COLUMN_META[column] ?? { label: column, color: "bg-muted" };

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", meta.color)} />
          <h3 className="text-sm font-semibold text-foreground">
            {meta.label}
          </h3>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAdd(column)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 flex-1 min-h-[120px] bg-card/30 rounded-xl p-2 border border-border/30">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={onMove}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}
