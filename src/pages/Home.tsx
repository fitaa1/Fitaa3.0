import { Navbar }       from "@/components/Navbar";
import { Hero }         from "@/components/Hero";
import { Services }     from "@/components/Services";
import { WhyUs }        from "@/components/WhyUs";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Testimonials } from "@/components/Testimonials";
import { FinalCTA }     from "@/components/FinalCTA";
import { Footer }       from "@/components/Footer";
import { ScrollToTop }  from "@/components/ScrollToTop";
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-ruby/25 selection:text-foreground">
      <Navbar /><Hero /><Services /><WhyUs /><FeaturedWork />
      <Testimonials /><FinalCTA /><Footer /><ScrollToTop />
    </main>
  );
}