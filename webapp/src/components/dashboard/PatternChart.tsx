import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PatternMastery } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

function confidenceColor(avg: number): string {
  if (avg >= 4) return "bg-emerald-500";
  if (avg >= 2.5) return "bg-amber-500";
  return "bg-red-500";
}

function confidenceLabel(avg: number): string {
  if (avg >= 4) return "text-emerald-400";
  if (avg >= 2.5) return "text-amber-400";
  return "text-red-400";
}

interface PatternChartProps {
  patterns: PatternMastery[] | undefined;
  isLoading: boolean;
}

export function PatternChart({ patterns, isLoading }: PatternChartProps) {
  if (isLoading) {
    return (
      <Card className="glass border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...(patterns ?? []).map((p) => p.count), 1);

  return (
    <Card className="glass border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Pattern Mastery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {patterns && patterns.length > 0 ? (
          patterns.map((p, i) => {
            const widthPct = Math.max((p.count / maxCount) * 100, 8);
            const confidencePct = Math.round(p.avgConfidence * 20);
            return (
              <motion.div
                key={p.pattern}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {p.pattern}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono">
                      {p.count} solved
                    </span>
                    <span
                      className={cn(
                        "text-xs font-mono font-semibold",
                        confidenceLabel(p.avgConfidence)
                      )}
                    >
                      {confidencePct}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      confidenceColor(p.avgConfidence)
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.6, delay: 0.05 * i }}
                  />
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No pattern data yet. Start solving problems to see your mastery
            chart.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
