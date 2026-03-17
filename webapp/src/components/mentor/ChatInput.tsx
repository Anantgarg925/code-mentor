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
          "flex items-end gap-3 rounded-2xl border bg-card/70 px-4 py-3 transition-all duration-200",
          "border-border/70",
          "focus-within:border-primary/50 focus-within:shadow-[0_0_0_1px_hsl(160_80%_42%/0.15),0_0_16px_hsl(160_80%_42%/0.1)]"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about DSA, Core Subjects, or your Rakshak project..."
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50 py-0.5 min-h-[24px] leading-relaxed"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className={cn(
            "shrink-0 h-9 w-9 rounded-full transition-all duration-200",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 hover:scale-105",
            "disabled:opacity-30 disabled:scale-100",
            "shadow-[0_0_12px_hsl(160_80%_42%/0.3)]"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground/50 text-center">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
