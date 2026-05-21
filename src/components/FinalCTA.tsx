import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "./ContactForm";
import { fadeInLeft, fadeInUp, sectionViewport } from "@/lib/animations";

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const tabVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

type Tab = "form" | "whatsapp";

function ContactCard() {
  const [tab, setTab] = useState<Tab>("form");

  const waNumber = siteConfig.contact.phone.replace(/\D/g, "").replace(/^0/, "233");
  const waMessage = encodeURIComponent("Hi Fitaa Digital! I'd like to discuss a project with you.");
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div className="bg-card border border-border/45 relative overflow-hidden">
      {/* Subtle gradient fill */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-ruby/4 via-transparent to-gold/2 pointer-events-none"
        aria-hidden="true"
      />
      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ruby/35 to-transparent"
        aria-hidden="true"
      />

      {/* ── Tab bar ─────────────────────────────────────────── */}
      <div
        className="relative z-10 flex border-b border-border/35"
        role="tablist"
        aria-label="Contact options"
      >
        {(["form", "whatsapp"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={active}
              aria-controls={`tabpanel-${t}`}
              onClick={() => setTab(t)}
              className={`
                relative flex items-center gap-2 flex-1 justify-center
                px-4 py-4 font-sans text-[0.65rem] uppercase tracking-[0.22em]
                transition-colors duration-250 outline-none
                focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ruby/50
                ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"}
              `}
            >
              {t === "form"
                ? <Mail size={13} strokeWidth={1.5} aria-hidden="true" />
                : <WhatsAppIcon size={13} />
              }
              {t === "form" ? "Send Enquiry" : "WhatsApp"}

              {/* Active underline */}
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab panels ──────────────────────────────────────── */}
      <div className="relative z-10 p-8 md:p-10">
        <AnimatePresence mode="wait" initial={false}>
          {tab === "form" ? (
            <motion.div
              key="form"
              id="tabpanel-form"
              role="tabpanel"
              aria-labelledby="tab-form"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ContactForm />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              id="tabpanel-whatsapp"
              role="tabpanel"
              aria-labelledby="tab-whatsapp"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center justify-center text-center py-10 px-4"
            >
              {/* Icon halo */}
              <div className="relative mb-8">
                <div
                  className="absolute inset-0 rounded-full blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(37,211,102,0.18) 0%, transparent 70%)" }}
                  aria-hidden="true"
                />
                <div className="relative w-16 h-16 rounded-full border border-[#25D366]/30 bg-[#25D366]/8 flex items-center justify-center text-[#25D366]">
                  <WhatsAppIcon size={28} />
                </div>
              </div>

              <h4 className="font-serif text-[1.5rem] font-medium text-foreground mb-3 leading-snug">
                Prefer a quick conversation?
              </h4>
              <p className="text-muted-foreground font-sans font-light text-[0.9375rem] max-w-xs leading-[1.72] mb-2">
                Message us directly on WhatsApp. We typically reply within the hour.
              </p>
              <p className="text-gold font-serif text-[1.0625rem] mb-10 tracking-wide">
                {siteConfig.contact.phone}
              </p>

              {/* Gold CTA */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-3 px-10 py-4 font-sans text-[0.72rem] uppercase tracking-[0.22em] mb-6"
                aria-label="Open WhatsApp chat with Fitaa Digital"
              >
                <WhatsAppIcon size={15} />
                Chat on WhatsApp
              </a>

              <p className="text-[0.65rem] font-sans uppercase tracking-[0.18em] text-muted-foreground/50">
                Opens WhatsApp — mobile or desktop
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="py-[var(--sp-7)] bg-background relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Centre glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] h-[65vw] max-w-[650px] max-h-[650px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(155,18,44,0.14) 0%, transparent 70%)",
          opacity: 0.55,
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-[3.4375rem]">

          {/* Left — contact info */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <span className="text-[0.68rem] font-sans uppercase tracking-[0.28em] text-ruby mb-5">
              Start the Conversation
            </span>

            <h2
              id="contact-heading"
              className="text-[clamp(2.2rem,5vw,3.5rem)] font-serif font-bold text-foreground leading-[1.08] tracking-[-0.012em] mb-[1.3125rem]"
            >
              Ready to Elevate<br />Your Brand?
            </h2>

            <p className="text-muted-foreground font-sans font-light text-[1.0625rem] mb-[3.4375rem] max-w-sm leading-[1.75]">
              Whether it's a billboard campaign, a striking new identity, or a complete digital presence — let's make it happen.
            </p>

            {/* Contact details */}
            <div className="space-y-[1.3125rem]">
              <div className="flex items-start gap-4">
                <Mail size={15} className="text-gold mt-1 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-muted-foreground mb-1">Email</p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-foreground font-serif text-[1.125rem] hover:text-ruby transition-colors duration-300"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              {siteConfig.contact.phone && (
                <div className="flex items-start gap-4">
                  <Phone size={15} className="text-gold mt-1 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-muted-foreground mb-1">Phone</p>
                    <a
                      href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                      className="text-foreground font-serif text-[1.125rem] hover:text-ruby transition-colors duration-300"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <MapPin size={15} className="text-gold mt-1 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-muted-foreground mb-1">Location</p>
                  <p className="text-foreground font-serif text-[1.125rem]">{siteConfig.contact.address}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — tabbed card */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="lg:col-span-7"
          >
            <ContactCard />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
