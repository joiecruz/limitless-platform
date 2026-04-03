import { Brain, Cog, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Brain,
    number: "01",
    title: "Build Capability",
    description: "Your team understands AI and starts using it confidently",
  },
  {
    icon: Cog,
    number: "02",
    title: "Apply in Practice",
    description: "AI is integrated into real workflows and projects",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Sustain & Scale",
    description: "AI becomes part of how your organization evolves continuously",
  },
];

export function HowWeWorkSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#393CA0] mb-4">
          From Awareness to Transformation — By Design
        </h2>
        <p className="text-gray-600 mb-14 max-w-2xl mx-auto">
          We don't just teach AI. We design how it works inside your organization.
        </p>

        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={step.title} className="relative">
              {idx < steps.length - 1 && (
                <div className="hidden sm:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#393CA0]/20 to-[#66E6F5]/30" />
              )}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#393CA0] to-[#393CA0]/80 flex items-center justify-center mb-5 shadow-lg">
                  <step.icon className="h-9 w-9 text-white" />
                </div>
                <span className="text-xs font-bold text-[#66E6F5] uppercase tracking-widest mb-2">{step.number}</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
