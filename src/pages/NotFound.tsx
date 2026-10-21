import { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/* Shown for any address that isn't a real page. Vercel serves it from /404.html
   with a 404 status (see vercel.json and scripts/static-pages.mjs). */
export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found | Fitaa Creative";
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/30">
        <div className="container mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3" aria-label="Fitaa Creative home">
            <img src="/logo-160.webp" alt="" width={36} height={36} className="h-9 w-9 rounded-sm" />
            <span className="font-serif font-semibold tracking-[0.15em] text-[1.05rem]">FITAA</span>
          </a>
          <a
            href="/"
            className="flex items-center gap-2 text-[0.7rem] font-sans uppercase tracking-[0.18em] text-muted-foreground hover:text-ruby transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to site
          </a>
        </div>
      </header>

      <section className="flex-1 flex items-center">
        <div className="container mx-auto px-6 md:px-12 py-20 md:py-28 max-w-3xl">
          <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-ruby mb-4">Error 404</p>
          <h1 className="text-[clamp(2.4rem,6vw,4rem)] font-serif font-bold leading-[1.05] mb-6">
            This page isn&rsquo;t here.
          </h1>
          <p className="text-muted-foreground font-sans leading-[1.75] mb-10 max-w-xl">
            The link may be old or mistyped. Everything Fitaa Creative does for Accra brands is one tap away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/"
              className="btn-gold group inline-flex items-center justify-center px-10 py-4 font-sans text-[0.72rem] tracking-[0.22em] uppercase w-full sm:w-auto"
            >
              <span className="flex items-center gap-2.5">
                Go to the home page
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-350" aria-hidden="true" />
              </span>
            </a>
            <a
              href="/fully-booked"
              className="btn-outline inline-flex items-center justify-center px-10 py-4 border border-gold/40 text-gold hover:bg-gold/8 hover:border-gold/70 font-sans font-light text-[0.72rem] tracking-[0.22em] uppercase w-full sm:w-auto"
            >
              See Fully Booked
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
