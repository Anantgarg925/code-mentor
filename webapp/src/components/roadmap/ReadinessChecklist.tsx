import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Square, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckItem {
  id: string;
  label: string;
  detail?: string;
}

interface CheckSection {
  id: string;
  title: string;
  color: string;
  border: string;
  bg: string;
  items: CheckItem[];
}

const SECTIONS: CheckSection[] = [
  {
    id: "dsa",
    title: "DSA Readiness",
    color: "text-sky-400",
    border: "border-sky-500/20",
    bg: "bg-sky-400/5",
    items: [
      { id: "d1", label: "Solved 150+ LeetCode problems", detail: "At least 100 Medium, 20+ Hard" },
      { id: "d2", label: "Solved all core patterns", detail: "Sliding Window, Two Pointers, BFS/DFS, DP, Backtracking" },
      { id: "d3", label: "Can solve LC Medium in under 25 min", detail: "Timed practice, not just solving" },
      { id: "d4", label: "Reviewed and revised all wrong answers", detail: "Spaced repetition of failed problems" },
      { id: "d5", label: "Completed at least 2 mock coding interviews", detail: "Pramp, Interviewing.io, or peer mock" },
    ],
  },
  {
    id: "sd",
    title: "System Design Readiness",
    color: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-400/5",
    items: [
      { id: "s1", label: "Completed System Design Primer or equivalent", detail: "github.com/donnemartin/system-design-primer" },
      { id: "s2", label: "Designed 5+ real systems end-to-end", detail: "YouTube, WhatsApp, Uber, Twitter Feed, URL Shortener" },
      { id: "s3", label: "Understand CAP theorem and trade-offs", detail: "Can explain consistency vs availability" },
      { id: "s4", label: "Know caching, queuing, and DB sharding deeply", detail: "Redis, Kafka, consistent hashing" },
      { id: "s5", label: "Done 2+ timed mock SD interviews", detail: "45 min format like real FAANG interview" },
    ],
  },
  {
    id: "behavioral",
    title: "Behavioral Readiness",
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-400/5",
    items: [
      { id: "b1", label: "Prepared 10+ STAR stories", detail: "Leadership, conflict, achievement, failure, teamwork" },
      { id: "b2", label: "Memorised Amazon's 16 Leadership Principles", detail: "Required for Amazon, useful for all FAANG" },
      { id: "b3", label: "Each story has a quantified result", detail: "% improvement, users impacted, time saved, etc." },
      { id: "b4", label: "Practiced answering out loud", detail: "Record yourself or do peer mock" },
      { id: "b5", label: "Can answer 'Why this company?' convincingly", detail: "Research team, products, values" },
    ],
  },
  {
    id: "resume",
    title: "Resume & Application",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-400/5",
    items: [
      { id: "r1", label: "Resume is 1 page, clean, ATS-friendly", detail: "Use Jake's Resume template on Overleaf" },
      { id: "r2", label: "Each bullet has impact metric", detail: "'Reduced latency by 40%' not 'Worked on backend'" },
      { id: "r3", label: "LinkedIn is fully updated and consistent", detail: "Matches resume, has recommendations" },
      { id: "r4", label: "GitHub has 3+ good public projects", detail: "With README, deployed, clean code" },
      { id: "r5", label: "Applied via referral where possible", detail: "Referrals have 5–10× higher callback rate" },
    ],
  },
  {
    id: "mindset",
    title: "Interview Mindset",
    color: "text-rose-400",
    border: "border-rose-500/20",
    bg: "bg-rose-400/5",
    items: [
      { id: "m1", label: "Always think out loud during coding", detail: "Interviewers grade process, not just answer" },
      { id: "m2", label: "Clarify constraints before coding", detail: "Input size, edge cases, return type" },
      { id: "m3", label: "Start with brute force, then optimize", detail: "Shows structured thinking" },
      { id: "m4", label: "Practice on paper / whiteboard", detail: "No autocomplete in real interviews" },
      { id: "m5", label: "Have 3 smart questions ready for interviewers", detail: "About team, technical challenges, growth" },
    ],
  },
];

export function ReadinessChecklist() {
  const STORAGE_KEY = "faang-checklist-v1";
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; }
  })();
  const [checked, setChecked] = useState<Record<string, boolean>>(saved);

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const allItems = SECTIONS.flatMap((s) => s.items);
  const doneCount = allItems.filter((i) => checked[i.id]).length;
  const pct = Math.round((doneCount / allItems.length) * 100);

  return (
    <div className="space-y-4">
      {/* Progress overview */}
      <div className="p-4 rounded-xl glass border border-border/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Overall Readiness</span>
          </div>
          <span className="text-lg font-mono font-bold text-foreground">{pct}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {doneCount} of {allItems.length} items completed
          {pct >= 80 ? " — You're ready to apply! 🎯" : pct >= 50 ? " — Good progress, keep going" : " — Keep building the foundation"}
        </p>
      </div>

      {SECTIONS.map((section, si) => {
        const sectionDone = section.items.filter((i) => checked[i.id]).length;
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.07 }}
            className={cn("glass rounded-xl border p-4 space-y-3", section.border)}
          >
            <div className="flex items-center justify-between">
              <div className={cn("flex items-center gap-2 text-sm font-semibold", section.color)}>
                {section.title}
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {sectionDone}/{section.items.length}
              </span>
            </div>

            <div className="space-y-2">
              {section.items.map((item) => {
                const done = !!checked[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-start gap-3 text-left p-2 rounded-lg hover:bg-card/50 transition-colors"
                  >
                    {done
                      ? <CheckSquare className={cn("h-4 w-4 mt-0.5 shrink-0", section.color)} />
                      : <Square className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    }
                    <div>
                      <p className={cn("text-sm", done ? "line-through text-muted-foreground" : "text-foreground")}>
                        {item.label}
                      </p>
                      {item.detail && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
