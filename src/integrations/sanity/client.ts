import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'limitless-lab', // Your Sanity project ID
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01', // Current date
});

// Set up image URL builder
const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => {
  return builder.image(source);
};