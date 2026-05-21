import { Linkedin, Twitter, Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-card border-t border-border/20 py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-12 border-b border-border/20">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-md bg-ruby/20 border border-ruby/30 flex items-center justify-center">
              <span className="font-serif font-bold text-ruby text-xl">F</span>
            </div>
            <span className="font-serif font-semibold text-xl text-foreground/75 group-hover:text-foreground transition-colors duration-300">{siteConfig.name}</span>
          </a>
          <div className="flex items-center gap-6">
            <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-ruby transition-colors duration-300"><Linkedin size={18} strokeWidth={1.5} /></a>
            <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-ruby transition-colors duration-300"><Twitter size={18} strokeWidth={1.5} /></a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-ruby transition-colors duration-300"><Instagram size={18} strokeWidth={1.5} /></a>
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