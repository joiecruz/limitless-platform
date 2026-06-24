import { Helmet } from "react-helmet";
import { AINav } from "@/components/ai-homepage/AINav";
import { Footer } from "@/components/site-config/Footer";

interface PersonaShellProps {
  title: string;
  tagline: string;
  metaDescription: string;
}

export function PersonaShell({ title, tagline, metaDescription }: PersonaShellProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{title} | Limitless Lab</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <AINav />
      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-20 min-h-[60vh]">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">{tagline}</p>
          <p className="text-sm uppercase tracking-widest text-[#393CA0] font-semibold">
            Coming soon
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
