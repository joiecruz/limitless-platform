import { storyblokInit, apiPlugin } from "@storyblok/react";

// Initialize the Storyblok client
storyblokInit({
  accessToken: "YOUR_PREVIEW_TOKEN",
  use: [apiPlugin],
  components: {
    // We'll register our components here
  },
});