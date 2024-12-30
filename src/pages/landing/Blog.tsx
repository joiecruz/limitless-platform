import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { BlogSection } from "@/components/site-config/BlogSection";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const categories = [
  "All",
  "Design",
  "Innovation",
  "News and Updates",
  "Featured Stories",
  "Digital Literacy",
  "Artificial Intelligence"
];

export default function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const postsPerPage = 9;

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts', currentPage, selectedCategory],
    queryFn: async () => {
      const startRange = (currentPage - 1) * postsPerPage;
      const endRange = startRange + postsPerPage - 1;

      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (selectedCategory !== "All") {
        query = query.contains('categories', [selectedCategory]);
      }

      const { data: posts, count } = await query
        .range(startRange, endRange);

      return { posts, totalCount: count };
    },
  });

  const totalPages = posts?.totalCount 
    ? Math.ceil(posts.totalCount / postsPerPage) 
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold text-gray-900">
              Blog & Updates
            </h1>
            <p className="text-lg text-gray-600">
              Discover insights, stories, and the latest in innovation
            </p>
          </div>
          
          <div className="flex justify-center mb-12 gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts?.posts?.map((post) => (
                  <BlogSection key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}