import { Link } from "react-router-dom";
import { SEO } from "@/components/common/SEO";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";

export default function NotFound() {
  return (
    <>
      <MainNav />
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <SEO 
          title="404: Page Not Found | Limitless Lab" 
          description="The page you're looking for doesn't exist, but our friendly team is here to help!"
          noindex={true}
        />
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">ERROR 404</h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">This Page Doesn't Exist</h2>
          <h3 className="text-xl md:text-2xl mb-6 flex items-center justify-center gap-2">
            But Our Friendly Support Team Does <span className="text-2xl">😊</span>
          </h3>
          
          <p className="text-lg mb-8">
            Looking for something? Need help? Have an innovative idea to share?{" "}
            <a 
              href="mailto:hello@limitlesslab.org"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Email us
            </a>{" "}
            and we'll get back to you ASAP.
          </p>

          <div className="space-y-4">
            <p className="text-lg font-medium">Here are some helpful links for you:</p>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-600 hover:text-primary-700 underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-primary-600 hover:text-primary-700 underline">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-primary-600 hover:text-primary-700 underline">
                  Innovation Tools
                </Link>
              </li>
              <li>
                <Link to="/signin" className="text-primary-600 hover:text-primary-700 underline">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}