import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGenerateDailyTasks } from "@/hooks/use-api";

interface GenerateButtonProps {
  date: string;
}

export function GenerateButton({ date }: GenerateButtonProps) {
  const generate = useGenerateDailyTasks();

  return (
    <Button
      onClick={() => generate.mutate({ date })}
      disabled={generate.isPending}
      className="gap-2"
      variant="outline"
    >
      {generate.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4 text-amber-400" />
      )}
      {generate.isPending ? "Generating..." : "Auto-Generate Today's Plan"}
    </Button>
  );
}
