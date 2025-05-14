
import { supabase } from "@/integrations/supabase/client";
import { BLOG_ASSETS_BUCKET } from "@/config/env";

export async function initializeBlogStorage() {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
    
    const bucketExists = buckets?.some(bucket => bucket.name === BLOG_ASSETS_BUCKET);
    
    if (!bucketExists) {
      // Create the bucket
      const { error } = await supabase
        .storage
        .createBucket(BLOG_ASSETS_BUCKET, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      
      if (error) {
        console.error(`Error creating ${BLOG_ASSETS_BUCKET} bucket:`, error);
        return false;
      }
      
      console.log(`Created ${BLOG_ASSETS_BUCKET} bucket`);
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing blog storage:", error);
    return false;
  }
}
