import { Helmet } from "react-helmet";
import { AINav } from "@/components/ai-homepage/AINav";
import { Footer } from "@/components/site-config/Footer";

interface PersonaShellProps {
  title: string;
  tagline: string;
  metaDescription: string;
  /** Path of this page relative to root, e.g. "/entrepreneurs" */
  path: string;
  /** Audience name for JSON-LD (e.g. "Entrepreneurs and business owners") */
  audience: string;
}

export function PersonaShell({ title, tagline, metaDescription, path, audience }: PersonaShellProps) {
  const url = `https://limitlesslab.org${path}`;
  const fullTitle = `${title} | Limitless Lab`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: fullTitle,
    url,
    description: metaDescription,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: "Limitless Lab",
      url: "https://limitlesslab.org/",
    },
    about: {
      "@type": "Audience",
      audienceType: audience,
    },
    publisher: {
      "@type": "Organization",
      name: "Limitless Lab",
      url: "https://limitlesslab.org/",
    },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
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
