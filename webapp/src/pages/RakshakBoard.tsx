import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Kanban, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  useRakshakTasks,
  useCreateRakshakTask,
  useUpdateRakshakTask,
  useDeleteRakshakTask,
  type RakshakTask,
} from "@/hooks/use-api";
import { KanbanColumn } from "@/components/rakshak/KanbanColumn";
import { AddTaskDialog } from "@/components/rakshak/AddTaskDialog";
import { cn } from "@/lib/utils";

const COLUMNS = ["todo", "in_progress", "done"] as const;
const CATEGORIES = ["all", "backend", "android", "architecture", "docs"] as const;

export default function RakshakBoard() {
  const { data: tasks, isLoading } = useRakshakTasks();
  const createTask = useCreateRakshakTask();
  const updateTask = useUpdateRakshakTask();
  const deleteTask = useDeleteRakshakTask();

  const [filter, setFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogColumn, setDialogColumn] = useState("todo");
  const [editingTask, setEditingTask] = useState<RakshakTask | null>(null);

  const filtered = useMemo(() => {
    if (!tasks) return [];
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.category === filter);
  }, [tasks, filter]);

  const byColumn = useMemo(() => {
    const map: Record<string, RakshakTask[]> = {};
    for (const col of COLUMNS) {
      map[col] = filtered.filter((t) => t.status === col);
    }
    return map;
  }, [filtered]);

  function handleMove(id: string, status: string) {
    updateTask.mutate({ id, status });
  }

  function handleDelete(id: string) {
    deleteTask.mutate(id);
  }

  function handleEdit(task: RakshakTask) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  function handleAdd(column: string) {
    setEditingTask(null);
    setDialogColumn(column);
    setDialogOpen(true);
  }

  function handleSubmit(data: {
    title: string;
    details: string;
    status: string;
    category: string;
    priority: number;
  }) {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, ...data });
    } else {
      createTask.mutate(data);
    }
    setEditingTask(null);
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <Kanban className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Rakshak Board
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Project task management for the Rakshak app
        </p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-2 flex-wrap"
      >
        <Filter className="h-4 w-4 text-muted-foreground" />
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            className={cn("capitalize text-xs", filter === cat && "shadow-md")}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </Button>
        ))}
      </motion.div>

      {/* Kanban columns */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col}
              column={col}
              tasks={byColumn[col] ?? []}
              onMove={handleMove}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onAdd={handleAdd}
            />
          ))}
        </motion.div>
      )}

      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        defaultColumn={dialogColumn}
        onSubmit={handleSubmit}
        editData={
          editingTask
            ? {
                title: editingTask.title,
                details: editingTask.details,
                status: editingTask.status,
                category: editingTask.category,
                priority: editingTask.priority,
              }
            : null
        }
      />
    </div>
  );
}
