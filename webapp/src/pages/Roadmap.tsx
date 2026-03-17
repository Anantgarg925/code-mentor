import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Code2, Server, MessageSquare, Building2, ClipboardList } from "lucide-react";
import { PhaseCard, type PhaseData } from "@/components/roadmap/PhaseCard";
import { TimelineConnector } from "@/components/roadmap/TimelineConnector";
import { WeeklyBreakdown } from "@/components/roadmap/WeeklyBreakdown";
import { SystemDesignRoadmap } from "@/components/roadmap/SystemDesignRoadmap";
import { BehavioralBank } from "@/components/roadmap/BehavioralBank";
import { FAANGCompanies } from "@/components/roadmap/FAANGCompanies";
import { ReadinessChecklist } from "@/components/roadmap/ReadinessChecklist";
import { cn } from "@/lib/utils";

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

type TabId = "dsa" | "systemdesign" | "behavioral" | "companies" | "checklist";

interface Tab {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: "dsa", label: "DSA Roadmap", shortLabel: "DSA", icon: <Code2 className="h-3.5 w-3.5" /> },
  { id: "systemdesign", label: "System Design", shortLabel: "SD", icon: <Server className="h-3.5 w-3.5" /> },
  { id: "behavioral", label: "Behavioral", shortLabel: "BQ", icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { id: "companies", label: "FAANG Guide", shortLabel: "FAANG", icon: <Building2 className="h-3.5 w-3.5" /> },
  { id: "checklist", label: "Readiness", shortLabel: "Check", icon: <ClipboardList className="h-3.5 w-3.5" /> },
];

export default function Roadmap() {
  const [activeTab, setActiveTab] = useState<TabId>("dsa");

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
            FAANG Roadmap
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete placement prep — DSA · System Design · Behavioral · Company Guides · Readiness Check
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex gap-1.5 p-1 bg-card/60 border border-border/50 rounded-xl overflow-x-auto"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === "dsa" && (
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
            <div className="pt-4">
              <WeeklyBreakdown />
            </div>
          </div>
        )}

        {activeTab === "systemdesign" && <SystemDesignRoadmap />}
        {activeTab === "behavioral" && <BehavioralBank />}
        {activeTab === "companies" && <FAANGCompanies />}
        {activeTab === "checklist" && <ReadinessChecklist />}
      </motion.div>
    </div>
  );
}
