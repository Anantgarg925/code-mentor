import { useState, useCallback } from "react";
import { Brain, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useMentorMessages,
  useSendMentorMessage,
  useDashboard,
  type MentorMessage,
} from "@/hooks/use-api";
import { ChatMessages } from "@/components/mentor/ChatMessages";
import { ChatInput } from "@/components/mentor/ChatInput";
import { ContextSidebar } from "@/components/mentor/ContextSidebar";

export default function AiMentor() {
  const isMobile = useIsMobile();
  const [sessionId] = useState<string | undefined>(undefined);
  const [optimisticMessages, setOptimisticMessages] = useState<MentorMessage[]>(
    []
  );

  const { data: messages = [] } = useMentorMessages(sessionId);
  const sendMessage = useSendMentorMessage();
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();

  // Merge server messages with optimistic ones (de-duplicate by id)
  const allMessages = [...messages];
  for (const opt of optimisticMessages) {
    if (!allMessages.some((m) => m.id === opt.id)) {
      allMessages.push(opt);
    }
  }

  // Sort by createdAt
  allMessages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const handleSend = useCallback(
    (text: string) => {
      // Optimistic user message
      const tempMsg: MentorMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        message: text,
        problemId: null,
        sessionId: sessionId ?? "default",
        createdAt: new Date().toISOString(),
      };
      setOptimisticMessages((prev) => [...prev, tempMsg]);

      sendMessage.mutate(
        { message: text, sessionId },
        {
          onSuccess: () => {
            setOptimisticMessages([]);
          },
          onError: () => {
            setOptimisticMessages((prev) =>
              prev.filter((m) => m.id !== tempMsg.id)
            );
          },
        }
      );
    },
    [sessionId, sendMessage]
  );

  const totalSolved = dashboard?.problemsSolved ?? 0;

  // Derive weak patterns from problems with low confidence
  const weakPatterns: string[] = [];
  if (dashboard?.revisionQueue) {
    const seen = new Set<string>();
    for (const p of dashboard.revisionQueue) {
      if (p.weakPoints && !seen.has(p.pattern)) {
        seen.add(p.pattern);
        weakPatterns.push(p.pattern);
      }
    }
  }

  return (
    <div className="flex h-full">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background">
                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-60" />
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight gradient-primary-text">
                AI Mentor
              </h1>
              <p className="text-xs text-muted-foreground">
                Your DSA coding companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Core Subjects auto-notes ON
            </span>

            {/* Mobile context toggle */}
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground"
                  >
                    <PanelRight className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] p-0">
                  <MobileContextContent
                    data={dashboard}
                    isLoading={dashboardLoading}
                  />
                </SheetContent>
              </Sheet>
            ) : null}
          </div>
        </div>

        {/* Messages */}
        <ChatMessages
          messages={allMessages}
          isThinking={sendMessage.isPending}
          totalSolved={totalSolved}
          onQuickPrompt={handleSend}
        />

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          isLoading={sendMessage.isPending}
          hasMessages={allMessages.length > 0}
        />
      </div>

      {/* Desktop context sidebar */}
      <ContextSidebar data={dashboard} isLoading={dashboardLoading} />
    </div>
  );
}

// Mobile-friendly version of context (rendered inside Sheet)
function MobileContextContent({
  data,
  isLoading,
}: {
  data: ReturnType<typeof useDashboard>["data"];
  isLoading: boolean;
}) {
  const stats = data?.stats;
  const recentProblems = data?.recentProblems?.slice(0, 5) ?? [];

  // Derive weak patterns from revision queue
  const weakPatterns: string[] = [];
  if (data?.revisionQueue) {
    const seen = new Set<string>();
    for (const p of data.revisionQueue) {
      if (p.weakPoints && !seen.has(p.pattern)) {
        seen.add(p.pattern);
        weakPatterns.push(p.pattern);
      }
    }
  }

  return (
    <div className="p-4 pt-8 space-y-5 overflow-y-auto h-full">
      <h3 className="text-sm font-semibold text-foreground mb-4">Context</h3>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Your Progress
        </h4>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-32 bg-secondary animate-pulse rounded" />
            <div className="h-4 w-24 bg-secondary animate-pulse rounded" />
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Problems Solved</span>
              <span className="font-semibold">{data?.problemsSolved ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Streak</span>
              <span className="font-semibold">{stats?.currentStreak ?? 0} days</span>
            </div>
          </div>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Weak Points
        </h4>
        {weakPatterns.length === 0 ? (
          <p className="text-xs text-muted-foreground">None identified yet.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {weakPatterns.map((pattern) => (
              <span
                key={pattern}
                className="text-xs px-2 py-0.5 rounded-full border border-destructive/30 text-destructive/80"
              >
                {pattern}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Recent Problems
        </h4>
        {recentProblems.length === 0 ? (
          <p className="text-xs text-muted-foreground">No problems solved yet.</p>
        ) : (
          <div className="space-y-1.5">
            {recentProblems.map((p) => (
              <div key={p.id} className="text-xs text-foreground/80">
                {p.name}{" "}
                <span className="text-muted-foreground">({p.pattern})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
