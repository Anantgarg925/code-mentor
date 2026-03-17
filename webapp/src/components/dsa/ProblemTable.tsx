import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProblemRow } from "./ProblemRow";
import { ProblemDetail } from "./ProblemDetail";
import type { DsaProblem } from "@/hooks/use-api";

interface ProblemTableProps {
  problems: DsaProblem[] | undefined;
  isLoading: boolean;
  onEdit: (problem: DsaProblem) => void;
  onDelete: (id: string) => void;
}

export function ProblemTable({
  problems,
  isLoading,
  onEdit,
  onDelete,
}: ProblemTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card className="glass border-border/50 overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  if (!problems || problems.length === 0) {
    return (
      <Card className="glass border-border/50 p-8 text-center">
        <p className="text-muted-foreground text-sm">
          No problems match your filters. Try adjusting or add a new problem.
        </p>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-xs font-semibold uppercase tracking-wider w-[60px]">
                #
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Pattern
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Difficulty
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Confidence
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Date
              </TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {problems.map((problem) => (
                <AnimatePresence key={problem.id}>
                  <ProblemRow
                    problem={problem}
                    isExpanded={expandedId === problem.id}
                    onToggle={() =>
                      setExpandedId(expandedId === problem.id ? null : problem.id)
                    }
                  />
                  {expandedId === problem.id ? (
                    <ProblemDetail
                      key={`detail-${problem.id}`}
                      problem={problem}
                      onEdit={() => onEdit(problem)}
                      onDelete={() => onDelete(problem.id)}
                    />
                  ) : null}
                </AnimatePresence>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
