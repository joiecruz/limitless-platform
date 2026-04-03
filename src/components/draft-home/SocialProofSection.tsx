import { Globe, Users, Handshake } from "lucide-react";

const stats = [
  { icon: Globe, label: "Programs delivered across ASEAN" },
  { icon: Users, label: "Millions reached through AI literacy initiatives" },
  { icon: Handshake, label: "Partnerships across public and private sectors" },
];

export function SocialProofSection() {
  return (
    <section className="py-20 bg-[#393CA0] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Trusted by Organizations Driving Change
        </h2>
        <p className="text-white/70 mb-14 max-w-2xl mx-auto">
          From corporations to governments to regional initiatives, we work with leaders shaping the future of AI in Southeast Asia.
        </p>

        <div className="grid sm:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <stat.icon className="h-7 w-7 text-[#66E6F5]" />
              </div>
              <p className="text-white/90 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
