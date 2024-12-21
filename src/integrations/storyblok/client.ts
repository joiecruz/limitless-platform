import { storyblokInit, apiPlugin } from "@storyblok/react";

// Initialize the Storyblok client
storyblokInit({
  accessToken: "A3PLMgBZwkwgZXSnqXr1wQtt",
  use: [apiPlugin],
  components: {
    // We'll register our components here
  },
});