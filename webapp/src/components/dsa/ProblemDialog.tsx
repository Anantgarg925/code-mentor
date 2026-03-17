import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DsaProblem } from "@/hooks/use-api";

const PATTERNS = ["HashMap", "SlidingWindow", "Stack", "Heap", "PrefixSum", "Greedy"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const STATUSES = ["Solved", "Revision", "Solving", "NotStarted"];

interface ProblemFormData {
  name: string;
  leetcodeNum: string;
  pattern: string;
  difficulty: string;
  status: string;
  confidence: number;
  notes: string;
  weakPoints: string;
  coreIdea: string;
  keyLine: string;
  edgeCase: string;
  timeSpace: string;
}

const defaultForm: ProblemFormData = {
  name: "",
  leetcodeNum: "",
  pattern: "HashMap",
  difficulty: "Medium",
  status: "Solved",
  confidence: 3,
  notes: "",
  weakPoints: "",
  coreIdea: "",
  keyLine: "",
  edgeCase: "",
  timeSpace: "",
};

interface ProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problem?: DsaProblem | null;
  onSubmit: (data: Partial<DsaProblem>) => void;
  isSubmitting: boolean;
}

export function ProblemDialog({
  open,
  onOpenChange,
  problem,
  onSubmit,
  isSubmitting,
}: ProblemDialogProps) {
  const [form, setForm] = useState<ProblemFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const isEditing = !!problem;

  useEffect(() => {
    if (problem) {
      setForm({
        name: problem.name,
        leetcodeNum: problem.leetcodeNum?.toString() ?? "",
        pattern: problem.pattern,
        difficulty: problem.difficulty,
        status: problem.status,
        confidence: problem.confidence,
        notes: problem.notes ?? "",
        weakPoints: problem.weakPoints ?? "",
        coreIdea: problem.coreIdea ?? "",
        keyLine: problem.keyLine ?? "",
        edgeCase: problem.edgeCase ?? "",
        timeSpace: problem.timeSpace ?? "",
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [problem, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.pattern) newErrors.pattern = true;
    if (!form.difficulty) newErrors.difficulty = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...(isEditing ? { id: problem.id } : {}),
      name: form.name.trim(),
      leetcodeNum: form.leetcodeNum ? parseInt(form.leetcodeNum, 10) : null,
      pattern: form.pattern,
      difficulty: form.difficulty,
      status: form.status,
      confidence: form.confidence,
      notes: form.notes.trim(),
      weakPoints: form.weakPoints.trim(),
      coreIdea: form.coreIdea.trim(),
      keyLine: form.keyLine.trim(),
      edgeCase: form.edgeCase.trim(),
      timeSpace: form.timeSpace.trim(),
      dateSolved: form.status === "Solved" ? new Date().toISOString() : null,
    });
  }

  function update(field: keyof ProblemFormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Problem" : "Add New Problem"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Two Sum"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={cn(errors.name && "border-destructive")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="leetcodeNum">LC #</Label>
              <Input
                id="leetcodeNum"
                type="number"
                placeholder="1"
                value={form.leetcodeNum}
                onChange={(e) => update("leetcodeNum", e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>
                Pattern <span className="text-destructive">*</span>
              </Label>
              <Select value={form.pattern} onValueChange={(v) => update("pattern", v)}>
                <SelectTrigger className={cn(errors.pattern && "border-destructive")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PATTERNS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p === "SlidingWindow" ? "Sliding Window" : p === "PrefixSum" ? "Prefix Sum" : p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>
                Difficulty <span className="text-destructive">*</span>
              </Label>
              <Select value={form.difficulty} onValueChange={(v) => update("difficulty", v)}>
                <SelectTrigger className={cn(errors.difficulty && "border-destructive")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "NotStarted" ? "Not Started" : s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Confidence: {form.confidence}/5</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[form.confidence]}
                onValueChange={([v]) => update("confidence", v)}
                min={1}
                max={5}
                step={1}
                className="flex-1"
              />
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < form.confidence
                        ? "fill-amber-400 text-amber-400"
                        : "fill-none text-muted-foreground/40"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Approach, intuition, mistakes..."
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="weakPoints">Weak Points</Label>
            <Input
              id="weakPoints"
              placeholder="Edge cases I missed, tricky part..."
              value={form.weakPoints}
              onChange={(e) => update("weakPoints", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="coreIdea">Core Idea</Label>
              <Input
                id="coreIdea"
                placeholder="Use hashmap for O(1) lookup"
                value={form.coreIdea}
                onChange={(e) => update("coreIdea", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="keyLine">Key Line</Label>
              <Input
                id="keyLine"
                placeholder="map[target - num] = i"
                value={form.keyLine}
                onChange={(e) => update("keyLine", e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edgeCase">Edge Case</Label>
              <Input
                id="edgeCase"
                placeholder="Empty array, single element"
                value={form.edgeCase}
                onChange={(e) => update("edgeCase", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="timeSpace">Time / Space</Label>
              <Input
                id="timeSpace"
                placeholder="O(n) / O(n)"
                value={form.timeSpace}
                onChange={(e) => update("timeSpace", e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Problem"
                : "Add Problem"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
