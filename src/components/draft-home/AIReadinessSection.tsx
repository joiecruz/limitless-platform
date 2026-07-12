import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIReadinessSection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-[#393CA0] via-[#4548B8] to-[#393CA0] p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#66E6F5]/20 blur-3xl" aria-hidden />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" aria-hidden />

          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Start with clarity.
              <span className="block text-[#66E6F5]">Know where you stand.</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/80 mb-8">
              Talk to a Limitless Lab strategist for 30 focused minutes and leave with clear next steps — no obligation.
            </p>
            <Button
              size="lg"
              className="bg-white text-[#393CA0] hover:bg-white/90 font-semibold"
              onClick={() => navigate("/book-consultation")}
            >
              Book a free consultation
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
