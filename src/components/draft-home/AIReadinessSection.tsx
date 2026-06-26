import { useNavigate } from "react-router-dom";
import { User, Building2, ArrowRight, Sparkles } from "lucide-react";
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

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Free Assessment
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Start with clarity.
                <span className="block text-[#66E6F5]">Know where you stand.</span>
              </h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-xl">
                Take a free AI Readiness Assessment and get a clear snapshot of your current capability — and what to do next.
              </p>
              <p className="text-white/70 mt-6 text-base">
                Don't guess your AI strategy.{" "}
                <span className="text-[#66E6F5] font-semibold">Diagnose it.</span>
              </p>
            </div>

            {/* Right: two cards */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-6 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-[#393CA0]/10 flex items-center justify-center mb-5">
                  <User className="h-6 w-6 text-[#393CA0]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">For Individuals</h3>
                <p className="text-gray-600 text-base mb-6 flex-1">
                  Understand your AI capability and readiness.
                </p>
                <Button
                  className="w-full bg-[#393CA0] hover:bg-[#393CA0]/90 text-white justify-between"
                  onClick={() => window.open("https://limitlesslab.scoreapp.com/", "_blank")}
                >
                  Get your score
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-white rounded-2xl p-6 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-[#393CA0]/10 flex items-center justify-center mb-5">
                  <Building2 className="h-6 w-6 text-[#393CA0]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">For Organizations</h3>
                <p className="text-gray-600 text-base mb-6 flex-1">
                  Evaluate your team's readiness and opportunities.
                </p>
                <Button
                  className="w-full bg-[#393CA0] hover:bg-[#393CA0]/90 text-white justify-between"
                  onClick={() => window.open("https://limitlesslab.scoreapp.com/", "_blank")}
                >
                  Get your score
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
