import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  body: string;
  photo_url?: string | null;
}

function Avatar({ name, photo_url }: { name: string; photo_url?: string | null }) {
  if (photo_url) {
    return (
      <img
        src={photo_url}
        alt={name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    );
  }
  const initial = name?.trim()?.[0]?.toUpperCase() ?? "?";
  return (
    <div className="w-10 h-10 rounded-full bg-[#393CA0]/10 text-[#393CA0] font-semibold flex items-center justify-center flex-shrink-0">
      {initial}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="w-[340px] flex-shrink-0 bg-white rounded-xl border border-gray-200 p-6 mx-3">
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={t.name} photo_url={t.photo_url} />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{t.name}</p>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{t.body}</p>
    </div>
  );
}

export function TestimonialsRailSection() {
  const { data: testimonials } = useQuery({
    queryKey: ["ai-homepage-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, name, role, body, photo_url")
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) return [] as Testimonial[];
      return data as Testimonial[];
    },
    staleTime: 30 * 60 * 1000,
  });

  if (!testimonials?.length) return null;

  const mid = Math.ceil(testimonials.length / 2);
  const row1 = testimonials.slice(0, mid);
  const row2 = testimonials.slice(mid);
  // Duplicate for seamless loop
  const r1 = [...row1, ...row1];
  const r2 = [...row2, ...row2];

  return (
    <section className="py-24 bg-[#F5F5FB] overflow-hidden">
      <style>{`
        @keyframes ai-marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ai-marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .ai-marquee-row { display: flex; width: max-content; }
        .ai-marquee-left { animation: ai-marquee-left 60s linear infinite; }
        .ai-marquee-right { animation: ai-marquee-right 60s linear infinite; }
        .ai-marquee-mask {
          mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%);
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          What Our Customers and Stakeholders Are Saying
        </h2>
      </div>
      <div className="space-y-6 ai-marquee-mask">
        <div className="ai-marquee-row ai-marquee-left">
          {r1.map((t, i) => (
            <TestimonialCard key={`r1-${t.id}-${i}`} t={t} />
          ))}
        </div>
        <div className="ai-marquee-row ai-marquee-right">
          {r2.map((t, i) => (
            <TestimonialCard key={`r2-${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
