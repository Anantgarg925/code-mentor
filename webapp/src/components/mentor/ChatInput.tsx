import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { SendHorizonal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuickPrompts } from "./QuickPrompts";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  hasMessages: boolean;
}

export function ChatInput({ onSend, isLoading, hasMessages }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const maxHeight = 5 * 24; // roughly 5 lines
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSend(prompt);
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm px-4 md:px-6 py-4 space-y-3">
      {hasMessages ? (
        <QuickPrompts onSelect={handleQuickPrompt} />
      ) : null}
      <div
        className={cn(
          "flex items-end gap-2 rounded-xl border bg-card/60 px-3 py-2 transition-all duration-200",
          "focus-within:border-primary/50 focus-within:shadow-[0_0_12px_rgba(16,185,129,0.15)]"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your AI mentor anything about DSA..."
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 py-1 min-h-[24px]"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="shrink-0 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
