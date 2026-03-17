import { motion } from "framer-motion";
import { CheckCircle2, Clock, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PhaseData {
  number: number;
  title: string;
  weeks: string;
  weight: string;
  topics: string[];
  status: "completed" | "current" | "upcoming";
  progress: number;
}

interface PhaseCardProps {
  phase: PhaseData;
  index: number;
}

const STATUS_STYLE = {
  completed: {
    border: "border-emerald-500/30",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    badge: "bg-emerald-400/10 text-emerald-400",
    label: "Completed",
  },
  current: {
    border: "border-amber-400/40 glow-amber",
    icon: <Clock className="h-5 w-5 text-amber-400 animate-pulse" />,
    badge: "bg-amber-400/10 text-amber-400",
    label: "In Progress",
  },
  upcoming: {
    border: "border-border/50",
    icon: <Lock className="h-5 w-5 text-muted-foreground" />,
    badge: "bg-muted text-muted-foreground",
    label: "Upcoming",
  },
};

export function PhaseCard({ phase, index }: PhaseCardProps) {
  const style = STATUS_STYLE[phase.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "glass rounded-xl p-5 space-y-4 border",
        style.border,
        phase.status === "upcoming" && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {style.icon}
          <div>
            <h3 className="font-semibold text-foreground">
              Phase {phase.number}: {phase.title}
            </h3>
            <p className="text-xs text-muted-foreground">{phase.weeks}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">
            {phase.weight}
          </span>
          <Badge variant="outline" className={cn("text-xs", style.badge)}>
            {style.label}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {phase.topics.map((topic) => (
          <span
            key={topic}
            className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-mono">{phase.progress}%</span>
        </div>
        <Progress value={phase.progress} className="h-2" />
      </div>
    </motion.div>
  );
}
