import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PATTERNS = [
  "All",
  "HashMap",
  "SlidingWindow",
  "Stack",
  "Heap",
  "PrefixSum",
  "Greedy",
] as const;

const STATUSES = ["All", "Solved", "Revision", "Solving", "NotStarted"] as const;
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"] as const;

interface FilterBarProps {
  pattern: string;
  status: string;
  difficulty: string;
  search: string;
  onPatternChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onDifficultyChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

export function FilterBar({
  pattern,
  status,
  difficulty,
  search,
  onPatternChange,
  onStatusChange,
  onDifficultyChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search problems..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-secondary/50 border-border/50"
        />
      </div>

      <Select value={pattern} onValueChange={onPatternChange}>
        <SelectTrigger className="w-full sm:w-[150px] bg-secondary/50 border-border/50">
          <SelectValue placeholder="Pattern" />
        </SelectTrigger>
        <SelectContent>
          {PATTERNS.map((p) => (
            <SelectItem key={p} value={p}>
              {p === "SlidingWindow" ? "Sliding Window" : p === "PrefixSum" ? "Prefix Sum" : p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[140px] bg-secondary/50 border-border/50">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s === "NotStarted" ? "Not Started" : s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={difficulty} onValueChange={onDifficultyChange}>
        <SelectTrigger className="w-full sm:w-[130px] bg-secondary/50 border-border/50">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          {DIFFICULTIES.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
