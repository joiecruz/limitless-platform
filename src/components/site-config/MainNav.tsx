
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function MainNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/">
              <img 
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
                alt="Limitless Lab"
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/product" className="text-gray-700 hover:text-[#393CA0]">Product</Link>
            <Link to="/services" className="text-gray-700 hover:text-[#393CA0]">Services</Link>
            <Link to="/blog" className="text-gray-700 hover:text-[#393CA0]">Blog</Link>
            <Link to="/tools" className="text-gray-700 hover:text-[#393CA0]">Tools</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/signup">
              <Button className="bg-[#393CA0] hover:bg-[#393CA0]/90">Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
