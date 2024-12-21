import { storyblokInit, apiPlugin } from "@storyblok/react";
import Feature from "@/components/storyblok/Feature";
import Grid from "@/components/storyblok/Grid";
import Hero from "@/components/storyblok/Hero";
import Page from "@/components/storyblok/Page";

// Initialize the Storyblok client
storyblokInit({
  accessToken: "A3PLMgBZwkwgZXSnqXr1wQtt",
  use: [apiPlugin],
  components: {
    feature: Feature,
    grid: Grid,
    hero: Hero,
    page: Page,
  },
});