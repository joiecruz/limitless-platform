import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-[#393CA0] to-[#2a2d7a] text-white overflow-hidden">
      {/* Subtle geometric accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#66E6F5]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#66E6F5]/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Making tech work for humans.
            <br />
            <span className="text-[#66E6F5]">Making humans ready for what's next.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
            Limitless Lab helps leaders and teams make AI actually work — driving real results while building inclusive, future-ready organizations that create lasting impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-[#66E6F5] text-[#393CA0] hover:bg-[#66E6F5]/90 font-semibold text-base px-8"
              onClick={() => window.open("https://calendly.com/limitlesslab", "_blank")}
            >
              Book an AI Strategy Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 text-base px-8"
              onClick={() => navigate("/programs")}
            >
              Explore Our Programs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
