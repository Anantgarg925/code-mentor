import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Code2, BookOpen, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Continue DSA",
    description: "Pick up where you left off",
    icon: Code2,
    to: "/mentor",
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/20 hover:border-emerald-400/40",
  },
  {
    label: "Today's Tasks",
    description: "View your daily plan",
    icon: BookOpen,
    to: "/planner",
    iconColor: "text-blue-400",
    bgColor: "bg-blue-400/10 border-blue-400/20 hover:border-blue-400/40",
  },
  {
    label: "Rakshak Board",
    description: "Track project progress",
    icon: Zap,
    to: "/rakshak",
    iconColor: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/20 hover:border-amber-400/40",
  },
];

export function QuickActions() {
  return (
    <div className="flex flex-row gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 * i }}
          className="shrink-0"
        >
          <Link
            to={action.to}
            className={cn(
              "flex items-center gap-3 rounded-full px-4 py-2.5 border transition-all duration-150",
              "hover:scale-[1.02] hover:shadow-lg",
              action.bgColor
            )}
          >
            <action.icon className={cn("h-4 w-4 shrink-0", action.iconColor)} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
                {action.description}
              </p>
            </div>
            <ArrowRight className={cn("h-3.5 w-3.5 shrink-0 opacity-60", action.iconColor)} />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
