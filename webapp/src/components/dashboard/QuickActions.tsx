import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Code2, BookOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Continue DSA",
    description: "Pick up where you left off",
    icon: Code2,
    to: "/mentor",
    color: "text-emerald-400 bg-emerald-400/10",
  },
  {
    label: "Today's Tasks",
    description: "View your daily plan",
    icon: BookOpen,
    to: "/planner",
    color: "text-blue-400 bg-blue-400/10",
  },
  {
    label: "Rakshak Board",
    description: "Track project progress",
    icon: Zap,
    to: "/rakshak",
    color: "text-amber-400 bg-amber-400/10",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 * i }}
        >
          <Link
            to={action.to}
            className={cn(
              "flex items-center gap-3 rounded-xl p-4 transition-all",
              "glass border-border/50 hover:border-primary/30",
              "hover:shadow-lg hover:shadow-primary/5"
            )}
          >
            <div className={cn("rounded-lg p-2.5", action.color)}>
              <action.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
