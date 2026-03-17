import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 mr-auto max-w-[85%]"
    >
      <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="bg-card border border-border/70 border-l-2 border-l-primary/40 rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-3">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              animate={{
                opacity: [0.25, 1, 0.25],
                scale: [0.8, 1.2, 0.8],
                y: [0, -3, 0],
              }}
              transition={{
                duration: 1.0,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          Thinking...
        </span>
      </div>
    </motion.div>
  );
}
