import { User, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIReadinessSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#393CA0] mb-4">
          Start with Clarity. Know Where You Stand.
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Take a free AI Readiness Assessment and get a clear snapshot of your current capability — and what to do next.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Individuals */}
          <div className="bg-gray-50 rounded-xl p-8 text-left border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#66E6F5]/20 flex items-center justify-center mb-5">
              <User className="h-6 w-6 text-[#393CA0]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">For Individuals</h3>
            <p className="text-gray-600 text-sm mb-6">Understand your AI capability and readiness</p>
            <Button
              variant="outline"
              className="border-[#393CA0] text-[#393CA0] hover:bg-[#393CA0] hover:text-white"
              onClick={() => window.open("https://limitlesslab.scoreapp.com/", "_blank")}
            >
              Get your AI readiness score
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Organizations */}
          <div className="bg-gray-50 rounded-xl p-8 text-left border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#66E6F5]/20 flex items-center justify-center mb-5">
              <Building2 className="h-6 w-6 text-[#393CA0]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">For Organizations</h3>
            <p className="text-gray-600 text-sm mb-6">Evaluate your team's readiness and opportunities</p>
            <Button
              variant="outline"
              className="border-[#393CA0] text-[#393CA0] hover:bg-[#393CA0] hover:text-white"
              onClick={() => window.open("https://limitlesslab.scoreapp.com/", "_blank")}
            >
              Get your readiness score
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-gray-500 font-medium mt-10">
          Don't guess your AI strategy. <span className="text-[#393CA0] font-semibold">Diagnose it.</span>
        </p>
      </div>
    </section>
  );
}
