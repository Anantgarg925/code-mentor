import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 mr-auto max-w-[85%]"
    >
      <div className="shrink-0 h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center mt-1">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-primary/60"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground ml-1">Thinking...</span>
      </div>
    </motion.div>
  );
}
