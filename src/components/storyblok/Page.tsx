import { storyblokEditable, StoryblokComponent } from "@storyblok/react";

const Page = ({ blok }: { blok: any }) => {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok: any) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
};

export default Page;