import { useState, useEffect, lazy, Suspense, useRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useRise } from "@/hooks/useRise";
import { formatPhone, useRegion } from "@/lib/region";
import { WhatsAppIcon } from "@/components/icons";

/* The enquiry form (and its validation libraries) loads separately to keep the first load small. */
const loadForm = () => import("./ContactForm");
const ContactForm = lazy(() => loadForm().then((m) => ({ default: m.ContactForm })));

/** All wording for this section lives in siteConfig.contactSection. */
const copy = siteConfig.contactSection;

type Tab = "form" | "whatsapp";

function ContactCard() {
  const [tab, setTab] = useState<Tab>("whatsapp");

  /* Fetch the enquiry form in the background once the page is idle. */
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => void loadForm());
    else setTimeout(() => void loadForm(), 2500);
  }, []);

  /* WhatsApp goes to the UK line for visitors in the UK, the Ghana line for everyone else. */
  const { waNumber, waLink: wa } = useRegion();
  const waLink = wa("Hi Fitaa Creative! I'd like to discuss a project with you.");

  return (
    <div className="bg-card border border-border/45 relative overflow-hidden">
      {/* ── Tab bar ─────────────────────────────────────────── */}
      <div
        className="relative z-10 flex border-b border-border/35"
        role="tablist"
        aria-label="Contact options"
        data-glide=""
      >
        {(["whatsapp", "form"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              id={`tab-${t}`}
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
              {t === "form" ? copy.formTab : copy.whatsappTab}

              {/* Active underline */}
              {active && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab panels ──────────────────────────────────────── */}
      <div className="relative z-10 p-8 md:p-10">
        <div className="relative z-10">
          {tab === "form" ? (
            <div
              key="form"
              id="tabpanel-form"
              role="tabpanel"
              aria-labelledby="tab-form"
              className="min-h-[30rem]"
              aria-busy="true"
            >
              <Suspense fallback={<div className="min-h-[30rem]" aria-busy="true" />}>
                <ContactForm />
              </Suspense>
            </div>
          ) : (
            <div
              key="whatsapp"
              id="tabpanel-whatsapp"
              role="tabpanel"
              aria-labelledby="tab-whatsapp"
              className="flex flex-col items-center justify-center text-center py-10 px-4"
            >
              {/* Icon halo */}
              <div className="relative mb-8">
                <div className="relative w-16 h-16 rounded-full border border-[#25D366]/30 bg-[#25D366]/8 flex items-center justify-center text-[#25D366]">
                  <WhatsAppIcon size={28} />
                </div>
              </div>

              <h3 className="font-display text-[1.5rem] font-medium text-foreground mb-3 leading-snug">
                {copy.whatsappHeading}
              </h3>
              <p className="text-muted-foreground font-sans font-light text-[0.9375rem] max-w-xs leading-[1.72] mb-2">
                {copy.whatsappBody}
              </p>
              <p className="text-gold font-sans font-medium tabular-nums text-[1.0625rem] mb-10 tracking-wide">
                {formatPhone(waNumber)}
              </p>

              {/* Gold CTA */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center justify-center gap-3 px-7 sm:px-10 py-4 font-sans text-[0.72rem] uppercase tracking-[0.18em] sm:tracking-[0.22em] whitespace-nowrap mb-6"
                aria-label="Open WhatsApp chat with Fitaa Creative"
              >
                <WhatsAppIcon size={15} />
                {copy.whatsappButton}
              </a>

              <p className="text-[0.65rem] font-sans uppercase tracking-[0.18em] text-muted-foreground/50">
                {copy.whatsappNote}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FinalCTA() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useRise(leftRef);
  useRise(rightRef);

  return (
    <section
      id="contact"
      data-cta-label={siteConfig.contactSection.dataCtaLabel}
      data-cta-message={siteConfig.contactSection.dataCtaMessage}
      data-cta-hidden
      className="py-[var(--sp-7)] plane-ground relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-[3.4375rem]">

          {/* Left — contact info */}
          <div ref={leftRef} className="rise lg:col-span-5 flex flex-col justify-center">
            <span className="text-[0.68rem] font-sans uppercase tracking-[0.28em] text-ruby mb-5">
              {copy.eyebrow}
            </span>

            <h2
              id="contact-heading"
              className="text-[clamp(2.2rem,5vw,3.5rem)] font-display font-bold text-foreground leading-[1.08] tracking-[-0.012em] mb-[1.3125rem]"
            >
              {copy.heading[0]}<br />{copy.heading[1]}
            </h2>

            <p className="text-muted-foreground font-sans font-light text-[1.0625rem] mb-[3.4375rem] max-w-sm leading-[1.75]">
              {copy.body}
            </p>

            {/* Contact details */}
            <div className="space-y-[1.3125rem]">
              <div className="flex items-start gap-4">
                <Mail size={15} className="text-gold mt-1 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-muted-foreground mb-1">Email</p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-foreground font-display text-[1.125rem] hover:text-ruby transition-colors duration-300"
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
                      className="text-foreground font-sans font-medium tabular-nums text-[1.0625rem] hover:text-ruby transition-colors duration-300"
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
                  <p className="text-foreground font-display text-[1.125rem]">{siteConfig.contact.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — tabbed card */}
          <div ref={rightRef} className="rise lg:col-span-7">
            <ContactCard />
          </div>

        </div>
      </div>
    </section>
  );
}