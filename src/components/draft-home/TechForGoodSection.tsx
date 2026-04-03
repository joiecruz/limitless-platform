import { Heart, Target, Shield } from "lucide-react";

const principles = [
  { icon: Heart, text: "Designed with people, not just for them" },
  { icon: Target, text: "Focused on real problems, not hype" },
  { icon: Shield, text: "Responsible by design" },
];

export function TechForGoodSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#393CA0] mb-6 leading-tight">
              Technology, Designed for People, Can Be a Force for Good
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Technology on its own is neutral. What determines the outcome is how it's designed — and who it's designed for.
            </p>
            <p className="text-gray-600 leading-relaxed">
              At Limitless Lab, we use human-centered design to ensure AI creates systems that are not only smarter, but more inclusive, ethical, and meaningful.
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-sm font-semibold text-[#393CA0] uppercase tracking-wider mb-2">Our principles</p>
            {principles.map((p) => (
              <div key={p.text} className="flex items-start gap-4 bg-gray-50 rounded-lg p-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#66E6F5]/20 flex items-center justify-center">
                  <p.icon className="h-5 w-5 text-[#393CA0]" />
                </div>
                <p className="text-gray-700 font-medium">{p.text}</p>
              </div>
            ))}
            <p className="text-gray-500 italic mt-6 text-sm">
              The future shouldn't just be more advanced. It should be more human.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
