import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { PhaseCard, type PhaseData } from "@/components/roadmap/PhaseCard";
import { TimelineConnector } from "@/components/roadmap/TimelineConnector";
import { WeeklyBreakdown } from "@/components/roadmap/WeeklyBreakdown";

const PHASES: PhaseData[] = [
  {
    number: 1,
    title: "Foundation",
    weeks: "Week 1 - 4",
    weight: "40%",
    topics: [
      "HashMap",
      "HashSet",
      "Frequency Arrays",
      "Two Pointers",
      "Fixed Sliding Window",
      "Variable Sliding Window",
    ],
    status: "current",
    progress: 30,
  },
  {
    number: 2,
    title: "Intermediate",
    weeks: "Week 5 - 8",
    weight: "20%",
    topics: [
      "Monotonic Stack",
      "Priority Queue",
      "Linked List Manipulation",
      "Queue Patterns",
    ],
    status: "upcoming",
    progress: 0,
  },
  {
    number: 3,
    title: "Advanced",
    weeks: "Week 9 - 12",
    weight: "25%",
    topics: ["BST", "DFS", "BFS", "Graph Traversal", "Backtracking", "Trie"],
    status: "upcoming",
    progress: 0,
  },
  {
    number: 4,
    title: "Expert",
    weeks: "Week 13 - 15",
    weight: "15%",
    topics: [
      "1D DP",
      "2D DP",
      "Intervals",
      "Greedy",
      "Bit Manipulation",
    ],
    status: "upcoming",
    progress: 0,
  },
];

export default function Roadmap() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <Map className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Roadmap
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-mono text-foreground">15</span> week placement
          preparation timeline &mdash;{" "}
          <span className="font-mono text-foreground">300</span> problems across{" "}
          <span className="font-mono text-foreground">4</span> phases
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="space-y-0">
        {PHASES.map((phase, i) => (
          <div key={phase.number}>
            <PhaseCard phase={phase} index={i} />
            {i < PHASES.length - 1 ? (
              <TimelineConnector
                active={
                  phase.status === "current" ||
                  PHASES[i + 1].status === "current"
                }
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Weekly breakdown */}
      <WeeklyBreakdown />
    </div>
  );
}
