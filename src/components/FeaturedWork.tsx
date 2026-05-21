import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "./SectionLabel";
import { staggerContainer, fadeInUp, cardViewport, sectionViewport } from "@/lib/animations";

export function FeaturedWork() {
  return (
    <section id="work" className="py-[var(--sp-7)] bg-background" aria-labelledby="work-heading">
      <div className="container mx-auto px-6 md:px-12">

        {/* Header row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-[var(--sp-6)] gap-5"
        >
          <SectionLabel eyebrow="Selected Work" heading="Real Clients. Real Results." />
          <a
            href="#contact"
            className="text-[0.7rem] font-sans uppercase tracking-[0.18em] text-muted-foreground hover:text-ruby transition-colors duration-300 flex items-center gap-2 group shrink-0 pb-0.5 nav-link"
            aria-label="Start a project with Fitaa Digital"
          >
            Start a Project
            <ArrowUpRight
              size={13}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-250"
              aria-hidden="true"
            />
          </a>
        </motion.div>

        {/* Grid — 2 columns with equal proportions */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={cardViewport}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {siteConfig.caseStudies.map((study, idx) => (
            <motion.article
              key={study.client}
              variants={fadeInUp}
              className="group"
            >
              <a
                href={study.link}
                target={study.link.startsWith("http") ? "_blank" : undefined}
                rel={study.link.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={`${study.client} — ${study.industry} case study`}
                className="block"
              >
                {/* Image container — φ aspect ratio (golden ratio = 1.618:1) */}
                <div
                  className="relative overflow-hidden bg-card mb-5"
                  style={{ aspectRatio: idx % 2 === 0 ? "1.618 / 1" : "1.272 / 1" }}
                >
                  <img
                    src={study.imagePath}
                    alt={`${study.client} project — ${study.industry}`}
                    className="img-ruby-tint absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                    width={720}
                    height={445}
                  />

                  {/* Brand tint overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${study.bg} opacity-60 mix-blend-multiply`}
                    aria-hidden="true"
                  />

                  {/* Dark vignette */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent transition-opacity duration-500 group-hover:opacity-50"
                    aria-hidden="true"
                  />

                  {/* Result badge — slides up on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                    aria-hidden="true"
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 text-ruby text-[0.68rem] font-sans uppercase tracking-[0.15em] backdrop-blur-sm border border-ruby/25">
                      {study.result}
                    </span>
                  </div>

                  {/* Arrow — top right */}
                  <div
                    className="absolute top-4 right-4 w-8 h-8 bg-background/65 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  >
                    <ArrowUpRight size={13} className="text-foreground" />
                  </div>
                </div>

                {/* Caption */}
                <div className="space-y-1.5">
                  <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-gold">
                    {study.industry}
                  </p>
                  <h3 className="text-[1.5rem] font-serif font-medium text-foreground group-hover:text-ruby transition-colors duration-300 leading-snug">
                    {study.client}
                  </h3>
                  <p className="text-[0.875rem] text-muted-foreground font-sans font-light leading-[1.7]">
                    {study.description}
                  </p>
                </div>
              </a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
