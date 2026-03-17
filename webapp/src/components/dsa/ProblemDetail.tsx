import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import type { DsaProblem } from "@/hooks/use-api";

interface ProblemDetailProps {
  problem: DsaProblem;
  onEdit: () => void;
  onDelete: () => void;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <p className="text-sm text-foreground/90 font-mono leading-relaxed">
        {value}
      </p>
    </div>
  );
}

export function ProblemDetail({ problem, onEdit, onDelete }: ProblemDetailProps) {
  const leetcodeUrl = problem.leetcodeNum
    ? `https://leetcode.com/problems/${problem.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")}/`
    : `https://leetcode.com/problemset/?search=${encodeURIComponent(problem.name)}`;

  return (
    <motion.tr
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
    >
      <td colSpan={7} className="p-0">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="px-4 pb-4 pt-1"
        >
          <Card className="glass border-border/50">
            <CardContent className="p-4 space-y-4">
              {problem.notes ? (
                <div className="rounded-lg bg-secondary/50 p-3 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Notes
                  </span>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {problem.notes}
                  </p>
                </div>
              ) : null}

              {problem.weakPoints ? (
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Weak Points
                  </span>
                  <p className="text-sm text-amber-200/90 leading-relaxed">
                    {problem.weakPoints}
                  </p>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DetailItem label="Core Idea" value={problem.coreIdea} />
                <DetailItem label="Key Line" value={problem.keyLine} />
                <DetailItem label="Edge Case" value={problem.edgeCase} />
                <DetailItem label="Time / Space" value={problem.timeSpace} />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  asChild
                >
                  <a href={leetcodeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Solve on LeetCode
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={onEdit}
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </td>
    </motion.tr>
  );
}
