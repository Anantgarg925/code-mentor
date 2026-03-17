import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ChevronDown, StickyNote } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CoreSubjectTopic } from "@/hooks/use-api";

interface TopicItemProps {
  topic: CoreSubjectTopic;
  onUpdate: (topicId: string, data: { progress?: number; notes?: string; completed?: boolean }) => void;
}

export function TopicItem({ topic, onUpdate }: TopicItemProps) {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div className="border border-border/30 rounded-lg p-3 space-y-2">
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
        <Textarea
          value={topic.notes ?? ""}
          onChange={(e) => onUpdate(topic.id, { notes: e.target.value })}
          placeholder="Add notes..."
          rows={2}
          className="text-xs"
        />
      ) : null}
    </div>
  );
}
