import { createClient } from 'contentful';
import { supabase } from '@/integrations/supabase/client';

// Initialize the Contentful client with environment variables from Supabase secrets
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Helper function to fetch entries
export async function getEntries(contentType: string) {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: contentType,
    });
    return entries.items;
  } catch (error) {
    console.error('Error fetching Contentful entries:', error);
    throw error;
  }
}

// Helper function to fetch a single entry
export async function getEntry(entryId: string) {
  try {
    const entry = await contentfulClient.getEntry(entryId);
    return entry;
  } catch (error) {
    console.error('Error fetching Contentful entry:', error);
    throw error;
  }
}