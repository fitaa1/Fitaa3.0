import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "./SectionLabel";
import { staggerContainer, fadeInUp, cardViewport, sectionViewport } from "@/lib/animations";

export function FeaturedWork() {
  return (
    <section id="work" className="py-36 bg-background" aria-labelledby="work-heading">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6"
        >
          <SectionLabel
            eyebrow="Selected Work"
            heading="Real Clients. Real Results."
            headingClass=""
          />
          <a
            href="#contact"
            className="text-xs font-sans uppercase tracking-[0.15em] text-muted-foreground hover:text-ruby transition-colors duration-300 flex items-center gap-2 group shrink-0"
            aria-label="Start a project with Fitaa Digital"
          >
            Start a Project
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" aria-hidden="true" />
          </a>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={cardViewport}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {siteConfig.caseStudies.map((study) => (
            <motion.article key={study.client} variants={fadeInUp} className="group cursor-pointer">
              <a href={study.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${study.client} case study`}>
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-card mb-5">
                  <img
                    src={study.imagePath}
                    alt={`${study.client} — ${study.industry} project by Fitaa Digital`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    width={700}
                    height={437}
                  />
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${study.bg} mix-blend-multiply`} aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" aria-hidden="true" />

                  {/* Result badge — appears on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-background/75 text-ruby text-xs font-sans uppercase tracking-wider backdrop-blur-sm border border-ruby/25">
                      {study.result}
                    </span>
                  </div>

                  {/* Arrow icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-background/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
                    <ArrowUpRight size={14} className="text-foreground" />
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-gold mb-1.5">{study.industry}</p>
                  <h3 className="text-xl md:text-2xl font-serif font-medium text-foreground group-hover:text-ruby transition-colors duration-300">
                    {study.client}
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans font-light mt-1 leading-relaxed">{study.description}</p>
                </div>
              </a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
