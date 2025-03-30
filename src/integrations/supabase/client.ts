
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

// These keys are public and don't need to be hidden in an env file
const supabaseUrl = "https://crllgygjuqpluvdpwayi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDQ1MjksImV4cCI6MjA0OTEyMDUyOX0.-L1Kc059oqFdOacRh9wcbf5wBCOqqTHBzvmIFKqlWU8";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Create the storage bucket if it doesn't exist
export const ensureBlogCoversBucket = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const blogCoversBucketExists = buckets?.some(b => b.name === 'blog-covers');
    
    if (!blogCoversBucketExists) {
      await supabase.storage.createBucket('blog-covers', {
        public: true,
        fileSizeLimit: 10485760, // 10MB in bytes
      });
      console.log('Created blog-covers bucket');
    }
  } catch (error) {
    console.error('Error ensuring blog-covers bucket exists:', error);
  }
};

// Call this function when the app initializes
ensureBlogCoversBucket();
