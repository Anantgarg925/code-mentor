import { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubjects, useUpdateSubject, type CoreSubjectTopic } from "@/hooks/use-api";
import { SubjectOverview } from "@/components/subjects/SubjectOverview";
import { SubjectCard } from "@/components/subjects/SubjectCard";

const COLOR_BY_NAME: Record<string, string> = {
  oop: "blue",
  os: "green",
  db: "amber",
  database: "amber",
  networks: "purple",
  networking: "purple",
  "system design": "red",
  systemdesign: "red",
};

function colorFor(name: string) {
  const lower = name.toLowerCase();
  for (const [key, color] of Object.entries(COLOR_BY_NAME)) {
    if (lower.includes(key)) return color;
  }
  return "blue";
}

// Backend returns Record<string, CoreSubjectTopic[]> grouped by subject name
interface SubjectGroup {
  name: string;
  topics: CoreSubjectTopic[];
  progress: number;
}

export default function CoreSubjects() {
  const { data: subjectsMap, isLoading } = useSubjects();
  const updateSubject = useUpdateSubject();

  // Transform grouped data into array of subject groups
  const subjectGroups: SubjectGroup[] = useMemo(() => {
    if (!subjectsMap) return [];
    return Object.entries(subjectsMap).map(([name, topics]) => {
      const completedCount = topics.filter((t) => t.completed).length;
      const avgProgress =
        topics.length > 0
          ? Math.round(topics.reduce((s, t) => s + t.progress, 0) / topics.length)
          : 0;
      return {
        name,
        topics,
        progress: completedCount > 0 ? Math.round((completedCount / topics.length) * 100) : avgProgress,
      };
    });
  }, [subjectsMap]);

  const overviewData = useMemo(() => {
    return subjectGroups.map((s) => ({
      name: s.name,
      progress: s.progress,
      color: colorFor(s.name),
    }));
  }, [subjectGroups]);

  function handleUpdateTopic(
    topicId: string,
    data: { progress?: number; notes?: string; completed?: boolean }
  ) {
    updateSubject.mutate({ id: topicId, ...data });
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Core Subjects
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Track your progress across 5 core CS subjects for interviews
        </p>
      </motion.div>

      {/* Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {isLoading ? (
          <Skeleton className="h-48 rounded-xl" />
        ) : subjectGroups.length > 0 ? (
          <SubjectOverview subjects={overviewData} />
        ) : null}
      </motion.div>

      {/* Subject cards */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))
        ) : subjectGroups.length > 0 ? (
          subjectGroups.map((group, i) => (
            <SubjectCard
              key={group.name}
              subjectGroup={group}
              index={i}
              onUpdateTopic={handleUpdateTopic}
            />
          ))
        ) : (
          <div className="glass border-border/50 rounded-xl p-10 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No subjects found yet.</p>
            <p className="text-xs text-muted-foreground">
              Subjects will appear once they are created from the backend.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
