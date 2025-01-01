import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
        <div className="prose prose-lg max-w-none">
          <p>
            Limitless Lab is a pioneering innovation consultancy dedicated to helping organizations unlock their full potential. We combine design thinking, strategic innovation, and cutting-edge technology to create transformative solutions for our clients.
          </p>
          <p>
            Our mission is to empower organizations to innovate fearlessly and create lasting positive impact. Through our collaborative approach and proven methodologies, we help our clients navigate complex challenges and seize new opportunities.
          </p>
          <h2>Our Approach</h2>
          <p>
            We believe in co-creation and human-centered design. Our process involves working closely with our clients to understand their unique challenges, ideate innovative solutions, and implement sustainable changes that drive real results.
          </p>
          <h2>Our Values</h2>
          <ul>
            <li>Innovation with Purpose</li>
            <li>Collaborative Excellence</li>
            <li>Continuous Learning</li>
            <li>Sustainable Impact</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}