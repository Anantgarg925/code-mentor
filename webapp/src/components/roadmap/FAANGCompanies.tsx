import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  abbr: string;
  color: string;
  borderColor: string;
  bgColor: string;
  rounds: string[];
  dsaFocus: string[];
  sdFocus: string[];
  behavioralFocus: string[];
  insiderTips: string[];
  difficulty: "Hard" | "Very Hard" | "Extreme";
  avgTimeline: string;
}

const COMPANIES: Company[] = [
  {
    id: "google",
    name: "Google",
    abbr: "G",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    bgColor: "bg-sky-400/10",
    difficulty: "Very Hard",
    avgTimeline: "6–8 weeks",
    rounds: [
      "1× Phone Screen (45 min DSA)",
      "5× Onsite: 2 DSA + 1 System Design + 1 Googleyness + 1 Leadership",
    ],
    dsaFocus: ["Graphs (BFS/DFS)", "Dynamic Programming", "Trees", "Bit Manipulation", "Hard LeetCode"],
    sdFocus: ["Search Engine Design", "Google Maps / Geo", "Distributed File System", "YouTube-scale video"],
    behavioralFocus: ["Googleyness (collaboration, humility)", "Ambiguity handling", "Failure + learning"],
    insiderTips: [
      "Code must be clean and compile in your head — no pseudocode",
      "Explain every thought out loud even when thinking",
      "LC Hard is common. Aim for 50+ LC Hards before applying",
      "System design: depth over breadth. Pick one component and go deep",
    ],
  },
  {
    id: "amazon",
    name: "Amazon",
    abbr: "A",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-400/10",
    difficulty: "Hard",
    avgTimeline: "4–6 weeks",
    rounds: [
      "1× Online Assessment (2 DSA problems, 90 min)",
      "1× Phone Screen (LP + DSA mix)",
      "5× Onsite Bar Raiser Loop: each has DSA + LP questions",
    ],
    dsaFocus: ["Arrays & Strings", "Trees & Graphs", "OOP Design", "LC Medium with edge cases"],
    sdFocus: ["Amazon-scale e-commerce", "Recommendation System", "Warehouse Management", "Ride Dispatch"],
    behavioralFocus: ["All 16 Leadership Principles", "Especially: Customer Obsession, Ownership, Disagree & Commit, Dive Deep"],
    insiderTips: [
      "Prepare 2 STAR stories per LP — 16 LPs = 32 stories minimum",
      "Bar Raiser is the hardest round — they can veto even if others passed",
      "OOP Low Level Design is separate: design Parking Lot, Library, Elevator",
      "Amazon cares MORE about LP than DSA at SDE-2+",
    ],
  },
  {
    id: "meta",
    name: "Meta",
    abbr: "M",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-400/10",
    difficulty: "Very Hard",
    avgTimeline: "4–6 weeks",
    rounds: [
      "1× Recruiter Screen",
      "2× Technical Phone Screens (DSA, 45 min each)",
      "4× Onsite: 2 DSA + 1 System Design + 1 Behavioral",
    ],
    dsaFocus: ["Arrays & Hashing", "Graphs", "Dynamic Programming", "Speed matters — LC Medium in 15min"],
    sdFocus: ["Social Graph Design", "News Feed Ranking", "Messenger Architecture", "Ad Targeting System"],
    behavioralFocus: ["Move fast, impact at scale", "Collaboration, initiative", "Handle failure gracefully"],
    insiderTips: [
      "Meta values speed — practice solving LC Medium in under 20 min",
      "Behavioral round: they want data, scale of impact, and initiative",
      "System Design: always discuss trade-offs, not just solutions",
      "They test two coding problems per round. Partial solutions count if approached well",
    ],
  },
  {
    id: "apple",
    name: "Apple",
    abbr: "Ap",
    color: "text-zinc-300",
    borderColor: "border-zinc-500/30",
    bgColor: "bg-zinc-400/10",
    difficulty: "Hard",
    avgTimeline: "6–10 weeks",
    rounds: [
      "1× Recruiter Screen",
      "1-2× Technical Screens (role-specific)",
      "6–8× Onsite: panel style, domain-specific coding",
    ],
    dsaFocus: ["Data Structures fundamentals", "Low-Level System Concepts", "Domain-specific (iOS, ML, Backend)"],
    sdFocus: ["Apple Pay architecture", "iCloud sync protocol", "Siri / ML pipeline", "Privacy-first system design"],
    behavioralFocus: ["Attention to detail, craft, quality", "Long-term ownership", "Cross-functional collaboration"],
    insiderTips: [
      "Apple interviews are very role-specific — research the team deeply",
      "Quality over speed — they value well-designed code",
      "Privacy and user trust are key design constraints in SD rounds",
      "Process takes longest of all FAANG — be patient with timeline",
    ],
  },
  {
    id: "netflix",
    name: "Netflix",
    abbr: "N",
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bgColor: "bg-rose-400/10",
    difficulty: "Extreme",
    avgTimeline: "6–8 weeks",
    rounds: [
      "1× Recruiter + Culture Screen",
      "1× Technical Screen",
      "5–6× Full-Day Onsite: system design heavy",
    ],
    dsaFocus: ["Less LC grind, more applied engineering", "Distributed systems concepts", "Streaming protocol knowledge"],
    sdFocus: ["Video Streaming CDN", "Recommendation Engine", "Chaos Engineering", "Microservices at scale"],
    behavioralFocus: ["Freedom & Responsibility culture", "High autonomy, high accountability", "Candor — say hard things"],
    insiderTips: [
      "Netflix is senior-focused — they rarely hire fresh grads",
      "Culture fit is as important as technical. Study 'Netflix Culture Doc'",
      "Expect deep dives into past projects — 'tell me how it really worked'",
      "Compensation is highest in FAANG — but bar is also highest",
    ],
  },
];

const DIFF_STYLE = {
  Hard: "text-amber-400 bg-amber-400/10",
  "Very Hard": "text-rose-400 bg-rose-400/10",
  Extreme: "text-fuchsia-400 bg-fuchsia-400/10",
};

const SECTION_LABELS = [
  { key: "dsaFocus" as const, label: "DSA Focus" },
  { key: "sdFocus" as const, label: "System Design Topics" },
  { key: "behavioralFocus" as const, label: "Behavioral Focus" },
  { key: "insiderTips" as const, label: "Insider Tips" },
];

export function FAANGCompanies() {
  const [openId, setOpenId] = useState<string | null>("google");

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
        <Building2 className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">Each FAANG company has a different style</p>
          <p className="text-xs text-muted-foreground mt-0.5">Apply to your target company last — use others for practice. Google/Meta = DSA heavy. Amazon = LP heavy. Netflix = Systems heavy.</p>
        </div>
      </div>

      {COMPANIES.map((co, i) => {
        const isOpen = openId === co.id;
        return (
          <motion.div
            key={co.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={cn("glass rounded-xl border overflow-hidden", isOpen ? co.borderColor : "border-border/50")}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : co.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black", co.bgColor, co.color)}>
                  {co.abbr}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{co.name}</span>
                    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", DIFF_STYLE[co.difficulty])}>
                      {co.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{co.rounds.length > 1 ? `${co.rounds.length} round types` : co.rounds[0]} · {co.avgTimeline}</p>
                </div>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4">
                    {/* Rounds */}
                    <div className="space-y-1">
                      <p className={cn("text-[10px] uppercase tracking-wider font-medium", co.color)}>Interview Rounds</p>
                      {co.rounds.map((r) => (
                        <div key={r} className="flex gap-2 items-start text-xs text-muted-foreground">
                          <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", co.bgColor.replace("/10", ""), `bg-current ${co.color}`)} />
                          {r}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SECTION_LABELS.map(({ key, label }) => (
                        <div key={key} className="rounded-lg bg-card/50 border border-border/50 p-3 space-y-2">
                          <p className={cn("text-[10px] uppercase tracking-wider font-medium", co.color)}>{label}</p>
                          {co[key].map((item) => (
                            <p key={item} className="text-xs text-muted-foreground leading-relaxed">• {item}</p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
