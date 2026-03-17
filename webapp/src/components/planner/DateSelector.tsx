import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ date, onDateChange }: DateSelectorProps) {
  const isToday =
    date.toDateString() === new Date().toDateString();

  const formatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function goBack() {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    onDateChange(d);
  }

  function goForward() {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    onDateChange(d);
  }

  function goToday() {
    onDateChange(new Date());
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={goBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={goForward}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h2 className="text-lg md:text-xl font-semibold text-foreground">
          {formatted}
        </h2>
        {!isToday ? (
          <Button variant="secondary" size="sm" onClick={goToday}>
            Today
          </Button>
        ) : (
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            Today
          </span>
        )}
      </div>
    </div>
  );
}
