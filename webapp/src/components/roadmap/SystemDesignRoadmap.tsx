import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Server, Database, Zap, GitBranch, Globe, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface SDPhase {
  id: number;
  icon: React.ReactNode;
  title: string;
  weeks: string;
  timePerDay: string;
  color: string;
  borderColor: string;
  iconBg: string;
  topics: { name: string; detail: string }[];
  resources: string[];
  milestone: string;
}

const SD_PHASES: SDPhase[] = [
  {
    id: 1,
    icon: <Layers className="h-4 w-4" />,
    title: "Networking & Basics",
    weeks: "Week 1–2",
    timePerDay: "45 min/day",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    iconBg: "bg-sky-400/10",
    milestone: "Explain how a URL request flows from browser to server",
    topics: [
      { name: "HTTP/HTTPS & REST", detail: "Status codes, methods, headers, TLS handshake" },
      { name: "DNS Resolution", detail: "How domain → IP works, TTL, CDN edge" },
      { name: "TCP vs UDP", detail: "When to use each, 3-way handshake" },
      { name: "Load Balancers", detail: "L4 vs L7, round-robin, least-connections" },
      { name: "CDN Basics", detail: "Edge caching, cache-control, origin pull" },
    ],
    resources: ["Cloudflare Learning Center", "High Scalability Blog"],
  },
  {
    id: 2,
    icon: <Database className="h-4 w-4" />,
    title: "Databases & Storage",
    weeks: "Week 3–4",
    timePerDay: "45 min/day",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    iconBg: "bg-violet-400/10",
    milestone: "Design a URL shortener with the right DB choice",
    topics: [
      { name: "SQL vs NoSQL", detail: "ACID vs BASE, when to choose which" },
      { name: "Indexing & Query Opt", detail: "B-Tree index, composite index, explain plans" },
      { name: "Sharding & Partitioning", detail: "Horizontal vs vertical, consistent hashing" },
      { name: "Replication", detail: "Master-replica, multi-master, lag handling" },
      { name: "Blob Storage", detail: "S3-style object storage, presigned URLs" },
    ],
    resources: ["Use The Index, Luke", "Designing Data-Intensive Apps (Ch 1–3)"],
  },
  {
    id: 3,
    icon: <Zap className="h-4 w-4" />,
    title: "Caching & Performance",
    weeks: "Week 5–6",
    timePerDay: "45 min/day",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    iconBg: "bg-amber-400/10",
    milestone: "Design a leaderboard that handles 10M reads/day",
    topics: [
      { name: "Redis Deep Dive", detail: "Strings, Sorted Sets, Pub/Sub, TTL policies" },
      { name: "Cache Strategies", detail: "Write-through, write-behind, cache-aside" },
      { name: "Cache Invalidation", detail: "TTL, event-driven invalidation, stampede" },
      { name: "Rate Limiting", detail: "Token bucket, sliding window, Redis implementation" },
      { name: "Connection Pooling", detail: "DB pool sizing, idle timeouts" },
    ],
    resources: ["Redis Documentation", "System Design Primer – Cache section"],
  },
  {
    id: 4,
    icon: <GitBranch className="h-4 w-4" />,
    title: "Messaging & Async",
    weeks: "Week 7–8",
    timePerDay: "45 min/day",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    iconBg: "bg-emerald-400/10",
    milestone: "Design a notification system for 100M users",
    topics: [
      { name: "Message Queues", detail: "Kafka vs RabbitMQ vs SQS, consumer groups" },
      { name: "Event-Driven Design", detail: "Producer-consumer, fan-out, dead letter queues" },
      { name: "WebSockets & SSE", detail: "Real-time updates, heartbeat, reconnect logic" },
      { name: "Idempotency", detail: "At-least-once vs exactly-once, idempotency keys" },
      { name: "Saga Pattern", detail: "Distributed transactions without 2PC" },
    ],
    resources: ["Kafka Documentation", "Designing Data-Intensive Apps (Ch 11)"],
  },
  {
    id: 5,
    icon: <Server className="h-4 w-4" />,
    title: "Scalability Patterns",
    weeks: "Week 9–10",
    timePerDay: "1 hr/day",
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    iconBg: "bg-rose-400/10",
    milestone: "Design Twitter feed with fan-out on write vs read",
    topics: [
      { name: "Microservices vs Monolith", detail: "When to split, API gateway, service mesh" },
      { name: "Consistent Hashing", detail: "Virtual nodes, hot spots, rebalancing" },
      { name: "Distributed Locks", detail: "Redlock, Zookeeper, fencing tokens" },
      { name: "CAP & PACELC", detail: "Trade-offs in distributed systems" },
      { name: "Circuit Breaker", detail: "Bulkhead, retry with backoff, timeout strategies" },
    ],
    resources: ["Martin Fowler Patterns", "AWS Architecture Blog"],
  },
  {
    id: 6,
    icon: <Globe className="h-4 w-4" />,
    title: "Real System Design",
    weeks: "Week 11–15",
    timePerDay: "1 mock/day",
    color: "text-fuchsia-400",
    borderColor: "border-fuchsia-500/30",
    iconBg: "bg-fuchsia-400/10",
    milestone: "Whiteboard 5 FAANG-level designs end-to-end in 45min each",
    topics: [
      { name: "Design YouTube", detail: "Video upload, transcoding pipeline, CDN delivery" },
      { name: "Design WhatsApp", detail: "Message storage, delivery receipts, E2E encryption" },
      { name: "Design Uber", detail: "Geo-indexing, matching, surge pricing" },
      { name: "Design Google Drive", detail: "Chunking, dedup, sync protocol" },
      { name: "Design Instagram Feed", detail: "Fan-out, media storage, ranking" },
    ],
    resources: ["Grokking System Design", "ByteByteGo Newsletter"],
  },
];

export function SystemDesignRoadmap() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
        <div className="text-violet-400 mt-0.5">
          <Server className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">System Design is 40-60% of FAANG interviews</p>
          <p className="text-xs text-muted-foreground mt-0.5">Start from Week 3 alongside DSA. 45 min/day is enough — consistency beats cramming.</p>
        </div>
      </div>

      {SD_PHASES.map((phase, i) => {
        const isOpen = openId === phase.id;
        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={cn("glass rounded-xl border overflow-hidden", phase.borderColor)}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : phase.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={cn("p-1.5 rounded-lg", phase.iconBg, phase.color)}>
                  {phase.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{phase.title}</span>
                    <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded", phase.iconBg, phase.color)}>
                      {phase.weeks}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{phase.timePerDay}</p>
                </div>
              </div>
              <ChevronDown
                className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")}
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
                  <div className="px-4 pb-4 space-y-4">
                    <div className="space-y-2">
                      {phase.topics.map((t) => (
                        <div key={t.name} className="flex gap-2 text-sm">
                          <span className={cn("font-medium shrink-0 w-44", phase.color)}>{t.name}</span>
                          <span className="text-muted-foreground text-xs leading-relaxed">{t.detail}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 rounded-lg bg-card/50 border border-border/50 p-3 space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Milestone</p>
                        <p className="text-xs text-foreground">{phase.milestone}</p>
                      </div>
                      <div className="flex-1 rounded-lg bg-card/50 border border-border/50 p-3 space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Resources</p>
                        {phase.resources.map((r) => (
                          <p key={r} className="text-xs text-foreground">{r}</p>
                        ))}
                      </div>
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
