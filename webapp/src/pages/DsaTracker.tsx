import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Code2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useProblems,
  useCreateProblem,
  useUpdateProblem,
  useDeleteProblem,
} from "@/hooks/use-api";
import type { DsaProblem } from "@/hooks/use-api";
import { FilterBar } from "@/components/dsa/FilterBar";
import { ProblemTable } from "@/components/dsa/ProblemTable";
import { ProblemDialog } from "@/components/dsa/ProblemDialog";
import { DsaCharts } from "@/components/dsa/DsaCharts";

export default function DsaTracker() {
  const [pattern, setPattern] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingProblem, setEditingProblem] = useState<DsaProblem | null>(null);

  // Build API filters (only pass non-All values)
  const apiFilters = useMemo(() => {
    const f: { pattern?: string; status?: string } = {};
    if (pattern !== "All") f.pattern = pattern;
    if (status !== "All") f.status = status;
    return f;
  }, [pattern, status]);

  const { data: problems, isLoading } = useProblems(apiFilters);
  const createMutation = useCreateProblem();
  const updateMutation = useUpdateProblem();
  const deleteMutation = useDeleteProblem();

  // Client-side filtering for difficulty and search
  const filteredProblems = useMemo(() => {
    if (!problems) return undefined;
    let result = problems;
    if (difficulty !== "All") {
      result = result.filter((p) => p.difficulty === difficulty);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.leetcodeNum?.toString() ?? "").includes(q)
      );
    }
    return result;
  }, [problems, difficulty, search]);

  // Stats
  const totalSolved = problems?.filter((p) => p.status === "Solved").length ?? 0;
  const uniquePatterns = new Set(problems?.map((p) => p.pattern) ?? []).size;

  function handleOpenAdd() {
    setEditingProblem(null);
    setDialogOpen(true);
  }

  function handleEdit(problem: DsaProblem) {
    setEditingProblem(problem);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id);
  }

  function handleSubmit(data: Partial<DsaProblem>) {
    if (editingProblem) {
      updateMutation.mutate(
        { id: editingProblem.id, ...data },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
            <Code2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              DSA Tracker
            </h1>
            <p className="text-sm text-muted-foreground">
              <span className="font-mono font-semibold text-foreground">{totalSolved}</span>{" "}
              problems solved across{" "}
              <span className="font-mono font-semibold text-foreground">{uniquePatterns}</span>{" "}
              patterns
            </p>
          </div>
        </div>
        <Button onClick={handleOpenAdd} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          Add Problem
        </Button>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <FilterBar
          pattern={pattern}
          status={status}
          difficulty={difficulty}
          search={search}
          onPatternChange={setPattern}
          onStatusChange={setStatus}
          onDifficultyChange={setDifficulty}
          onSearchChange={setSearch}
        />
      </motion.div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Problem Table (65%) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex-1 lg:w-[65%] min-w-0"
        >
          <ProblemTable
            problems={filteredProblems}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>

        {/* Right: Charts sidebar (35%) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="lg:w-[35%] shrink-0"
        >
          <DsaCharts problems={problems} isLoading={isLoading} />
        </motion.div>
      </div>

      {/* Add/Edit Dialog */}
      <ProblemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        problem={editingProblem}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
