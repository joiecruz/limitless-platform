import { Helmet } from "react-helmet";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { InfiniteLogos } from "@/components/site-config/InfiniteLogos";
import { HeroSection } from "@/components/draft-home/HeroSection";
import { PeopleWeHelpSection } from "@/components/draft-home/PeopleWeHelpSection";
import { SectorCards } from "@/components/draft-home/SectorCards";
import { TheFutureSection } from "@/components/draft-home/TheFutureSection";
import { TechForGoodSection } from "@/components/draft-home/TechForGoodSection";
import { BuiltInImpactSection } from "@/components/draft-home/BuiltInImpactSection";
import { HowWeWorkSection } from "@/components/draft-home/HowWeWorkSection";
import { PlatformsSection } from "@/components/draft-home/PlatformsSection";
import { SocialProofSection } from "@/components/draft-home/SocialProofSection";
import { AIReadinessSection } from "@/components/draft-home/AIReadinessSection";
import { FinalCTASection } from "@/components/draft-home/FinalCTASection";

export default function DraftHome() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Limitless Lab — Making Tech Work for Humans</title>
        <meta
          name="description"
          content="Limitless Lab helps leaders and teams make AI actually work — driving real results while building inclusive, future-ready organizations."
        />
      </Helmet>

      <MainNav />

      <main className="flex-1">
        <HeroSection />

        {/* Trust Signal */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">
              Trusted by forward-thinking organizations across Southeast Asia
            </p>
            <div className="space-y-4">
              <InfiniteLogos direction="left" logoGroup="rectangular" />
              <InfiniteLogos direction="right" logoGroup="square" />
            </div>
          </div>
        </section>

        <PeopleWeHelpSection />
        <SectorCards />
        <TheFutureSection />
        <TechForGoodSection />
        <BuiltInImpactSection />
        <HowWeWorkSection />
        <PlatformsSection />
        <SocialProofSection />
        <AIReadinessSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
