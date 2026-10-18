import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Sparkles, ExternalLink, Plus } from "lucide-react";
import { siteConfig } from "@/config/site";
import { fullyBooked as fb, type Niche } from "@/config/fullyBooked";
import { AuroraBackground } from "@/components/AuroraBackground";
import { SectionLabel } from "@/components/SectionLabel";
import { Footer } from "@/components/Footer";
import {
  heroStagger, heroItem, fadeInUp, staggerContainer, sectionViewport, cardViewport, EASE_CURVE,
} from "@/lib/animations";

const waNumber = siteConfig.contact.phone.replace(/\D/g, "").replace(/^0/, "233");
const waLink = (text: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

function WhatsAppGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.67.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}

function Header({ cta }: { cta: string }) {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3 shrink-0" aria-label="Fitaa Digital home">
          <img src="/logo-160.webp" alt="" width={36} height={36} className="h-9 w-9 rounded-sm" />
          <span className="leading-none">
            <span className="block font-serif font-semibold tracking-[0.15em] text-[1.05rem]">FITAA</span>
            <span className="block font-sans font-light text-[0.55rem] tracking-[0.42em] text-gold mt-[1px]">—DIGITAL—</span>
          </span>
        </a>
        <div className="flex items-center gap-3 sm:gap-6">
          <a
            href="/"
            className="hidden sm:flex items-center gap-2 text-[0.7rem] font-sans uppercase tracking-[0.18em] text-muted-foreground hover:text-ruby transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Main site
          </a>
          <a
            href={cta}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 font-sans text-[0.66rem] uppercase tracking-[0.18em]"
          >
            <WhatsAppGlyph size={14} />
            <span className="hidden sm:inline">Book a call</span>
            <span className="sm:hidden">Chat</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({ niche, setNiche }: { niche: Niche; setNiche: (n: Niche) => void }) {
  const n = fb.niches[niche];
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-36 pb-24">
      <AuroraBackground />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div variants={heroStagger} initial="hidden" animate="visible" className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.p variants={heroItem} className="inline-flex items-center gap-2.5 px-4 py-2 border border-border/50 bg-card/40 backdrop-blur-md text-[0.62rem] sm:text-[0.66rem] font-sans uppercase tracking-[0.24em] text-muted-foreground mb-8">
            <span className="w-1.5 h-1.5 bg-gold inline-block animate-pulse" style={{ animationDuration: "2.4s" }} aria-hidden="true" />
            {fb.banner}
          </motion.p>

          <motion.h1 variants={heroItem} className="text-[clamp(2.6rem,7vw,5.6rem)] font-serif font-bold leading-[1.04] tracking-[-0.015em] text-balance mb-6">
            {fb.hero.headline}
          </motion.h1>

          <motion.p variants={heroItem} className="text-[1.0625rem] md:text-[1.15rem] text-muted-foreground font-sans font-light max-w-2xl leading-[1.75] mb-10">
            {fb.hero.subhead}
          </motion.p>

          {/* Niche switch */}
          <motion.div variants={heroItem} className="w-full max-w-2xl">
            <div role="tablist" aria-label="Choose your business" className="inline-flex p-1 border border-border/60 bg-card/50 backdrop-blur-md mb-5">
              {(Object.keys(fb.niches) as Niche[]).map((key) => {
                const selected = key === niche;
                return (
                  <button
                    key={key}
                    role="tab"
                    id={`tab-${key}`}
                    aria-selected={selected}
                    aria-controls="niche-panel"
                    onClick={() => setNiche(key)}
                    className={`relative px-5 sm:px-7 min-h-[44px] text-[0.68rem] font-sans uppercase tracking-[0.18em] transition-colors ${selected ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {selected && (
                      <motion.span layoutId="niche-pill" className="absolute inset-0 bg-ruby" transition={{ duration: 0.45, ease: EASE_CURVE }} aria-hidden="true" />
                    )}
                    <span className="relative">{fb.niches[key].tab}</span>
                  </button>
                );
              })}
            </div>

            <div id="niche-panel" role="tabpanel" aria-labelledby={`tab-${niche}`} className="min-h-[9.5rem] sm:min-h-[8rem]">
              <AnimatePresence mode="wait">
                <motion.div key={niche} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE_CURVE }}>
                  <p className="font-serif italic text-[1.5rem] md:text-[1.85rem] text-ruby mb-2">{n.headline}</p>
                  <p className="text-[0.98rem] text-muted-foreground font-sans leading-[1.7]">{n.subhead}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div variants={heroItem} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center mt-6">
            <a
              href={waLink(n.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold group inline-flex items-center justify-center gap-2.5 px-9 py-4 font-sans text-[0.72rem] tracking-[0.2em] uppercase w-full sm:w-auto"
            >
              <WhatsAppGlyph />
              {fb.hero.primaryButton}
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" aria-hidden="true" />
            </a>
            <a
              href="#packages"
              className="btn-outline inline-flex items-center justify-center px-9 py-4 border border-gold/40 text-gold hover:bg-gold/8 hover:border-gold/70 font-sans font-light text-[0.72rem] tracking-[0.2em] uppercase w-full sm:w-auto"
            >
              {fb.hero.secondaryButton}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Promise() {
  return (
    <section className="py-[var(--sp-7)]">
      <div className="container mx-auto px-6 md:px-12 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start">
        <SectionLabel eyebrow={fb.promise.eyebrow} heading={fb.promise.heading} />
        <motion.div initial="hidden" whileInView="visible" viewport={sectionViewport} variants={staggerContainer} className="space-y-6 lg:pt-10">
          {fb.promise.paragraphs.map((p, i) => (
            <motion.p key={i} variants={fadeInUp} className={`font-sans leading-[1.85] ${i === 2 ? "text-foreground text-[1.1rem]" : "text-muted-foreground text-[1.02rem]"}`}>
              {p}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Tiers() {
  return (
    <section id="packages" className="py-[var(--sp-7)] bg-card/40 border-y border-border/30 scroll-mt-8">
      <div className="container mx-auto px-6 md:px-12">
        <SectionLabel eyebrow={fb.tiersSection.eyebrow} heading={fb.tiersSection.heading} align="center" className="mb-14" />
        <motion.div initial="hidden" whileInView="visible" viewport={cardViewport} variants={staggerContainer} className="grid gap-6 lg:grid-cols-3 items-stretch">
          {fb.tiers.map((t) => (
            <motion.article
              key={t.name}
              variants={fadeInUp}
              className={`service-card relative flex flex-col p-7 md:p-8 border bg-card ${t.featured ? "border-gold/60 shadow-[0_24px_60px_-30px_hsl(var(--gold)/0.45)] lg:-translate-y-3" : "border-border/50"}`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 px-3 py-1 bg-gold text-[hsl(212_36%_5%)] text-[0.6rem] font-sans font-semibold uppercase tracking-[0.18em]">
                  <Sparkles size={11} aria-hidden="true" /> Full package
                </span>
              )}
              <h3 className="text-[1.75rem] font-serif font-semibold mb-1">{t.name}</h3>
              <p className="text-[0.95rem] text-muted-foreground font-sans italic mb-6">{t.tagline}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[2.4rem] font-serif font-semibold leading-none">{t.price}</span>
                <span className="text-[0.8rem] font-sans text-muted-foreground">{t.cadence}</span>
              </div>
              <p className="text-[0.7rem] font-sans uppercase tracking-[0.18em] text-ruby mb-6">{t.timing}</p>
              {"foundingNote" in t && t.foundingNote && (
                <p className="text-[0.85rem] font-sans text-gold border border-gold/30 bg-gold/8 px-3 py-2 mb-6">{t.foundingNote}</p>
              )}
              <ul className="space-y-3 mb-8 flex-grow">
                {t.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.92rem] font-sans text-muted-foreground leading-[1.6]">
                    <Check size={16} className="text-ruby shrink-0 mt-[0.2rem]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={waLink(`Hi Fitaa, I'm interested in ${t.name}. My business: `)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${t.featured ? "btn-gold" : "btn-outline border border-border hover:border-ruby/60 hover:text-ruby"} inline-flex items-center justify-center gap-2 min-h-[48px] px-6 font-sans text-[0.7rem] uppercase tracking-[0.18em]`}
              >
                <WhatsAppGlyph size={14} />
                Ask about {t.name}
              </a>
            </motion.article>
          ))}
        </motion.div>
        <p className="text-center text-[0.88rem] font-sans text-muted-foreground mt-10">{fb.upkeep}</p>
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section className="py-[var(--sp-6)]">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={sectionViewport} variants={fadeInUp} className="relative overflow-hidden border border-ruby/30 bg-card px-7 py-12 md:px-16 md:py-16 grid gap-8 md:grid-cols-[auto_minmax(0,1fr)] items-center">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 0% 50%, hsl(var(--ruby) / 0.10), transparent 70%)" }} aria-hidden="true" />
          <ShieldCheck size={64} strokeWidth={1.1} className="text-ruby relative" aria-hidden="true" />
          <div className="relative">
            <p className="text-[0.68rem] font-sans uppercase tracking-[0.28em] text-gold mb-3">The guarantee</p>
            <h2 className="text-[clamp(1.9rem,4vw,3.2rem)] font-serif font-semibold leading-[1.1] mb-4">{fb.guarantee.heading}</h2>
            <p className="text-muted-foreground font-sans leading-[1.8] max-w-2xl">{fb.guarantee.body}</p>
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={sectionViewport} variants={fadeInUp} className="mt-6 border border-gold/35 bg-gold/[0.06] px-7 py-10 md:px-16 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] items-center">
          <div>
            <p className="text-[0.68rem] font-sans uppercase tracking-[0.28em] text-gold mb-3">{fb.founding.eyebrow}</p>
            <h3 className="text-[clamp(1.5rem,3vw,2.2rem)] font-serif font-semibold leading-[1.15] mb-3">{fb.founding.heading}</h3>
            <p className="text-muted-foreground font-sans leading-[1.8] max-w-2xl">{fb.founding.body}</p>
          </div>
          <a
            href={waLink("Hi Fitaa, I'd like to be a founding client. My business: ")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center justify-center gap-2 min-h-[52px] px-8 font-sans text-[0.7rem] uppercase tracking-[0.18em] whitespace-nowrap"
          >
            <WhatsAppGlyph size={14} />
            Become a founding client
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="py-[var(--sp-7)]">
      <div className="container mx-auto px-6 md:px-12">
        <SectionLabel eyebrow={fb.stepsSection.eyebrow} heading={fb.stepsSection.heading} className="mb-14" />
        <motion.ol initial="hidden" whileInView="visible" viewport={cardViewport} variants={staggerContainer} className="grid gap-px bg-border/40 border border-border/40 sm:grid-cols-2 lg:grid-cols-5">
          {fb.steps.map((s, i) => (
            <motion.li key={s.title} variants={fadeInUp} className="bg-background p-7 flex flex-col gap-3">
              <span className="font-serif text-[2.2rem] leading-none text-ruby">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-serif text-[1.2rem] font-semibold">{s.title}</span>
              <span className="text-[0.92rem] font-sans text-muted-foreground leading-[1.65]">{s.text}</span>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section className="py-[var(--sp-7)] bg-card/40 border-y border-border/30">
      <div className="container mx-auto px-6 md:px-12">
        <SectionLabel eyebrow={fb.proofSection.eyebrow} heading={fb.proofSection.heading} className="mb-4" />
        <p className="text-muted-foreground font-sans mb-12 max-w-2xl">{fb.proofSection.note}</p>
        <motion.div initial="hidden" whileInView="visible" viewport={cardViewport} variants={staggerContainer} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fb.proof.map((p) => (
            <motion.figure key={p.label} variants={fadeInUp} className="border-t border-ruby/40 pt-6 flex flex-col gap-3">
              <span className="font-serif text-[3.2rem] leading-none font-semibold text-foreground">{p.figure}</span>
              <figcaption className="text-[0.95rem] font-sans text-muted-foreground leading-[1.6] flex-grow">{p.label}</figcaption>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[0.7rem] font-sans uppercase tracking-[0.14em] text-muted-foreground hover:text-ruby transition-colors">
                {p.source}
                <ExternalLink size={11} aria-hidden="true" />
              </a>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section className="py-[var(--sp-7)]">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={sectionViewport} variants={fadeInUp} className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <p className="text-[0.68rem] font-sans uppercase tracking-[0.28em] text-ruby mb-5">{fb.demo.eyebrow}</p>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-serif font-semibold leading-[1.1] mb-5">{fb.demo.heading}</h2>
            <p className="text-muted-foreground font-sans leading-[1.8] mb-8 max-w-xl">{fb.demo.body}</p>
            <a href={fb.demo.href} className="btn-outline inline-flex items-center gap-2.5 min-h-[52px] px-8 border border-gold/45 text-gold hover:bg-gold/8 font-sans text-[0.72rem] uppercase tracking-[0.18em]">
              {fb.demo.button}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
          <a href={fb.demo.href} className="group block" aria-label="Open the Ridge House demo page">
            <div className="relative mx-auto w-full max-w-[520px] aspect-[16/11] border border-border/60 bg-[#0E1B17] overflow-hidden shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:-translate-y-1">
              <div className="h-7 bg-[#13241E] border-b border-[#22382F] flex items-center gap-1.5 px-3" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-[#3A5248]" /><span className="w-2 h-2 rounded-full bg-[#3A5248]" /><span className="w-2 h-2 rounded-full bg-[#3A5248]" />
              </div>
              <div className="p-6 sm:p-8 text-left" aria-hidden="true">
                <p className="text-[0.55rem] uppercase tracking-[0.2em] text-[#D4A85A] font-sans font-bold mb-3">Serviced apartments · Airport Residential</p>
                <p className="font-serif text-[#F2EBDD] text-[1.6rem] sm:text-[2rem] leading-[1.05] mb-3">Home in Accra, from the moment you land.</p>
                <p className="text-[#C9C1B2] text-[0.75rem] font-sans mb-5 max-w-[80%]">Book directly with the host on WhatsApp: no platform fees.</p>
                <span className="inline-flex px-4 py-2 rounded-full bg-[#D4A85A] text-[#14130F] text-[0.7rem] font-sans font-bold">Request your dates</span>
                <div className="grid grid-cols-3 gap-2 mt-6">
                  <span className="h-14 sm:h-20 rounded-md bg-[#1A2E26] border border-dashed border-[#4A6358]" />
                  <span className="h-14 sm:h-20 rounded-md bg-[#1A2E26] border border-dashed border-[#4A6358]" />
                  <span className="h-14 sm:h-20 rounded-md bg-[#1A2E26] border border-dashed border-[#4A6358]" />
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="py-[var(--sp-7)] bg-card/40 border-y border-border/30">
      <div className="container mx-auto px-6 md:px-12 grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SectionLabel eyebrow={fb.faqSection.eyebrow} heading={fb.faqSection.heading} />
        <div className="divide-y divide-border/50 border-y border-border/50">
          {fb.faqs.map((f) => (
            <details key={f.q} className="group py-2">
              <summary className="flex items-center justify-between gap-6 min-h-[56px] cursor-pointer list-none font-serif text-[1.2rem] md:text-[1.3rem] [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus size={18} className="shrink-0 text-ruby transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="pb-5 pr-10 text-[0.98rem] font-sans text-muted-foreground leading-[1.8]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ niche }: { niche: Niche }) {
  return (
    <section className="relative overflow-hidden py-[var(--sp-7)]">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 100%, hsl(var(--ruby) / 0.12), transparent 70%)" }} aria-hidden="true" />
      <motion.div initial="hidden" whileInView="visible" viewport={sectionViewport} variants={fadeInUp} className="container mx-auto px-6 md:px-12 relative text-center flex flex-col items-center">
        <h2 className="text-[clamp(2.4rem,6vw,4.6rem)] font-serif font-bold leading-[1.05] max-w-4xl text-balance mb-6">{fb.finalCta.heading}</h2>
        <p className="text-muted-foreground font-sans leading-[1.8] max-w-2xl mb-10">{fb.finalCta.body}</p>
        <a
          href={waLink(fb.niches[niche].whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold group inline-flex items-center justify-center gap-2.5 px-10 py-4 font-sans text-[0.74rem] tracking-[0.2em] uppercase"
        >
          <WhatsAppGlyph />
          {fb.finalCta.button}
          <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" aria-hidden="true" />
        </a>
      </motion.div>
    </section>
  );
}

export default function FullyBooked() {
  const [niche, setNiche] = useState<Niche>("hosts");

  useEffect(() => {
    document.title = fb.seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", fb.seo.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${siteConfig.url}/fully-booked`);
    if (/studio|salon/i.test(window.location.search)) setNiche("studios");
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-ruby/25">
      <Header cta={waLink(fb.niches[niche].whatsapp)} />
      <Hero niche={niche} setNiche={setNiche} />
      <Promise />
      <Tiers />
      <Guarantee />
      <Steps />
      <Proof />
      <Demo />
      <Faq />
      <FinalCta niche={niche} />
      <Footer />
    </main>
  );
}
