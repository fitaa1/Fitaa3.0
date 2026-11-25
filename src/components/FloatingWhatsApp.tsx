import { useState } from "react";
import { siteConfig } from "@/config/site";
import { CodedLabel } from "@/components/CodedLabel";
import { useAdaptiveCta } from "@/hooks/useAdaptiveCta";
import { useRegion } from "@/lib/region";
import { useScrolledPast } from "@/hooks/useScrolledPast";
import { usePresence } from "@/lib/reveal";
import { WhatsAppIcon } from "@/components/icons";

export function FloatingWhatsApp() {
  const { label, message } = useAdaptiveCta();
  const { waLink } = useRegion();
  const show = useScrolledPast(400);
  const { mounted, visible } = usePresence(show, 300);
  const [coding, setCoding] = useState(false);
  if (!mounted) return null;

  const text = label || siteConfig.hero.dataCtaLabel;

  return (
    <a
      href={waLink(message || siteConfig.hero.dataCtaMessage)}
      target="_blank"
      rel="noopener"
      className={`floating-wa${coding ? " is-coding" : ""} fixed bottom-5 left-5 md:bottom-8 md:left-8 z-40 flex items-center gap-2.5 pl-3 pr-4 min-h-[44px] bg-[#25D366] text-white rounded-full shadow-lg`}
      aria-label={`WhatsApp: ${text}`}
    >
      <WhatsAppIcon size={20} />
      <CodedLabel text={text} onCoding={setCoding} className="cta-label text-[0.68rem] font-sans uppercase tracking-[0.18em]" />
    </a>
  );
}
