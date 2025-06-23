
import { supabase } from "@/integrations/supabase/client";

export async function initializeBlogStorage() {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'blog-assets');
    
    if (!bucketExists) {
      // Create the bucket
      const { error } = await supabase
        .storage
        .createBucket('blog-assets', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      
      if (error) {
        
        return false;
      }
      
      
    }
    
    return true;
  } catch (error) {
    
    return false;
  }
}
