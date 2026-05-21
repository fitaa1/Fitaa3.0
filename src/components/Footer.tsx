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
    <footer className="bg-card border-t border-border/20 py-14">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-10 border-b border-border/20">

          {/* Logo lockup */}
          <a
            href="#home"
            className="flex items-center gap-3.5 group"
            aria-label="Fitaa Digital — back to top"
          >
            <img
              src="/logo.png"
              alt="Fitaa Digital logo"
              className="h-10 w-10 object-cover rounded-sm transition-transform duration-350 group-hover:scale-105"
              width={40}
              height={40}
              loading="lazy"
            />
            <div className="leading-none">
              <span className="block font-serif font-semibold text-[1.05rem] tracking-[0.15em] text-foreground/75 group-hover:text-foreground transition-colors duration-300">
                FITAA
              </span>
              <span className="block font-sans font-light text-[0.55rem] tracking-[0.42em] text-gold mt-[1px]">
                —DIGITAL—
              </span>
            </div>
          </a>

          {/* Social links */}
          <nav className="flex items-center gap-6" aria-label="Fitaa Digital social media">
            <a
              href={siteConfig.social.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-ruby transition-colors duration-300 p-1"
              aria-label="View Fitaa Digital's portfolio on Behance"
            >
              <BehanceIcon size={17} />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-ruby transition-colors duration-300 p-1"
              aria-label="Follow Fitaa Digital on Instagram"
            >
              <Instagram size={17} strokeWidth={1.5} />
            </a>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-7 text-[0.66rem] font-sans uppercase tracking-[0.15em] text-muted-foreground">
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground/55 transition-colors duration-250">Privacy Policy</a>
            <a href="#" className="hover:text-foreground/55 transition-colors duration-250">Terms of Service</a>
          </div>
          <p className="opacity-55">&copy; {year} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
