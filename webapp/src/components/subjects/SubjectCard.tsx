import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TopicItem } from "@/components/subjects/TopicItem";
import type { CoreSubjectTopic } from "@/hooks/use-api";

const SUBJECT_META: Record<
  string,
  { icon: LucideIcon; color: string; bgColor: string; textColor: string }
> = {
  OOP: {
    icon: Code2,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    textColor: "text-blue-400",
  },
  OS: {
    icon: Cpu,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    textColor: "text-emerald-400",
  },
  DB: {
    icon: Database,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    textColor: "text-amber-400",
  },
  Networks: {
    icon: Globe,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    textColor: "text-purple-400",
  },
  SystemDesign: {
    icon: Layers,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    textColor: "text-red-400",
  },
};

function getMeta(name: string) {
  // Direct match first
  if (SUBJECT_META[name]) return SUBJECT_META[name];
  // Partial match
  for (const [key, meta] of Object.entries(SUBJECT_META)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return meta;
  }
  return SUBJECT_META.OOP;
}

interface SubjectCardProps {
  subjectGroup: {
    name: string;
    topics: CoreSubjectTopic[];
    progress: number;
  };
  index: number;
  onUpdateTopic: (
    topicId: string,
    data: { progress?: number; notes?: string; completed?: boolean }
  ) => void;
}

export function SubjectCard({
  subjectGroup,
  index,
  onUpdateTopic,
}: SubjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = getMeta(subjectGroup.name);
  const Icon = meta.icon;

  const completedTopics = subjectGroup.topics.filter((t) => t.completed).length;
  const totalTopics = subjectGroup.topics.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass border-border/50 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-card/50 transition-colors"
      >
        <div className={cn("rounded-lg p-2.5", meta.bgColor)}>
          <Icon className={cn("h-5 w-5", meta.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {subjectGroup.name}
            </h3>
            <span className={cn("text-sm font-bold font-mono", meta.textColor)}>
              {subjectGroup.progress}%
            </span>
          </div>
          <Progress value={subjectGroup.progress} className="h-1.5" />
          <p className="text-[11px] text-muted-foreground mt-1.5">
            {completedTopics}/{totalTopics} topics completed
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
            expanded && "rotate-180"
          )}
        />
      </button>

      {expanded ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-4 pb-4 space-y-2 border-t border-border/30 pt-3"
        >
          {subjectGroup.topics.length > 0 ? (
            subjectGroup.topics.map((topic) => (
              <TopicItem
                key={topic.id}
                topic={topic}
                onUpdate={(topicId, data) => onUpdateTopic(topicId, data)}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              No topics added yet.
            </p>
          )}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
