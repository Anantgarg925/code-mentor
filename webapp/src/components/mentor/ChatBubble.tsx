import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Bot, User, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MentorMessage } from "@/hooks/use-api";

interface ChatBubbleProps {
  message: MentorMessage;
}

function parseMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const code = codeLines.join("\n");
      nodes.push(
        <CodeBlock key={`code-${nodes.length}`} code={code} language={lang} />
      );
      continue;
    }

    // Bullet points
    if (line.match(/^[\s]*[-*]\s/)) {
      nodes.push(
        <div key={`bullet-${nodes.length}`} className="flex gap-2 text-sm">
          <span className="text-muted-foreground mt-0.5">-</span>
          <span>{formatInline(line.replace(/^[\s]*[-*]\s/, ""))}</span>
        </div>
      );
      i++;
      continue;
    }

    // Numbered list
    if (line.match(/^[\s]*\d+\.\s/)) {
      const num = line.match(/^[\s]*(\d+)\./)?.[1];
      nodes.push(
        <div key={`num-${nodes.length}`} className="flex gap-2 text-sm">
          <span className="text-muted-foreground font-mono text-xs mt-0.5">
            {num}.
          </span>
          <span>{formatInline(line.replace(/^[\s]*\d+\.\s/, ""))}</span>
        </div>
      );
      i++;
      continue;
    }

    // Empty line → spacer
    if (line.trim() === "") {
      nodes.push(<div key={`sp-${nodes.length}`} className="h-2" />);
      i++;
      continue;
    }

    // Normal paragraph
    nodes.push(
      <p key={`p-${nodes.length}`} className="text-sm leading-relaxed">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return nodes;
}

function formatInline(text: string): React.ReactNode {
  // Replace **bold** and `code`
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline code
    const codeMatch = remaining.match(/`([^`]+)`/);

    const boldIdx = boldMatch?.index ?? Infinity;
    const codeIdx = codeMatch?.index ?? Infinity;

    if (boldIdx === Infinity && codeIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIdx <= codeIdx && boldMatch) {
      parts.push(remaining.slice(0, boldIdx));
      parts.push(
        <strong key={`b-${key++}`} className="font-semibold">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldIdx + boldMatch[0].length);
    } else if (codeMatch) {
      parts.push(remaining.slice(0, codeIdx));
      parts.push(
        <code
          key={`c-${key++}`}
          className="px-1.5 py-0.5 rounded bg-secondary text-primary font-mono text-xs"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeIdx + codeMatch[0].length);
    }
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg bg-secondary border border-border overflow-hidden my-2">
      <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/80 border-b border-border/50">
        <span className="text-[10px] text-muted-foreground font-mono uppercase">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-xs font-mono text-foreground/90 leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

export const ChatBubble = memo(function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {isUser ? null : (
        <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={cn("max-w-[80%] space-y-1", isUser ? "items-end" : "items-start")}
      >
        <div
          className={cn(
            "rounded-xl px-4 py-3 space-y-1",
            isUser
              ? "bg-primary/10 border border-primary/20 text-foreground"
              : "bg-card border border-border text-foreground"
          )}
        >
          {parseMarkdown(message.message)}
        </div>
        <span
          className={cn(
            "text-[11px] text-muted-foreground px-1",
            isUser ? "text-right" : "text-left"
          )}
        >
          {time}
        </span>
      </div>

      {isUser ? (
        <div className="shrink-0 h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center mt-1">
          <User className="h-4 w-4 text-primary" />
        </div>
      ) : null}
    </motion.div>
  );
});
