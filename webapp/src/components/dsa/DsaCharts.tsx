import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DsaProblem } from "@/hooks/use-api";

const PATTERN_COLORS: Record<string, string> = {
  HashMap: "#8b5cf6",
  SlidingWindow: "#06b6d4",
  Stack: "#f97316",
  Heap: "#ec4899",
  PrefixSum: "#84cc16",
  Greedy: "#0ea5e9",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "#10b981",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

interface DsaChartsProps {
  problems: DsaProblem[] | undefined;
  isLoading: boolean;
}

function PatternDonut({ problems }: { problems: DsaProblem[] }) {
  const counts: Record<string, number> = {};
  problems.forEach((p) => {
    counts[p.pattern] = (counts[p.pattern] ?? 0) + 1;
  });

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = problems.length || 1;
  const radius = 50;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
        {entries.map(([pattern, count]) => {
          const pct = count / total;
          const dashLen = pct * circumference;
          const dashGap = circumference - dashLen;
          const currentOffset = offset;
          offset += dashLen;

          return (
            <motion.circle
              key={pattern}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={PATTERN_COLORS[pattern] ?? "#6b7280"}
              strokeWidth={stroke}
              strokeDasharray={`${dashLen} ${dashGap}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
        <text
          x="70"
          y="70"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground text-2xl font-bold"
          transform="rotate(90 70 70)"
          style={{ fontSize: "24px", fontWeight: 700 }}
        >
          {total}
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {entries.map(([pattern, count]) => (
          <div key={pattern} className="flex items-center gap-1.5 text-xs">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: PATTERN_COLORS[pattern] ?? "#6b7280" }}
            />
            <span className="text-muted-foreground">
              {pattern === "SlidingWindow" ? "Sliding Win" : pattern === "PrefixSum" ? "Prefix Sum" : pattern}
            </span>
            <span className="font-mono font-semibold text-foreground">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DifficultyBars({ problems }: { problems: DsaProblem[] }) {
  const counts: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 };
  problems.forEach((p) => {
    if (counts[p.difficulty] !== undefined) {
      counts[p.difficulty]++;
    }
  });
  const max = Math.max(...Object.values(counts), 1);

  return (
    <div className="space-y-2.5">
      {(["Easy", "Medium", "Hard"] as const).map((diff) => (
        <div key={diff} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{diff}</span>
            <span className="font-mono font-semibold" style={{ color: DIFFICULTY_COLORS[diff] }}>
              {counts[diff]}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: DIFFICULTY_COLORS[diff] }}
              initial={{ width: 0 }}
              animate={{ width: `${(counts[diff] / max) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfidenceDistribution({ problems }: { problems: DsaProblem[] }) {
  const buckets = [0, 0, 0, 0, 0];
  problems.forEach((p) => {
    const idx = Math.min(Math.max(p.confidence - 1, 0), 4);
    buckets[idx]++;
  });
  const max = Math.max(...buckets, 1);

  const colors = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981"];

  return (
    <div className="flex items-end justify-between gap-2 h-20">
      {buckets.map((count, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            className="w-full rounded-t-sm"
            style={{ backgroundColor: colors[i] }}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max((count / max) * 64, 4)}px` }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          />
          <span className="text-[10px] font-mono text-muted-foreground">
            {i + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DsaCharts({ problems, isLoading }: DsaChartsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="glass border-border/50">
          <CardHeader><Skeleton className="h-5 w-36" /></CardHeader>
          <CardContent><Skeleton className="h-[140px] w-full rounded" /></CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardHeader><Skeleton className="h-5 w-36" /></CardHeader>
          <CardContent><Skeleton className="h-20 w-full rounded" /></CardContent>
        </Card>
      </div>
    );
  }

  const list = problems ?? [];

  return (
    <div className="space-y-4">
      <Card className="glass border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Pattern Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {list.length > 0 ? (
            <PatternDonut problems={list} />
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">
              No data yet
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Difficulty Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <DifficultyBars problems={list} />
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Confidence Levels</CardTitle>
        </CardHeader>
        <CardContent>
          {list.length > 0 ? (
            <ConfidenceDistribution problems={list} />
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">
              No data yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
