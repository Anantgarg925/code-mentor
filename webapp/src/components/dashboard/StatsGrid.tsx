import { Target, Flame, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "./StatCard";
import type { DashboardData } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";

function MiniProgressRing({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="48" height="48" className="-rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="4"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-[10px] font-mono font-bold text-primary">
        {pct}%
      </span>
    </div>
  );
}

interface StatsGridProps {
  data: DashboardData | undefined;
  isLoading: boolean;
}

export function StatsGrid({ data, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] rounded-xl" />
        ))}
      </div>
    );
  }

  const topPattern = data?.patternMastery?.[0];
  const totalTarget = 300;

  const cards = [
    {
      key: "problems",
      el: (
        <StatCard
          icon={Target}
          label="Problems Solved"
          value={`${data?.problemsSolved ?? 0} / ${totalTarget}`}
          subtitle={`${Math.round(((data?.problemsSolved ?? 0) / totalTarget) * 100)}% of target`}
        >
          <MiniProgressRing value={data?.problemsSolved ?? 0} max={totalTarget} />
        </StatCard>
      ),
    },
    {
      key: "patterns",
      el: (
        <StatCard
          icon={TrendingUp}
          label="Pattern Mastery"
          value={
            topPattern
              ? `${topPattern.pattern}: ${Math.round(topPattern.avgConfidence * 20)}%`
              : "No data"
          }
          subtitle={
            topPattern
              ? `${topPattern.count} problems practiced`
              : "Solve problems to track patterns"
          }
        />
      ),
    },
    {
      key: "hours",
      el: (
        <StatCard
          icon={Clock}
          label="Weekly Hours"
          value="14h"
          subtitle="2h/day avg"
          trend={{ value: "+12%", positive: true }}
        />
      ),
    },
    {
      key: "streak",
      el: (
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={`${data?.stats?.currentStreak ?? 0} days`}
          subtitle="Keep the momentum going!"
        >
          <div className="flex gap-0.5">
            {Array.from({ length: Math.min(data?.stats?.currentStreak ?? 0, 7) }).map(
              (_, i) => (
                <Flame
                  key={i}
                  className="h-4 w-4 text-amber-400 fill-amber-400"
                />
              )
            )}
          </div>
        </StatCard>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 * i }}
        >
          {card.el}
        </motion.div>
      ))}
    </div>
  );
}
