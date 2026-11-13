import { useState, useEffect, useRef } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useTheme } from "@/contexts/ThemeContext";
import { useScrolledPast } from "@/hooks/useScrolledPast";
import { usePresence, Reveal } from "@/lib/reveal";
import { useAdaptiveCta } from "@/hooks/useAdaptiveCta";
import { useRegion } from "@/lib/region";

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
  const { label: ctaLabel, message: ctaMessage, hidden: ctaHidden } = useAdaptiveCta();
  const { waLink } = useRegion();

  const navRef = useRef<HTMLElement>(null);
  const keyRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  /* The signature key under the section in view: 2 px tall, the width of that
   * link, sliding between links. It rides on transform only (scaleX for the
   * width, translateX for the position) so it never triggers layout. */
  useEffect(() => {
    const nav = navRef.current;
    const key = keyRef.current;
    const link = linkRefs.current[active];
    if (!nav || !key || !link) return;
    const place = () => {
      const navRect = nav.getBoundingClientRect();
      const r = link.getBoundingClientRect();
      key.style.transform = `translateX(${r.left - navRect.left}px) scaleX(${r.width})`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [active]);

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
            {/* The slow gold sheen (Nigel, 12 Nov): CSS only, see .logo-sheen in index.css */}
            <span className="logo-sheen h-9 w-9 rounded-sm">
              <img
                src="/logo-160.webp"
                alt="Fitaa Creative Adinkra logo mark"
                className="h-9 w-9 object-cover rounded-sm transition-transform duration-400 group-hover:scale-105"
                width={36}
                height={36}
              />
            </span>
            <div className="leading-none">
              <span className="block font-display font-semibold text-[1.1rem] tracking-[0.15em] text-foreground">
                FITAA
              </span>
              <span className="block font-sans font-light text-[0.55rem] tracking-[0.42em] text-gold-text mt-[1px]">
                —CREATIVE—
              </span>
            </div>
          </a>

          {/* Desktop nav — evenly spaced */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-9 relative" aria-label="Site sections">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href.slice(1) ? "location" : undefined}
                ref={(el) => { linkRefs.current[item.href.slice(1)] = el; }}
                className="nav-link text-[0.7rem] font-sans uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground aria-[current=location]:text-foreground transition-colors duration-250 pb-0.5"
              >
                {item.label}
              </a>
            ))}
            <span ref={keyRef} className="nav-key absolute left-0 -bottom-1 h-0.5 bg-[var(--champagne)]" aria-hidden="true" />
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

            {!ctaHidden && (
              <a
                href={waLink(ctaMessage || siteConfig.hero.dataCtaMessage)}
                className="btn-cta hidden lg:inline-flex whitespace-nowrap items-center justify-center px-6 py-2.5 font-sans text-[0.68rem] uppercase tracking-[0.2em] ml-2"
                aria-label={ctaLabel || siteConfig.hero.dataCtaLabel}
              >
                <span key={ctaLabel} className="cta-label">
                  {ctaLabel || siteConfig.hero.dataCtaLabel}
                </span>
              </a>
            )}

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
                delay={0.1 + i * 0.08}
                dur={0.6}
                as="a"
                href={item.href}
                onClick={close}
                aria-current={active === item.href.slice(1) ? "location" : undefined}
                className="group relative text-center text-[2.8rem] font-display font-light text-foreground/60 hover:text-foreground aria-[current=location]:text-foreground transition-colors duration-300"
              >
                {/* Marker sits outside the label's box, so every label stays truly centred. */}
                <span
                  className="absolute right-full top-1/2 mr-4 w-7 h-px bg-ruby origin-right scale-x-0 group-hover:scale-x-100 group-aria-[current=location]:scale-x-100 transition-transform duration-500 ease-out motion-reduce:transition-none"
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
