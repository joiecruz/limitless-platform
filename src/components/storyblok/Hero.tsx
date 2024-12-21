import { storyblokEditable } from "@storyblok/react";

const Hero = ({ blok }: { blok: any }) => {
  return (
    <div {...storyblokEditable(blok)} className="min-h-[500px] flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{blok.headline}</h1>
        <p className="text-xl text-gray-600 mb-8">{blok.subheadline}</p>
        {blok.cta_text && (
          <a 
            href={blok.cta_link?.url || '#'} 
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {blok.cta_text}
          </a>
        )}
      </div>
    </div>
  );
};

export default Hero;