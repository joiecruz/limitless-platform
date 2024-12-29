import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-white">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
            alt="Limitless Lab"
            className="h-8 w-auto"
          />
          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-gray-600 hover:text-primary-600">Products</a>
            <a href="#features" className="text-gray-600 hover:text-primary-600">Features</a>
            <a href="#courses" className="text-gray-600 hover:text-primary-600">Courses</a>
            <a href="#tools" className="text-gray-600 hover:text-primary-600">Tools</a>
            <Button variant="default" size="sm">Sign up</Button>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The all-in-one platform empowering innovators to turn ideas into real impact
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of innovators and access the tools, resources, and support you need to make a difference.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </header>

      {/* Partners Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 mb-8">
            Join the growing network of organizations innovating for social good
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {/* Add partner logos here */}
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Innovation Management Platform */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-4">Innovation Management Platform</h2>
              <p className="text-gray-600 mb-6">
                Transform your social innovation journey with our comprehensive platform designed to help you manage ideas, track progress, and measure impact effectively.
              </p>
              <Button>Learn More</Button>
            </div>
            <div className="relative">
              <div className="bg-primary-50 rounded-lg p-8">
                <img 
                  src="/lovable-uploads/3a845e0a-36cc-4473-b556-00a273309b6c.png" 
                  alt="Platform Preview" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Training Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1">
              <div className="bg-[#FFF6E9] rounded-lg p-8">
                <img 
                  src="/lovable-uploads/3a845e0a-36cc-4473-b556-00a273309b6c.png" 
                  alt="Training Preview" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-4">In-Person Training and Online Courses</h2>
              <p className="text-gray-600 mb-6">
                Access comprehensive training materials and expert-led courses to enhance your innovation capabilities.
              </p>
              <Button>Explore Courses</Button>
            </div>
          </div>

          {/* Co-design Services */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Custom Co-design Services</h2>
              <p className="text-gray-600 mb-6">
                Work with our expert team to co-create solutions that drive meaningful impact in your community.
              </p>
              <Button>Learn More</Button>
            </div>
            <div className="relative">
              <div className="bg-[#F5F7FF] rounded-lg p-8">
                <img 
                  src="/lovable-uploads/3a845e0a-36cc-4473-b556-00a273309b6c.png" 
                  alt="Co-design Preview" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Updates Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Updates and Insights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src="/lovable-uploads/3a845e0a-36cc-4473-b556-00a273309b6c.png" 
                  alt="Update Preview" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold mb-2">Latest Update Title</h3>
                  <p className="text-gray-600">Short description of the update goes here...</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Start innovating for<br />impact today
          </h2>
          <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            Join the Lab
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img 
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
                alt="Limitless Lab"
                className="h-8 w-auto mb-4"
              />
              <p className="text-gray-600">Empowering innovators to create positive change</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-600 hover:text-primary-600">About</a></li>
                <li><a href="#careers" className="text-gray-600 hover:text-primary-600">Careers</a></li>
                <li><a href="#press" className="text-gray-600 hover:text-primary-600">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Features</h3>
              <ul className="space-y-2">
                <li><a href="#platform" className="text-gray-600 hover:text-primary-600">Platform</a></li>
                <li><a href="#courses" className="text-gray-600 hover:text-primary-600">Courses</a></li>
                <li><a href="#tools" className="text-gray-600 hover:text-primary-600">Tools</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#help" className="text-gray-600 hover:text-primary-600">Help Center</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-primary-600">Contact Us</a></li>
                <li><a href="#privacy" className="text-gray-600 hover:text-primary-600">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Limitless Lab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;