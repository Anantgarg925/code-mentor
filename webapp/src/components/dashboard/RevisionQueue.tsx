import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DsaProblem } from "@/hooks/use-api";

function ConfidenceStars({ confidence }: { confidence: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < confidence
              ? "text-amber-400 fill-amber-400"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

interface RevisionQueueProps {
  problems: DsaProblem[] | undefined;
  isLoading: boolean;
}

export function RevisionQueue({ problems, isLoading }: RevisionQueueProps) {
  const count = problems?.length ?? 0;

  if (isLoading) {
    return (
      <Card className="glass border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <CardTitle className="text-base font-semibold">
            Revision Queue
          </CardTitle>
          {count > 0 ? (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary/15 border border-primary/25 text-[10px] font-mono font-bold text-primary">
              {count}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {problems && problems.length > 0 ? (
          <div className="space-y-2">
            {problems.map((problem, i) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
              >
                <Link
                  to="/dsa"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {problem.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-primary/10 text-primary border-primary/20"
                      >
                        {problem.pattern}
                      </Badge>
                      <ConfidenceStars confidence={problem.confidence} />
                    </div>
                    {problem.weakPoints ? (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {problem.weakPoints}
                      </p>
                    ) : null}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No problems need revision right now. Great work!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
