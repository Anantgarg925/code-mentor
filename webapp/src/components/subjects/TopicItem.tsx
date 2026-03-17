import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ChevronDown, StickyNote, Bot } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CoreSubjectTopic } from "@/hooks/use-api";

interface TopicItemProps {
  topic: CoreSubjectTopic;
  onUpdate: (topicId: string, data: { progress?: number; notes?: string; completed?: boolean }) => void;
}

export function TopicItem({ topic, onUpdate }: TopicItemProps) {
  // Auto-open notes if they have content (AI-generated)
  const [notesOpen, setNotesOpen] = useState(!!topic.notes);
  const hasAiNotes = !!topic.notes;

  return (
    <div className={cn(
      "border rounded-lg p-3 space-y-2 transition-colors",
      hasAiNotes ? "border-emerald-500/20 bg-emerald-400/5" : "border-border/30"
    )}>
      <div className="flex items-center gap-3">
        <Checkbox
          checked={topic.completed}
          onCheckedChange={(checked) =>
            onUpdate(topic.id, {
              completed: !!checked,
              progress: checked ? 100 : 0,
            })
          }
        />
        <span
          className={cn(
            "text-sm text-foreground flex-1",
            topic.completed && "line-through text-muted-foreground"
          )}
        >
          {topic.topic}
        </span>

        {hasAiNotes ? (
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
            <Bot className="h-2.5 w-2.5" />
            AI Notes
          </span>
        ) : null}

        <button
          onClick={() => setNotesOpen(!notesOpen)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <StickyNote className="h-3.5 w-3.5" />
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform",
              notesOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {notesOpen ? (
        <div className="space-y-1.5">
          {hasAiNotes ? (
            <p className="text-[10px] text-emerald-400/70 font-medium">Auto-saved by AI Mentor</p>
          ) : null}
          <Textarea
            value={topic.notes ?? ""}
            onChange={(e) => onUpdate(topic.id, { notes: e.target.value })}
            placeholder="Notes will appear here after AI Mentor explains this topic..."
            rows={hasAiNotes ? 4 : 2}
            className={cn("text-xs", hasAiNotes && "border-emerald-500/20 bg-background/50")}
          />
        </div>
      ) : null}
    </div>
  );
}
