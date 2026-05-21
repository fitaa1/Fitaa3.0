import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "./ContactForm";
import { fadeInLeft, fadeInUp, sectionViewport } from "@/lib/animations";
export function FinalCTA() {
  return (
    <section id="contact" className="py-36 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] pointer-events-none opacity-20" style={{ background: "radial-gradient(circle, rgba(155,18,44,0.2), transparent 70%)" }} />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={sectionViewport} className="flex flex-col justify-center">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-ruby mb-5">Start the Conversation</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.05] tracking-[-0.01em] mb-8">Ready to Dominate<br />Your Market?</h2>
            <p className="text-muted-foreground font-sans font-light text-lg mb-12 max-w-md leading-[1.7]">We only partner with brands that are serious about categorical leadership. If that's you, let's talk.</p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail size={16} className="text-gold mt-1 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground mb-1">Email</p>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-foreground font-serif text-lg hover:text-ruby transition-colors duration-300">{siteConfig.contact.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin size={16} className="text-gold mt-1 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground mb-1">Office</p>
                  <p className="text-foreground font-serif text-lg whitespace-pre-line leading-relaxed">{siteConfig.contact.address}</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={sectionViewport}>
            <div className="bg-card border border-border/50 p-8 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-ruby/4 via-transparent to-gold/3 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ruby/40 to-transparent" />
              <div className="relative z-10"><ContactForm /></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}