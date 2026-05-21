import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "./ContactForm";
import { fadeInLeft, fadeInUp, sectionViewport } from "@/lib/animations";

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
        {/*
          Golden ratio split: 5/12 left info, 7/12 right form
          ≈ 41.6% : 58.3% — close to 1/φ : 1/φ²
        */}
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
                  <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-muted-foreground mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-foreground font-serif text-[1.125rem] hover:text-ruby transition-colors duration-300"
                    aria-label={`Email us at ${siteConfig.contact.email}`}
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              {siteConfig.contact.phone && (
                <div className="flex items-start gap-4">
                  <Phone size={15} className="text-gold mt-1 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-muted-foreground mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                      className="text-foreground font-serif text-[1.125rem] hover:text-ruby transition-colors duration-300"
                      aria-label={`Call us at ${siteConfig.contact.phone}`}
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <MapPin size={15} className="text-gold mt-1 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-muted-foreground mb-1">
                    Location
                  </p>
                  <p className="text-foreground font-serif text-[1.125rem] whitespace-pre-line leading-relaxed">
                    {siteConfig.contact.address}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="lg:col-span-7"
          >
            <div className="bg-card border border-border/45 p-8 md:p-10 relative overflow-hidden">
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
              <div className="relative z-10">
                <ContactForm />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
