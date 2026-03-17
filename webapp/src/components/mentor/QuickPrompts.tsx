import { Sparkles, Brain, Zap, MessageSquare, ChevronRight } from "lucide-react";

const PROMPTS = [
  {
    label: "Continue my DSA journey",
    icon: ChevronRight,
    description: "Suggests the next problem",
  },
  {
    label: "Review my last problem",
    icon: MessageSquare,
    description: "Reviews most recent",
  },
  {
    label: "Quiz me on Sliding Window",
    icon: Brain,
    description: "Pattern quiz",
  },
  {
    label: "Explain HashMap pattern",
    icon: Sparkles,
    description: "Pattern help",
  },
  {
    label: "Generate study plan for today",
    icon: Zap,
    description: "Daily plan",
  },
];

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROMPTS.map((p) => {
        const Icon = p.icon;
        return (
          <button
            key={p.label}
            onClick={() => onSelect(p.label)}
            className="group flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-card/60 hover:bg-primary/10 hover:border-primary/30 transition-all text-sm text-muted-foreground hover:text-foreground"
          >
            <Icon className="h-3.5 w-3.5 text-primary/70 group-hover:text-primary transition-colors" />
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
