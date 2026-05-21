import { Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";

function BehanceIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 6h7.5a3.5 3.5 0 0 1 0 7H1V6z" />
      <path d="M1 13h8.5a3.5 3.5 0 0 1 0 7H1v-7z" />
      <path d="M14 8h8" />
      <path d="M22 14.5c0 2.5-2 4.5-4.5 4.5S13 17 13 14.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-card border-t border-border/20 py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-12 border-b border-border/20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group" aria-label="Fitaa Digital home">
            <img
              src="/logo.png"
              alt="Fitaa Digital logo"
              className="h-10 w-10 rounded-md object-cover"
              width={40}
              height={40}
              loading="lazy"
            />
            <span className="font-serif font-semibold text-xl text-foreground/75 group-hover:text-foreground transition-colors duration-300 leading-none">
              FITAA<br />
              <span className="text-gold text-[10px] tracking-[0.3em] font-sans font-light">—DIGITAL—</span>
            </span>
          </a>

          {/* Social links */}
          <div className="flex items-center gap-6" aria-label="Social media links">
            <a
              href={siteConfig.social.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-ruby transition-colors duration-300"
              aria-label="Fitaa Digital on Behance"
            >
              <BehanceIcon size={18} />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-ruby transition-colors duration-300"
              aria-label="Fitaa Digital on Instagram"
            >
              <Instagram size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-[11px] font-sans uppercase tracking-[0.15em] text-muted-foreground">
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground/60 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-foreground/60 transition-colors duration-300">Terms of Service</a>
          </div>
          <p className="opacity-60">&copy; {year} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
