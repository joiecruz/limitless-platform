import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
  const navigate = useNavigate();
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
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts?.posts?.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-100 hover:border-[#393CA0]/20 transition-all duration-200 hover:shadow-md"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    {post.cover_image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-semibold text-gray-900 hover:text-[#393CA0] transition-colors">
                        {post.title}
                      </h3>
                      <div className="text-sm text-gray-600">
                        {format(new Date(post.created_at), 'MMMM d, yyyy')}
                      </div>
                    </div>
                  </div>
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