import { Navbar }       from "@/components/Navbar";
import { Hero }         from "@/components/Hero";
import { Services }     from "@/components/Services";
import { WhyUs }        from "@/components/WhyUs";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Testimonials } from "@/components/Testimonials";
import { FinalCTA }     from "@/components/FinalCTA";
import { Footer }       from "@/components/Footer";
import { ScrollToTop }  from "@/components/ScrollToTop";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { KenteSeam } from "@/components/KenteSeam";
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-ruby/25 selection:text-foreground">
      <Navbar /><Hero /><KenteSeam /><Services /><WhyUs /><FeaturedWork />
      <Testimonials /><KenteSeam /><FinalCTA /><Footer /><ScrollToTop /><FloatingWhatsApp />
    </main>
  );
}