import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'your-project-id', // You'll need to replace this
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01', // Use current date YYYY-MM-DD
});

// Set up image URL builder
const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => {
  return builder.image(source);
};