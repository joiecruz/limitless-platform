import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#393CA0] to-[#2a2d7a] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Start Building What's Next — By Design
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
          Whether you're just starting or scaling your AI journey, we'll help you move forward with clarity and confidence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            onClick={() => window.open("https://calendly.com/limitlesslab", "_blank")}
          >
            Talk to Our Team
          </Button>
        </div>
      </div>
    </section>
  );
}
