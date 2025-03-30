
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'your-project-id', // Replace with your Sanity project ID
  dataset: 'production',
  useCdn: true, // Use the content delivery network for faster performance
  apiVersion: '2023-05-03', // Use the latest API version
});

// Helper function to build image URLs
export const urlFor = (source: any) => {
  if (!source) return '';
  return `https://cdn.sanity.io/images/your-project-id/production/${source}`;
};
