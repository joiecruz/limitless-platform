import { storyblokEditable } from "@storyblok/react";

const Feature = ({ blok }: { blok: any }) => {
  return (
    <div {...storyblokEditable(blok)} className="py-8">
      <h3 className="text-2xl font-bold mb-4">{blok.name}</h3>
      <p className="text-gray-600">{blok.description}</p>
    </div>
  );
};

export default Feature;