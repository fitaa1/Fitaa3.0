import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

type Section = { heading: string; body: string[] };
type Doc = { title: string; intro: string; sections: Section[] };

const UPDATED = "16 October 2026";
const { email, phone } = siteConfig.contact;

const privacy: Doc = {
  title: "Privacy Policy",
  intro:
    "This policy explains what information Fitaa Digital (formerly Fitaa Creative) collects through this website, why, and what you can ask us to do with it.",
  sections: [
    {
      heading: "What we collect",
      body: [
        "Only what you choose to send us. If you use the enquiry form, we receive your name, email address, company or project name, and your message.",
        "If you contact us on WhatsApp, by email or by phone, we receive whatever you share there, along with your number or email address.",
        "This site does not use advertising or analytics cookies, and we do not track you across other websites.",
      ],
    },
    {
      heading: "How we use it",
      body: [
        "To reply to your enquiry, prepare quotes and proposals, and deliver work you have asked us for.",
        "We do not sell, rent or trade your information, and we do not add you to mailing lists without asking.",
      ],
    },
    {
      heading: "Who else handles it",
      body: [
        "Enquiry form messages are delivered to us through Formspree, a form-processing service. WhatsApp messages are handled by WhatsApp. Our website is hosted by Vercel, and fonts are served by Google Fonts, which receives your IP address to deliver them.",
        "Each of these providers processes data under its own privacy terms.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "We keep enquiry details for as long as we need them to respond and, if we work together, for the length of the project and any records we are required to keep. You can ask us to delete them at any time.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Under Ghana's Data Protection Act, 2012 (Act 843), you can ask to see the information we hold about you, have it corrected, or have it deleted. Email us and we will respond promptly.",
      ],
    },
    {
      heading: "Contact",
      body: [`Email ${email} or call ${phone}.`],
    },
  ],
};

const terms: Doc = {
  title: "Terms of Service",
  intro:
    "These terms apply to your use of this website. Work we carry out for clients is covered by a separate quote or agreement.",
  sections: [
    {
      heading: "Using this site",
      body: [
        "You are welcome to browse this site and contact us about your project. Please don't misuse it, for example by attempting to disrupt it or by sending spam through the enquiry form.",
      ],
    },
    {
      heading: "Our work and content",
      body: [
        "The text, design and graphics on this site belong to Fitaa Digital. Client names, logos and brand assets shown in our portfolio remain the property of those clients.",
        "Please don't copy or reuse our content or our clients' work without written permission.",
      ],
    },
    {
      heading: "Quotes and projects",
      body: [
        "Information on this site describes our services in general. Prices, timelines and deliverables for any project are agreed in writing before work begins.",
      ],
    },
    {
      heading: "Links to other sites",
      body: [
        "We link to platforms such as Instagram, Behance and WhatsApp. We are not responsible for their content or how they handle your data.",
      ],
    },
    {
      heading: "No guarantees",
      body: [
        "We keep this site accurate and available, but it is provided as is. To the extent the law allows, we are not liable for losses arising from your use of it.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of the Republic of Ghana. We may update them from time to time; the date below shows the latest version.",
      ],
    },
    {
      heading: "Contact",
      body: [`Questions about these terms? Email ${email} or call ${phone}.`],
    },
  ],
};

export default function Legal({ page }: { page: "privacy" | "terms" }) {
  const doc = page === "privacy" ? privacy : terms;

  useEffect(() => {
    document.title = `${doc.title} — ${siteConfig.name}`;
    window.scrollTo(0, 0);
  }, [doc.title]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/30">
        <div className="container mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3" aria-label="Fitaa Digital home">
            <img src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 rounded-sm" />
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

      <article className="container mx-auto px-6 md:px-12 py-14 md:py-20 max-w-3xl">
        <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-ruby mb-4">Legal</p>
        <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-serif font-bold leading-[1.08] mb-5">{doc.title}</h1>
        <p className="text-muted-foreground font-sans leading-[1.75] mb-12">{doc.intro}</p>

        <div className="space-y-10">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-[1.35rem] font-serif font-semibold mb-3">{s.heading}</h2>
              <div className="space-y-3">
                {s.body.map((p) => (
                  <p key={p} className="text-[0.95rem] text-muted-foreground font-sans leading-[1.8]">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-14 pt-6 border-t border-border/30 text-[0.7rem] font-sans uppercase tracking-[0.18em] text-muted-foreground">
          Last updated {UPDATED}
        </p>
      </article>
    </main>
  );
}
