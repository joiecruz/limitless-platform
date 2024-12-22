import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Download, Users, Wrench } from "lucide-react";
import { WebsiteNavigation } from "@/components/website/WebsiteNavigation";

const Home = () => {
  return (
    <div className="min-h-screen">
      <WebsiteNavigation />
      
      {/* Hero Section */}
      <section className="relative isolate pt-14">
        <div className="py-20 px-4 bg-gradient-to-br from-primary-50 to-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              Turn Ideas into Real Impact
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the growing network of organizations innovating for social good with our all-in-one platform
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Innovate</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access a comprehensive suite of tools, training, and support to drive innovation in your organization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Platform */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Wrench className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation Platform</h3>
              <p className="text-gray-600">
                Manage projects, track progress, and collaborate with your team in one place
              </p>
            </Card>

            {/* Training */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Training & Courses</h3>
              <p className="text-gray-600">
                Learn innovation methodologies through structured courses and workshops
              </p>
            </Card>

            {/* Community */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Connect with other innovators, share insights, and grow together
              </p>
            </Card>

            {/* Tools */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation Tools</h3>
              <p className="text-gray-600">
                Access templates, frameworks, and resources to accelerate your work
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Latest Updates</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest insights, case studies, and innovation resources
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200" />
                <div className="p-6">
                  <p className="text-sm text-primary-600 mb-2">Category</p>
                  <h3 className="text-xl font-semibold mb-2">Article Title</h3>
                  <p className="text-gray-600 mb-4">
                    Preview of the article content goes here...
                  </p>
                  <Button variant="link" className="p-0">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Innovation Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of organizations already using Limitless Lab to drive innovation
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
