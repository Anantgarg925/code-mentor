import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ChevronDown, Star, AlertCircle, Trophy, Users, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface BehavioralQ {
  id: string;
  question: string;
  category: string;
  star: { situation: string; task: string; action: string; result: string };
  tip: string;
}

const CATEGORIES = [
  { id: "leadership", label: "Leadership", icon: <Star className="h-3.5 w-3.5" />, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/30" },
  { id: "conflict", label: "Conflict", icon: <AlertCircle className="h-3.5 w-3.5" />, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-500/30" },
  { id: "achievement", label: "Achievement", icon: <Trophy className="h-3.5 w-3.5" />, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/30" },
  { id: "teamwork", label: "Teamwork", icon: <Users className="h-3.5 w-3.5" />, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-500/30" },
  { id: "failure", label: "Failure / Growth", icon: <Lightbulb className="h-3.5 w-3.5" />, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-500/30" },
];

const QUESTIONS: BehavioralQ[] = [
  {
    id: "l1", category: "leadership",
    question: "Tell me about a time you took initiative on a project.",
    star: {
      situation: "Your team was unclear about requirements for a feature, causing delays.",
      task: "No one was stepping up to clarify direction with stakeholders.",
      action: "You scheduled a sync with the PM, built a 1-page spec, and unblocked 3 engineers.",
      result: "Feature shipped 1 week early. Team adopted your spec process as a template.",
    },
    tip: "FAANG loves owners. Show you acted without being asked.",
  },
  {
    id: "l2", category: "leadership",
    question: "Describe a time you influenced a decision without authority.",
    star: {
      situation: "Your team was about to choose a technically risky architecture.",
      task: "You had concerns but no decision-making authority.",
      action: "You wrote a 1-pager comparing trade-offs, got senior eng buy-in, presented it.",
      result: "Team adopted your recommendation. System ran 3x more reliably.",
    },
    tip: "Use data and written proposals. Shows Amazon LP: Have Backbone.",
  },
  {
    id: "c1", category: "conflict",
    question: "Tell me about a time you disagreed with your manager.",
    star: {
      situation: "Manager wanted to rush a feature with known security gaps.",
      task: "You had to voice concerns without being insubordinate.",
      action: "You documented risks, quantified potential impact, proposed a phased release.",
      result: "Manager agreed to delay 2 weeks. No security incident. Trust increased.",
    },
    tip: "Show you disagreed respectfully and had data. Never bad-mouth the manager.",
  },
  {
    id: "c2", category: "conflict",
    question: "Describe a conflict with a teammate and how you resolved it.",
    star: {
      situation: "Teammate kept missing code review deadlines, blocking your PRs.",
      task: "Needed to resolve it without escalating to manager.",
      action: "Had a 1:1, understood their workload issue, agreed on a 24hr review SLA.",
      result: "Review turnaround improved by 60%. Better working relationship.",
    },
    tip: "Focus on resolution process, not blame. Shows empathy + problem-solving.",
  },
  {
    id: "a1", category: "achievement",
    question: "Tell me about your most impactful technical contribution.",
    star: {
      situation: "App had a 3s API response time causing user drop-off.",
      task: "Reduce latency with no additional infra cost.",
      action: "Profiled queries, added Redis cache layer, added DB indexes. 2-week effort.",
      result: "P99 latency dropped from 3s to 180ms. User retention improved 12%.",
    },
    tip: "Quantify everything. FAANG wants numbers: latency, cost, users, revenue.",
  },
  {
    id: "a2", category: "achievement",
    question: "Tell me about a time you delivered under pressure / tight deadline.",
    star: {
      situation: "Critical client demo in 3 days. 40% of features not built.",
      task: "Deliver a working demo without cutting corners on stability.",
      action: "Triaged to MVP features, worked focused 10-hr days, daily check-ins with PM.",
      result: "Demo succeeded. Client signed contract worth ₹2Cr. Zero post-demo bugs.",
    },
    tip: "Show prioritization and calm under pressure — key for L5+ roles.",
  },
  {
    id: "t1", category: "teamwork",
    question: "Tell me about a time you helped a struggling teammate.",
    star: {
      situation: "Junior teammate was stuck on a hard bug for 2 days, losing confidence.",
      task: "Help them without just solving it for them.",
      action: "Pair-programmed for 1 hour, taught debugging strategy, not just the fix.",
      result: "Bug fixed. Teammate solved the next 3 bugs independently.",
    },
    tip: "Shows mentorship ability — valued at every FAANG level.",
  },
  {
    id: "t2", category: "teamwork",
    question: "Describe a time you had to work with a difficult person.",
    star: {
      situation: "Cross-team member was unresponsive, blocking an API integration.",
      task: "Get unblocked without creating organizational drama.",
      action: "Found their priority concern (breaking their API), addressed it proactively, reframed ask.",
      result: "Got response within a day. Integration shipped on schedule.",
    },
    tip: "Empathy first — understand their constraint before judging.",
  },
  {
    id: "f1", category: "failure",
    question: "Tell me about a mistake you made and what you learned.",
    star: {
      situation: "You deployed a config change that caused a 2-hour outage.",
      task: "Own the mistake and fix it quickly.",
      action: "Immediate rollback, RCA within 24hrs, added config validation + staging gate.",
      result: "No repeat incidents. New process adopted team-wide.",
    },
    tip: "Don't minimize the failure. Show ownership + systemic fix, not just apology.",
  },
  {
    id: "f2", category: "failure",
    question: "Tell me about a time a project you led failed.",
    star: {
      situation: "Led a 3-month microservice migration that was cancelled mid-way.",
      task: "Handle the cancellation and recover team morale.",
      action: "Did a project retrospective, documented learnings, pivoted to a smaller win.",
      result: "Team adopted two process improvements. Next project shipped on time.",
    },
    tip: "Failures that show learning are more impressive than easy wins.",
  },
];

const STAR_LABELS = [
  { key: "situation" as const, label: "S", color: "text-sky-400 bg-sky-400/10" },
  { key: "task" as const, label: "T", color: "text-violet-400 bg-violet-400/10" },
  { key: "action" as const, label: "A", color: "text-amber-400 bg-amber-400/10" },
  { key: "result" as const, label: "R", color: "text-emerald-400 bg-emerald-400/10" },
];

export function BehavioralBank() {
  const [activeCategory, setActiveCategory] = useState("leadership");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = QUESTIONS.filter((q) => q.category === activeCategory);
  const cat = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <MessageSquare className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">Use the STAR method for every answer</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            <span className="text-sky-400">Situation</span> → <span className="text-violet-400">Task</span> → <span className="text-amber-400">Action</span> → <span className="text-emerald-400">Result</span> — keep answers under 2 minutes. Quantify results always.
          </p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => { setActiveCategory(c.id); setOpenId(null); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
              activeCategory === c.id
                ? cn(c.bg, c.color, c.border)
                : "bg-card/50 text-muted-foreground border-border/50 hover:text-foreground"
            )}
          >
            {c.icon}
            {c.label}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-2">
        {filtered.map((q) => {
          const isOpen = openId === q.id;
          return (
            <motion.div
              key={q.id}
              layout
              className={cn("glass rounded-xl border overflow-hidden", isOpen ? cat.border : "border-border/50")}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : q.id)}
                className="w-full flex items-start justify-between p-4 text-left gap-3"
              >
                <p className="text-sm text-foreground font-medium">{q.question}</p>
                <ChevronDown
                  className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0 mt-0.5", isOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      <div className="space-y-2">
                        {STAR_LABELS.map(({ key, label, color }) => (
                          <div key={key} className="flex gap-3">
                            <span className={cn("shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold", color)}>
                              {label}
                            </span>
                            <p className="text-xs text-muted-foreground leading-relaxed">{q.star[key]}</p>
                          </div>
                        ))}
                      </div>
                      <div className={cn("flex gap-2 rounded-lg p-3 text-xs border", cat.bg, cat.border)}>
                        <span className={cn("font-semibold shrink-0", cat.color)}>Tip:</span>
                        <span className="text-foreground">{q.tip}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
