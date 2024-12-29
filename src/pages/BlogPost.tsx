import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Badge } from "@/components/ui/badge";

export default function BlogPost() {
  const { slug } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <MainNav />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <MainNav />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article not found</h1>
          <p className="text-gray-600">The article you're looking for doesn't exist or has been removed.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="text-primary-600 font-medium">Innovation</span>
            <span>•</span>
            <time dateTime={article.created_at}>
              {formatDate(article.created_at)}
            </time>
            <span>•</span>
            <span>{getReadTime(article.content)}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            {article.title}
          </h1>

          {/* Cover Image */}
          {article.cover_image && (
            <div className="mb-8">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: article.content
                .split('\n\n')
                .map(paragraph => paragraph.trim())
                .filter(paragraph => paragraph.length > 0)
                .map(paragraph => `<p class="mb-6">${paragraph.replace(/\n/g, '<br />')}</p>`)
                .join('')
            }} 
            className="leading-relaxed"
          />
        </div>

        {/* Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Meta Description (hidden for SEO) */}
        {article.meta_description && (
          <meta name="description" content={article.meta_description} />
        )}
      </article>

      <Footer />
    </div>
  );
}