import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Bot, User, Copy, Check, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MentorMessage } from "@/hooks/use-api";
import { MermaidDiagram } from "@/components/mentor/MermaidDiagram";

interface ChatBubbleProps {
  message: MentorMessage;
  index?: number;
}

function parseMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block (including mermaid)
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim().toLowerCase();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const code = codeLines.join("\n");

      // Render mermaid blocks as visual diagrams
      if (lang === "mermaid") {
        nodes.push(
          <MermaidDiagram key={`mermaid-${nodes.length}`} code={code} />
        );
      } else {
        nodes.push(
          <CodeBlock key={`code-${nodes.length}`} code={code} language={lang} />
        );
      }
      continue;
    }

    // Bullet points
    if (line.match(/^[\s]*[-*]\s/)) {
      nodes.push(
        <div key={`bullet-${nodes.length}`} className="flex gap-2 text-sm">
          <span className="text-primary/60 mt-0.5 font-mono">•</span>
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
          <span className="text-primary/60 font-mono text-xs mt-0.5 shrink-0">
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
        <strong key={`b-${key++}`} className="font-semibold text-foreground">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldIdx + boldMatch[0].length);
    } else if (codeMatch) {
      parts.push(remaining.slice(0, codeIdx));
      parts.push(
        <code
          key={`c-${key++}`}
          className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-xs"
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
    <div className="relative rounded-xl overflow-hidden my-3 border border-border/60">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest ml-1">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded hover:bg-secondary"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-primary" />
              <span className="text-primary">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono text-foreground/90 leading-relaxed bg-card/80">
        {code}
      </pre>
    </div>
  );
}

const NOTE_SAVED_PATTERN = /notes? saved to core subjects/i;

export const ChatBubble = memo(function ChatBubble({ message, index = 0 }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const hasNoteSaved = !isUser && NOTE_SAVED_PATTERN.test(message.message);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.3) }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="shrink-0 h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mt-1">
          <User className="h-3.5 w-3.5 text-primary" />
        </div>
      ) : (
        <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] space-y-1.5",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 space-y-1",
            isUser
              ? [
                  "rounded-tr-sm",
                  "bg-primary/12 border border-primary/20",
                  "text-foreground",
                ].join(" ")
              : [
                  "rounded-tl-sm",
                  "bg-card border border-border/70",
                  "border-l-2 border-l-primary/40",
                  "text-foreground",
                ].join(" ")
          )}
        >
          {parseMarkdown(message.message)}
        </div>

        {/* Notes saved pill */}
        {hasNoteSaved ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary"
          >
            <BookOpen className="h-3 w-3" />
            Notes saved to Core Subjects
          </motion.div>
        ) : null}

        {/* Timestamp */}
        <span
          className={cn(
            "block text-[11px] text-muted-foreground px-1",
            isUser ? "text-right" : "text-left"
          )}
        >
          {time}
        </span>
      </div>
    </motion.div>
  );
});
