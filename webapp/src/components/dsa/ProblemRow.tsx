import { Star, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { DsaProblem } from "@/hooks/use-api";

function getLeetcodeUrl(problem: DsaProblem): string {
  if (problem.leetcodeNum) {
    // Convert name to slug: "Two Sum" -> "two-sum"
    const slug = problem.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    return `https://leetcode.com/problems/${slug}/`;
  }
  // Fallback: search LeetCode for the problem name
  return `https://leetcode.com/problemset/?search=${encodeURIComponent(problem.name)}`;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

const STATUS_COLORS: Record<string, string> = {
  Solved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Revision: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Solving: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  NotStarted: "bg-muted text-muted-foreground border-border/50",
};

const PATTERN_COLORS: Record<string, string> = {
  HashMap: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  SlidingWindow: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Stack: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Heap: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  PrefixSum: "bg-lime-500/15 text-lime-400 border-lime-500/30",
  Greedy: "bg-sky-500/15 text-sky-400 border-sky-500/30",
};

function ConfidenceStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < value
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-muted-foreground/40"
          )}
        />
      ))}
    </div>
  );
}

interface ProblemRowProps {
  problem: DsaProblem;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ProblemRow({ problem, isExpanded, onToggle }: ProblemRowProps) {
  const diffColor = DIFFICULTY_COLORS[problem.difficulty] ?? DIFFICULTY_COLORS.Medium;
  const statusColor = STATUS_COLORS[problem.status] ?? STATUS_COLORS.NotStarted;
  const patternColor = PATTERN_COLORS[problem.pattern] ?? "bg-muted text-muted-foreground border-border/50";

  return (
    <TableRow
      className="cursor-pointer hover:bg-secondary/40 transition-colors"
      onClick={onToggle}
    >
      <TableCell className="font-mono text-xs text-muted-foreground w-[60px]">
        {problem.leetcodeNum ? (
          <a
            href={getLeetcodeUrl(problem)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-primary transition-colors"
          >
            #{problem.leetcodeNum}
          </a>
        ) : (
          "--"
        )}
      </TableCell>
      <TableCell className="font-medium text-sm max-w-[200px] truncate">
        <a
          href={getLeetcodeUrl(problem)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
        >
          {problem.name}
          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
        </a>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("text-xs border", patternColor)}>
          {problem.pattern === "SlidingWindow"
            ? "Sliding Window"
            : problem.pattern === "PrefixSum"
            ? "Prefix Sum"
            : problem.pattern}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("text-xs border", diffColor)}>
          {problem.difficulty}
        </Badge>
      </TableCell>
      <TableCell>
        <ConfidenceStars value={problem.confidence} />
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("text-xs border", statusColor)}>
          {problem.status === "NotStarted" ? "Not Started" : problem.status}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground font-mono">
        {problem.dateSolved
          ? new Date(problem.dateSolved).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "--"}
      </TableCell>
      <TableCell className="w-8">
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </TableCell>
    </TableRow>
  );
}
