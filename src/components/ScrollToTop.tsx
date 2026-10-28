import { usePresence } from "@/lib/reveal";
import { ArrowUp } from "lucide-react";
import { useScrolledPast } from "@/hooks/useScrolledPast";
export function ScrollToTop() {
  const show = useScrolledPast(400);
  const { mounted, visible } = usePresence(show, 300);
  if (!mounted) return null;
  return (
    <button
      data-open={visible}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 w-11 h-11 flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border/50 text-foreground/60 hover:text-ruby hover:border-ruby/40 transition-all duration-300 group shadow-xl" aria-label="Scroll to top">
      <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
    </button>
  );
}