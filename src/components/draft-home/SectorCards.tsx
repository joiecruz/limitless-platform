import { Building2, Landmark, Rocket, Globe, GraduationCap } from "lucide-react";

const sectors = [
  {
    icon: Building2,
    title: "Corporations & Mid-Sized Companies",
    description: "Turn AI into real business performance — from strategy to execution.",
  },
  {
    icon: Landmark,
    title: "Government & LGUs",
    description: "Build AI-ready institutions that deliver smarter, more responsive public services.",
  },
  {
    icon: Rocket,
    title: "SMEs & Business Owners",
    description: "Use AI to work smarter, grow faster, and stay competitive.",
  },
  {
    icon: Globe,
    title: "Development Organizations & NGOs",
    description: "Scale impact with AI while staying human-centered and mission-driven.",
  },
  {
    icon: GraduationCap,
    title: "Students, Educators & Communities",
    description: "Build the next generation of AI-ready citizens across Southeast Asia.",
  },
];

export function SectorCards() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sectors.map((sector) => (
            <div
              key={sector.title}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#66E6F5]/40 transition-all duration-300 group"
            >
              <sector.icon className="h-10 w-10 text-[#393CA0] mb-4 group-hover:text-[#66E6F5] transition-colors" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{sector.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{sector.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
