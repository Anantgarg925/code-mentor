import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  children?: React.ReactNode;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  children,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("glass border-border/50 overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {label}
            </span>
          </div>
          {trend ? (
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                trend.positive
                  ? "text-emerald-400 bg-emerald-400/10"
                  : "text-red-400 bg-red-400/10"
              )}
            >
              {trend.value}
            </span>
          ) : null}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
            {value}
          </p>
          {subtitle ? (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          ) : null}
        </div>
        {children ? <div className="mt-3">{children}</div> : null}
      </CardContent>
    </Card>
  );
}
