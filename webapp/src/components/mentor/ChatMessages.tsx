import { useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";
import { ChatBubble } from "./ChatBubble";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { QuickPrompts } from "./QuickPrompts";
import type { MentorMessage } from "@/hooks/use-api";

interface ChatMessagesProps {
  messages: MentorMessage[];
  isThinking: boolean;
  totalSolved: number;
  onQuickPrompt: (prompt: string) => void;
}

export function ChatMessages({
  messages,
  isThinking,
  totalSolved,
  onQuickPrompt,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isThinking]);

  if (messages.length === 0 && !isThinking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-6">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-lg font-semibold text-foreground">
            Ready to continue your DSA journey!
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You've solved{" "}
            <span className="text-primary font-medium">{totalSolved}</span>{" "}
            problems so far. Ask me about the next problem or review a concept.
          </p>
        </div>
        <QuickPrompts onSelect={onQuickPrompt} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4">
      <AnimatePresence mode="popLayout">
        {messages.map((msg, i) => (
          <ChatBubble key={msg.id} message={msg} index={i} />
        ))}
      </AnimatePresence>
      {isThinking ? <ThinkingIndicator /> : null}
      <div ref={bottomRef} />
    </div>
  );
}
