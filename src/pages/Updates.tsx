import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { usePageTitle } from "@/hooks/usePageTitle";
import { format } from "date-fns";
import { Rocket, Wrench, Bug, Shield, Settings } from "lucide-react";

const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  feature: { label: "New Feature", icon: Rocket, color: "bg-emerald-100 text-emerald-700" },
  improvement: { label: "Improvement", icon: Wrench, color: "bg-blue-100 text-blue-700" },
  bugfix: { label: "Bug Fix", icon: Bug, color: "bg-amber-100 text-amber-700" },
  security: { label: "Security", icon: Shield, color: "bg-red-100 text-red-700" },
  maintenance: { label: "Maintenance", icon: Settings, color: "bg-gray-100 text-gray-700" },
};

export default function Updates() {
  usePageTitle("Platform Updates | Limitless Lab");

  const { data: updates, isLoading } = useQuery({
    queryKey: ["platform-updates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_updates")
        .select("id, title, description, version, update_type, changes, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <OpenGraphTags
        title="Platform Updates | Limitless Lab"
        description="Stay up to date with the latest features, improvements, and fixes on the Limitless Lab platform."
        imageUrl="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"
        url={`${window.location.origin}/updates`}
        type="website"
      />

      <MainNav />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Platform Updates</h1>
          <p className="text-lg text-gray-500 mb-12">
            What's new, improved, and fixed in Limitless Lab.
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#393CA0]"></div>
            </div>
          ) : !updates?.length ? (
            <p className="text-gray-500">No updates yet. Check back soon!</p>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gray-200" />

              <div className="space-y-10">
                {updates.map((update) => {
                  const config = typeConfig[update.update_type || "improvement"];
                  const Icon = config.icon;
                  const changes = Array.isArray(update.changes) ? update.changes : [];

                  return (
                    <div key={update.id} className="relative pl-12">
                      {/* Timeline dot */}
                      <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-[#393CA0] ring-4 ring-white" />

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <time className="text-sm text-gray-400 font-mono">
                            {format(new Date(update.published_at), "MMM d, yyyy")}
                          </time>
                          {update.version && (
                            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              v{update.version}
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${config.color}`}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900">{update.title}</h2>

                        {update.description && (
                          <p className="text-gray-600">{update.description}</p>
                        )}

                        {changes.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {changes.map((change, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#393CA0] shrink-0" />
                                {String(change)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
