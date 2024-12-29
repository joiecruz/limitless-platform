import { createClient } from 'contentful';

// We'll use environment variables stored in Supabase secrets
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});