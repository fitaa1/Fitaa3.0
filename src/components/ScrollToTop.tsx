import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
export function ScrollToTop() {
  const y = useScrollPosition();
  return (
    <AnimatePresence>
      {y > 400 && (
        <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-40 w-11 h-11 flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border/50 text-foreground/60 hover:text-ruby hover:border-ruby/40 transition-all duration-300 group shadow-xl" aria-label="Scroll to top">
          <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}