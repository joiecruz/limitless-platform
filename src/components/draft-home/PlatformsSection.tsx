import { useNavigate } from "react-router-dom";
import { Briefcase, Landmark, Layers } from "lucide-react";

const platforms = [
  {
    icon: Briefcase,
    name: "LimitlessBiz",
    description: "AI tools and learning systems for businesses to improve operations, marketing, and decision-making",
    link: "/limitlessbiz",
  },
  {
    icon: Landmark,
    name: "LimitlessGov",
    description: "Human-centered AI platform for governance and public sector transformation",
    link: "/programs/limitlessgov",
  },
  {
    icon: Layers,
    name: "Limitless Platform",
    description: "AI-powered system for managing innovation, insights, and transformation across organizations",
    link: "/product",
  },
];

export function PlatformsSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#393CA0] mb-4">
          Technology That Powers Real Transformation
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          We support every transformation with platforms designed for real-world use.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {platforms.map((p) => (
            <div
              key={p.name}
              onClick={() => navigate(p.link)}
              className="cursor-pointer bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#393CA0]/20 transition-all duration-300 text-left group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#393CA0] flex items-center justify-center mb-5 group-hover:bg-[#66E6F5] transition-colors">
                <p.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{p.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-8 italic">
          These are not standalone tools — they are embedded into how transformation happens.
        </p>
      </div>
    </section>
  );
}
