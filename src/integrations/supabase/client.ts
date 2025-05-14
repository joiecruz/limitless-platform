
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';
import { SUPABASE_URL, SUPABASE_ANON_KEY, BLOG_COVERS_BUCKET } from '@/config/env';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Create the storage bucket if it doesn't exist
export const ensureBlogCoversBucket = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const blogCoversBucketExists = buckets?.some(b => b.name === BLOG_COVERS_BUCKET);
    
    if (!blogCoversBucketExists) {
      await supabase.storage.createBucket(BLOG_COVERS_BUCKET, {
        public: true,
        fileSizeLimit: 10485760, // 10MB in bytes
      });
      console.log(`Created ${BLOG_COVERS_BUCKET} bucket`);
    }
  } catch (error) {
    console.error(`Error ensuring ${BLOG_COVERS_BUCKET} bucket exists:`, error);
  }
};

// Call this function when the app initializes
ensureBlogCoversBucket();
