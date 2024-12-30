import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { BlogSection } from "@/components/site-config/BlogSection";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts', currentPage],
    queryFn: async () => {
      const startRange = (currentPage - 1) * postsPerPage;
      const endRange = startRange + postsPerPage - 1;

      const { data: posts, count } = await supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('published', true)
        .order('created_at', { ascending: false })
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
          <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Blog & Updates
          </h1>
          
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
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="gap-2"
                        >
                          Previous
                        </Button>
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="gap-2"
                        >
                          Next
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
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