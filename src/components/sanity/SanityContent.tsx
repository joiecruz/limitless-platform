import { Hero } from "@/components/storyblok/Hero";
import { Feature } from "@/components/storyblok/Feature";
import { Page } from "@/integrations/sanity/types";
import { urlFor } from "@/integrations/sanity/client";

interface SanityContentProps {
  content: Page['content'];
}

export const SanityContent = ({ content }: SanityContentProps) => {
  return (
    <div>
      {content?.map((block, index) => {
        switch (block._type) {
          case 'hero':
            return (
              <Hero
                key={index}
                blok={{
                  headline: block.title,
                  subheadline: block.subtitle,
                  image: block.image ? urlFor(block.image).url() : undefined,
                  cta_label: block.cta?.text,
                  cta_link: block.cta?.link,
                }}
              />
            );
          case 'feature':
            return (
              <Feature
                key={index}
                blok={{
                  name: block.title,
                  description: block.description,
                  icon: block.icon,
                }}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};