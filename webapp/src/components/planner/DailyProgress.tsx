import { cn } from "@/lib/utils";

interface DailyProgressProps {
  completed: number;
  total: number;
}

export function DailyProgress({ completed, total }: DailyProgressProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="glass border-border/50 rounded-xl p-5 flex items-center gap-5">
      <div className="relative flex-shrink-0">
        <svg width="96" height="96" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 48 48)"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-xl font-bold font-mono", pct === 100 ? "text-primary" : "text-foreground")}>
            {pct}%
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Tasks completed</p>
        <p className="text-2xl font-bold font-mono text-foreground">
          {completed}
          <span className="text-muted-foreground text-base font-normal">
            {" "}/ {total}
          </span>
        </p>
        {pct === 100 ? (
          <p className="text-xs text-primary font-medium mt-1">All done for today!</p>
        ) : null}
      </div>
    </div>
  );
}
