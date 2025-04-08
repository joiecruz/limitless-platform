
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

interface RelatedBlogsProps {
  currentPostId: string;
  categories: string[];
  tags: string[];
  maxPosts?: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  created_at: string;
  cover_image?: string;
  categories?: string[];
}

export function RelatedBlogs({ 
  currentPostId, 
  categories = [], 
  tags = [], 
  maxPosts = 3 
}: RelatedBlogsProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        setIsLoading(true);
        
        // Get posts that share categories or tags with the current post
        let query = supabase
          .from('articles')
          .select('id, title, slug, excerpt, created_at, cover_image, categories')
          .eq('published', true)
          .neq('id', currentPostId)
          .order('created_at', { ascending: false });
        
        // Filter by either categories or tags if they exist
        if (categories.length > 0) {
          query = query.overlaps('categories', categories);
        } else if (tags.length > 0) {
          query = query.overlaps('tags', tags);
        }
        
        let { data, error } = await query.limit(maxPosts);
        
        // If we don't have enough related posts by category/tag, get latest posts
        if (!error && (!data || data.length < maxPosts)) {
          const neededPosts = maxPosts - (data?.length || 0);
          
          const existingIds = data?.map(post => post.id) || [];
          existingIds.push(currentPostId);
          
          const { data: latestPosts, error: latestError } = await supabase
            .from('articles')
            .select('id, title, slug, excerpt, created_at, cover_image, categories')
            .eq('published', true)
            .not('id', 'in', `(${existingIds.join(',')})`)
            .order('created_at', { ascending: false })
            .limit(neededPosts);
          
          if (!latestError && latestPosts) {
            data = [...(data || []), ...latestPosts];
          }
        }
        
        if (error) {
          console.error("Error fetching related posts:", error);
          return;
        }
        
        setRelatedPosts(data || []);
      } catch (error) {
        console.error("Failed to fetch related posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (currentPostId) {
      fetchRelatedPosts();
    }
  }, [currentPostId, categories, tags, maxPosts]);
  
  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-64 animate-pulse">
              <div className="h-full bg-muted/30"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.id} className="no-underline">
            <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
              {post.cover_image && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={post.cover_image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className={!post.cover_image ? "pt-6" : "pt-4"}>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.categories.slice(0, 2).map((category, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                {post.excerpt && (
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                )}
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
