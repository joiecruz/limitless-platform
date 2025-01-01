import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Suspense } from "react";
import { LoadingPage } from "@/components/common/LoadingPage";
import { BlogContent } from "./BlogContent";

export function BlogSectionWrapper() {
  const navigate = useNavigate();

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
          <p className="mt-4 text-lg text-gray-600">
            Stay updated with our latest insights and news
          </p>
        </div>
        <Suspense fallback={<LoadingPage />}>
          <BlogContent />
        </Suspense>
        <div className="mt-12 text-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/blog')}
            className="px-8 text-[#393CA0] border-[#393CA0] hover:bg-[#393CA0]/5 transition-colors duration-200"
          >
            View All Articles
          </Button>
        </div>
      </div>
    </div>
  );
}