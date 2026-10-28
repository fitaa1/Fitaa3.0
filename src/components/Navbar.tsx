import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useTheme } from "@/contexts/ThemeContext";
import { useScrolledPast } from "@/hooks/useScrolledPast";
import { usePresence, Reveal } from "@/lib/reveal";

/** Tracks which page section sits under the middle of the screen. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!("IntersectionObserver" in window) || !els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const sectionIds = siteConfig.nav.map((n) => n.href.slice(1));

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrolledPast(60);
  const { isDark, toggle } = useTheme();
  const active = useActiveSection(sectionIds);
  const { mounted, visible } = usePresence(isOpen, 300);

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
            aria-label="Fitaa Creative home"
          >
            <img
              src="/logo-160.webp"
              alt="Fitaa Creative Adinkra logo mark"
              className="h-9 w-9 object-cover rounded-sm transition-transform duration-400 group-hover:scale-105"
              width={36}
              height={36}
            />
            <div className="leading-none">
              <span className="block font-serif font-semibold text-[1.1rem] tracking-[0.15em] text-foreground">
                FITAA
              </span>
              <span className="block font-sans font-light text-[0.55rem] tracking-[0.42em] text-gold-text mt-[1px]">
                —CREATIVE—
              </span>
            </div>
          </a>

          {/* Desktop nav — evenly spaced */}
          <nav className="hidden lg:flex items-center gap-9" aria-label="Site sections">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href.slice(1) ? "location" : undefined}
                className="nav-link text-[0.7rem] font-sans uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground aria-[current=location]:text-foreground transition-colors duration-250 pb-0.5"
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
              className="w-11 h-11 inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-250"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 transition-transform duration-200">
                {isDark ? <Sun size={17} strokeWidth={1.5} /> : <Moon size={17} strokeWidth={1.5} />}
              </span>
            </button>

            {/* CTA — desktop only */}
            <a
              href="#contact"
              className="btn-gold hidden lg:inline-flex whitespace-nowrap items-center px-6 py-2.5 font-sans text-[0.68rem] uppercase tracking-[0.2em] ml-2"
              aria-label="Contact Fitaa Creative"
            >
              Get in Touch
            </a>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-11 h-11 -mr-2 inline-flex items-center justify-center text-foreground hover:text-ruby transition-colors duration-200"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 transition-transform duration-200">
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu */}
      {mounted && (
        <div
          id="mobile-menu"
          data-open={visible}
          className="fixed inset-0 z-[45] bg-background/98 backdrop-blur-2xl flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(var(--ruby) / 0.07), transparent)" }}
            aria-hidden="true"
          />

          <nav className="flex flex-col items-center gap-7 relative z-10">
            {siteConfig.nav.map((item, i) => (
              <Reveal
                key={item.href}
                variant="up"
                delay={0.1 + i * 0.12}
                as="a"
                href={item.href}
                onClick={close}
                aria-current={active === item.href.slice(1) ? "location" : undefined}
                className="group flex items-center gap-5 text-[2.8rem] font-serif font-light text-foreground/60 hover:text-foreground aria-[current=location]:text-foreground transition-colors duration-300"
              >
                <span
                  className="w-0 h-px bg-ruby group-hover:w-7 group-aria-[current=location]:w-7 transition-all duration-500 ease-out"
                  aria-hidden="true"
                />
                {item.label}
              </Reveal>
            ))}
          </nav>

          <div className="absolute bottom-10 flex flex-col items-center gap-2">
            <span className="text-[0.65rem] font-sans uppercase tracking-[0.28em] text-muted-foreground">
              {siteConfig.contact.email}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
