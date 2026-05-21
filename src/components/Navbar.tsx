import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useTheme } from "@/contexts/ThemeContext";

const overlayVariants = {
  hidden:  { opacity: 0, y: "-100%" },
  visible: { opacity: 1, y: 0,       transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: "-100%", transition: { duration: 0.4,  ease: [0.22, 1, 0.36, 1] } },
};
const linkVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.12 + i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

export function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border/30 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 z-50 relative group shrink-0" aria-label="Fitaa Digital home">
            <img
              src="/logo.png"
              alt="Fitaa Digital logo"
              className="h-9 w-9 rounded-md object-cover"
              width={36}
              height={36}
            />
            <span className="font-serif font-semibold text-lg tracking-wide text-foreground leading-none">
              FITAA<br />
              <span className="text-gold text-[10px] tracking-[0.3em] font-sans font-light">—DIGITAL—</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Desktop navigation">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs font-sans uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3 z-50 relative">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {isDark
                ? <Sun size={18} strokeWidth={1.5} />
                : <Moon size={18} strokeWidth={1.5} />
              }
            </button>

            {/* CTA — desktop */}
            <a
              href="#contact"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-ruby text-white font-sans text-[11px] font-medium uppercase tracking-widest hover:bg-ruby/85 transition-colors duration-300"
              aria-label="Get in touch"
            >
              Get in Touch
            </a>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 -mr-2 text-foreground hover:text-ruby transition-colors duration-200"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen
                  ? <motion.span key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.2 }}><X size={24} /></motion.span>
                  : <motion.span key="open"  initial={{ rotate: 45,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={24} /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            key="overlay"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            className="fixed inset-0 z-40 bg-background/97 backdrop-blur-2xl flex flex-col items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(155,18,44,0.06), transparent)" }} />
            <nav className="flex flex-col items-center gap-6 relative z-10">
              {siteConfig.nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  custom={i}
                  variants={linkVariants}
                  onClick={close}
                  className="group flex items-center gap-4 text-5xl font-serif font-light text-foreground/65 hover:text-foreground transition-colors duration-300"
                >
                  <span className="w-0 h-px bg-ruby group-hover:w-8 transition-all duration-400 ease-out" />
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="absolute bottom-10 text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground"
            >
              {siteConfig.contact.email}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
