import { useRef, useState } from "react";
import { useRise } from "@/hooks/useRise";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useRegion } from "@/lib/region";
import { SlideSwitch } from "./SlideSwitch";

/** A WhatsApp chat mockup, drawn in HTML and CSS only. The message is the exact text
 *  the site's own service button opens the chat with, read from src/config/site.ts. */
function WhatsAppChat({ message }: { message: string }) {
  // key on the bubble replays a 200 ms fade when the message changes; aria-live reads the new text once.
  return (
    <div className="whatsapp-chat">
      <div className="whatsapp-chat__head">
        <span className="whatsapp-chat__dot" aria-hidden="true" />
        <span className="whatsapp-chat__name">Fitaa Creative</span>
        <span className="whatsapp-chat__time">WhatsApp</span>
      </div>
      <div className="whatsapp-chat__body">
        <p key={message} className="whatsapp-chat__bubble" aria-live="polite">
          {message}<span className="whatsapp-chat__caret" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}

/** The mechanism: one live demo per package, and the booking message as it arrives on
 *  WhatsApp. Drawn in HTML and CSS only; no images, no numbers invented. */
export function SeeItWorking() {
  const { seeItWorking } = siteConfig.servicesSection;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useRise(leftRef);
  useRise(rightRef);

  /* Reality view (SITE_STANDARD.md, 6): the page shows what the system will actually do. Each package's
     button sends one exact message, read from site.ts. Pick a package and the chat shows that message,
     and the link opens WhatsApp with it, on the visitor's own country's number. */
  const packages = siteConfig.services.filter((s) => s.whatsapp);
  const [chosen, setChosen] = useState(packages.find((s) => s.title === "Get Chosen")?.title ?? packages[0]?.title ?? "");
  const current = packages.find((s) => s.title === chosen) ?? packages[0];
  const { waLink } = useRegion();

  return (
    <div className="mt-[var(--sp-6)] pt-10 border-t border-border/20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
        {/* Left: the message as it arrives on WhatsApp */}
        <div ref={leftRef} className="rise lg:col-span-6">
          <p className="text-[0.68rem] font-sans font-medium uppercase tracking-[0.28em] text-gold-text">
            {seeItWorking.heading}
          </p>
          <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.2rem)] font-display font-semibold text-foreground leading-[1.1] tracking-[-0.02em] mb-3">
            {seeItWorking.messageHeading}
          </h3>
          <p className="text-muted-foreground font-sans font-light text-[0.95rem] leading-[1.7] max-w-md mb-6">
            {seeItWorking.lede}
          </p>
          {current && (
            <div className="max-w-[24rem]">
              <SlideSwitch
                label="Show the message for"
                value={current.title}
                onChange={setChosen}
                options={packages.map((s) => ({ value: s.title, label: s.short ?? s.title }))}
              />
              <WhatsAppChat message={current.whatsapp} />
              <a
                href={waLink(current.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 inline-flex items-center gap-2 min-h-[44px] text-[0.68rem] font-sans font-medium uppercase tracking-[0.22em] text-gold-text"
              >
                {seeItWorking.openLabel}
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>

        {/* Right: the live demos */}
        <div ref={rightRef} className="rise lg:col-span-6">
          <p className="text-[0.68rem] font-sans font-medium uppercase tracking-[0.28em] text-gold-text">
            {seeItWorking.demosEyebrow}
          </p>
          <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.2rem)] font-display font-semibold text-foreground leading-[1.1] tracking-[-0.02em] mb-3">
            {seeItWorking.demosHeading}
          </h3>
          <p className="text-muted-foreground font-sans font-light text-[0.95rem] leading-[1.7] max-w-md mb-6">
            {seeItWorking.demosLede}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {seeItWorking.demos.map((demo) => (
              <li key={demo.href}>
                <a
                  href={demo.href}
                  className="group flex items-center justify-between gap-3 min-h-[44px] py-2 border-b border-border/30 hover:border-ruby/50 transition-colors"
                >
                  <span className="font-display text-[1rem] text-foreground/85 group-hover:text-ruby transition-colors">
                    {demo.label}
                  </span>
                  <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-ruby shrink-0 transition-colors" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
