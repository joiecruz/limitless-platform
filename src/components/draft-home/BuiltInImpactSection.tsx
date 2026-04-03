import { BookOpen, Users, Network } from "lucide-react";

const items = [
  { icon: BookOpen, title: "Cross-subsidized learning programs" },
  { icon: Users, title: "Workforce inclusion across all levels" },
  { icon: Network, title: "Regional ecosystem building through large-scale initiatives" },
];

export function BuiltInImpactSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#393CA0] mb-4">
          Every Transformation Creates a Ripple Effect
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          When organizations become AI-ready, the impact goes beyond business performance. Every engagement contributes to building AI capability across communities, educators, and underserved sectors across Southeast Asia.
        </p>

        <p className="text-sm font-semibold text-[#393CA0] uppercase tracking-wider mb-8">How we do it</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#393CA0]/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-6 w-6 text-[#393CA0]" />
              </div>
              <p className="text-gray-700 font-medium text-sm">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
