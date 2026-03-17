export function TimelineConnector({ active }: { active: boolean }) {
  return (
    <div className="flex justify-center py-0">
      <div className="relative w-0.5 h-10">
        <div className="absolute inset-0 bg-border rounded-full" />
        {active ? (
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary to-amber-400 animate-pulse" />
        ) : null}
      </div>
    </div>
  );
}
