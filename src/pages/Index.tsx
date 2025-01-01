import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Features } from "@/components/site-config/Features";
import { CTASection } from "@/components/site-config/CTASection";
import { LoadingPage } from "@/components/common/LoadingPage";
import { Suspense } from "react";
import { HeroSection } from "@/components/site-config/HeroSection";
import { LogoSection } from "@/components/site-config/LogoSection";
import { BlogSectionWrapper } from "@/components/site-config/BlogSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <HeroSection />
      <LogoSection />
      <Suspense fallback={<LoadingPage />}>
        <Features />
      </Suspense>
      <BlogSectionWrapper />
      <CTASection />
      <Footer />
    </div>
  );
}