import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SubjectOverviewProps {
  subjects: Array<{
    name: string;
    progress: number;
    color: string;
  }>;
}

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-400",
  green: "bg-emerald-400",
  amber: "bg-amber-400",
  purple: "bg-purple-400",
  red: "bg-red-400",
};

const TEXT_COLOR_MAP: Record<string, string> = {
  blue: "text-blue-400",
  green: "text-emerald-400",
  amber: "text-amber-400",
  purple: "text-purple-400",
  red: "text-red-400",
};

export function SubjectOverview({ subjects }: SubjectOverviewProps) {
  const avg =
    subjects.length > 0
      ? Math.round(
          subjects.reduce((s, sub) => s + sub.progress, 0) / subjects.length
        )
      : 0;

  return (
    <div className="glass border-border/50 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Overall Progress
        </h3>
        <span className="text-lg font-bold font-mono text-primary">{avg}%</span>
      </div>
      <div className="space-y-3">
        {subjects.map((sub) => (
          <div key={sub.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    COLOR_MAP[sub.color] ?? "bg-muted"
                  )}
                />
                <span className="text-xs text-foreground">{sub.name}</span>
              </div>
              <span
                className={cn(
                  "text-xs font-mono",
                  TEXT_COLOR_MAP[sub.color] ?? "text-muted-foreground"
                )}
              >
                {sub.progress}%
              </span>
            </div>
            <Progress value={sub.progress} className="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
