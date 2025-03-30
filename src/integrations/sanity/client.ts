
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'your-project-id', // Replace with your actual Sanity project ID
  dataset: 'production',
  useCdn: true, // Use the content delivery network for faster performance
  apiVersion: '2023-05-03', // Use the latest API version
});

// Helper function to build image URLs
export const urlFor = (source: any) => {
  if (!source) return '';
  // Extract the image ID from the reference string
  const imageId = source.asset?._ref?.split('-')[1];
  const extension = source.asset?._ref?.split('-')[2];
  
  if (!imageId || !extension) return '';
  
  return `https://cdn.sanity.io/images/your-project-id/production/${imageId}.${extension.replace('jpg', 'jpeg')}`;
};
