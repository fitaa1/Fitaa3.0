import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

const overlayVariants = {
  hidden:  { opacity: 0, y: "-100%" },
  visible: { opacity: 1, y: 0,      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: "-100%", transition: { duration: 0.4,  ease: [0.22, 1, 0.36, 1] } },
};
const linkVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.12 + i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

export function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [isOpen]);
  const close = () => setIsOpen(false);
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/30 py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-3 z-50 relative group">
            <div className="h-9 w-9 rounded-md bg-ruby/20 border border-ruby/30 flex items-center justify-center">
              <span className="font-serif font-bold text-ruby text-lg">F</span>
            </div>
            <span className="font-serif font-semibold text-xl tracking-wide text-foreground">{siteConfig.name}</span>
          </a>
          <button onClick={() => setIsOpen(!isOpen)} className="z-50 relative p-2 -mr-2 text-foreground hover:text-ruby transition-colors duration-200" aria-label={isOpen ? "Close menu" : "Open menu"}>
            <AnimatePresence mode="wait" initial={false}>
              {isOpen
                ? <motion.span key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.2 }}><X size={26} /></motion.span>
                : <motion.span key="open"  initial={{ rotate: 45,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={26} /></motion.span>
              }
            </AnimatePresence>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div key="overlay" initial="hidden" animate="visible" exit="exit" variants={overlayVariants}
            className="fixed inset-0 z-40 bg-background/97 backdrop-blur-2xl flex flex-col items-center justify-center">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(155,18,44,0.06), transparent)" }} />
            <nav className="flex flex-col items-center gap-6 md:gap-8 relative z-10">
              {siteConfig.nav.map((item, i) => (
                <motion.a key={item.href} href={item.href} custom={i} variants={linkVariants} onClick={close}
                  className="group flex items-center gap-4 text-5xl md:text-7xl font-serif font-light text-foreground/65 hover:text-foreground transition-colors duration-300">
                  <span className="w-0 h-px bg-ruby group-hover:w-8 transition-all duration-400 ease-out" />
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.5 }}
              className="absolute bottom-10 text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground">
              {siteConfig.contact.email}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}