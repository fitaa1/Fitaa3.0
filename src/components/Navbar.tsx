import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useTheme } from "@/contexts/ThemeContext";

const overlayVariants = {
  hidden:  { opacity: 0, y: "-100%" },
  visible: { opacity: 1, y: 0,       transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: "-100%", transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const linkVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
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
            ? "bg-background/92 backdrop-blur-2xl border-b border-border/25 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">

          {/* Logo — golden ratio: mark + wordmark side by side */}
          <a
            href="#home"
            className="flex items-center gap-3.5 z-50 relative shrink-0 group"
            aria-label="Fitaa Digital — home"
          >
            <img
              src="/logo.png"
              alt="Fitaa Digital Adinkra logo mark"
              className="h-9 w-9 object-cover rounded-sm transition-transform duration-400 group-hover:scale-105"
              width={36}
              height={36}
            />
            <div className="leading-none">
              <span className="block font-serif font-semibold text-[1.1rem] tracking-[0.15em] text-foreground">
                FITAA
              </span>
              <span className="block font-sans font-light text-[0.55rem] tracking-[0.42em] text-gold mt-[1px]">
                —DIGITAL—
              </span>
            </div>
          </a>

          {/* Desktop nav — evenly spaced */}
          <nav className="hidden md:flex items-center gap-9" aria-label="Site sections">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link text-[0.7rem] font-sans uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors duration-250 pb-0.5"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 z-50 relative">
            <button
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-250"
            >
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -15, scale: 0.85 }}
                animate={{ opacity: 1, rotate: 0,   scale: 1    }}
                exit={{    opacity: 0, rotate:  15, scale: 0.85 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Sun size={17} strokeWidth={1.5} /> : <Moon size={17} strokeWidth={1.5} />}
              </motion.span>
            </button>

            {/* CTA — desktop only */}
            <a
              href="#contact"
              className="btn-primary hidden md:inline-flex items-center px-6 py-2.5 bg-ruby text-white font-sans text-[0.68rem] font-medium uppercase tracking-[0.2em] hover:bg-ruby/88 ml-2"
              aria-label="Contact Fitaa Digital"
            >
              Get in Touch
            </a>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 -mr-2 text-foreground hover:text-ruby transition-colors duration-200"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen
                  ? <motion.span key="x"  initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45,  opacity: 0 }} transition={{ duration: 0.18 }}><X    size={22} /></motion.span>
                  : <motion.span key="hb" initial={{ rotate:  45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={22} /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            key="overlay"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-2xl flex flex-col items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(155,18,44,0.07), transparent)" }}
              aria-hidden="true"
            />

            <nav className="flex flex-col items-center gap-7 relative z-10">
              {siteConfig.nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  custom={i}
                  variants={linkVariants}
                  onClick={close}
                  className="group flex items-center gap-5 text-[2.8rem] font-serif font-light text-foreground/60 hover:text-foreground transition-colors duration-300"
                >
                  <span
                    className="w-0 h-px bg-ruby group-hover:w-7 transition-all duration-500 ease-out"
                    aria-hidden="true"
                  />
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-10 flex flex-col items-center gap-2"
            >
              <span className="text-[0.65rem] font-sans uppercase tracking-[0.28em] text-muted-foreground">
                {siteConfig.contact.email}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
