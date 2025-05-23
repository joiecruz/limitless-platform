
import { Link } from "react-router-dom";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";
import { Home, Mail } from "lucide-react";
import { useEffect } from "react";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";

export default function NotFound() {
  // Set the document title when the component mounts
  useEffect(() => {
    document.title = "404 - Page Not Found";
    
    // Clean up when component unmounts to allow other pages to set their titles
    return () => {
      document.title = "Limitless Lab";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <OpenGraphTags
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist or has been removed."
        imageUrl="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"
        url={window.location.href}
      />
      
      <MainNav />

      <main className="flex-grow flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-primary-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/">
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Home className="mr-2 h-4 w-4" />
                Go back home
              </Button>
            </Link>
            <a
              href="mailto:hello@limitlesslab.org"
              className="flex items-center text-sm font-semibold text-gray-900 hover:text-primary-600"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
