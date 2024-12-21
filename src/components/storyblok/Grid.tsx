import { storyblokEditable } from "@storyblok/react";
import { StoryblokComponent } from "@storyblok/react";

const Grid = ({ blok }: { blok: any }) => {
  return (
    <div {...storyblokEditable(blok)} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
      {blok.columns?.map((nestedBlok: any) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};

export default Grid;