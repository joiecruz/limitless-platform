import { useEffect, useState } from "react";
import { getStoryblokApi, StoryblokComponent } from "@storyblok/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getStory = async () => {
      try {
        console.log("Fetching Home page content...");
        const storyblokApi = getStoryblokApi();
        const { data } = await storyblokApi.get(`cdn/stories/home`, {
          version: "draft",
        });
        console.log("Storyblok response:", data);
        setStory(data?.story);
      } catch (error) {
        console.error("Error fetching Storyblok content:", error);
        // Show fallback content if Storyblok is not connected
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    getStory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (story?.content) {
    return <StoryblokComponent blok={story.content} />;
  }

  // Fallback content when Storyblok is not connected
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The all-in-one platform empowering innovators to turn ideas into real impact
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join the growing network of organizations innovating for social good
          </p>
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Innovation Management Platform */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Innovation Management Platform</h2>
              <p className="text-gray-600 mb-6">
                Track and manage projects in a collaborative space where teams can co-create,
                share updates, and measure impact together.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>
            <div className="relative">
              <img
                src="/lovable-uploads/2a2894d9-5f3a-4a38-bb94-bdc08c6f5957.png"
                alt="Platform Preview"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Training Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div>
              <h2 className="text-3xl font-bold mb-4">In-Person Training and Online Courses</h2>
              <p className="text-gray-600 mb-6">
                Build your capability as an innovation catalyst through our courses.
                Join a community of practitioners learning and growing together.
              </p>
              <Button variant="outline">Browse Courses</Button>
            </div>
            <div className="relative">
              <div className="bg-purple-100 rounded-lg p-8">
                {/* Training content placeholder */}
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Custom Co-design Services</h2>
              <p className="text-gray-600 mb-6">
                Work with our expert team to design and implement your innovation program.
                We'll help you build the capability you need to create lasting impact.
              </p>
              <Button variant="outline">Our Services</Button>
            </div>
            <div className="relative">
              <div className="bg-yellow-100 rounded-lg p-8">
                {/* Services content placeholder */}
              </div>
            </div>
          </div>

          {/* Tools Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div>
              <h2 className="text-3xl font-bold mb-4">Tools and Resources</h2>
              <p className="text-gray-600 mb-6">
                Access our library of tools and templates to help you on your innovation journey.
                Everything you need to get started is right here.
              </p>
              <Button variant="outline">Explore Tools</Button>
            </div>
            <div className="relative">
              <div className="bg-blue-100 rounded-lg p-8">
                {/* Tools content placeholder */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Updates and Insights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <h3 className="text-xl font-bold mb-4">Blog Post Title</h3>
                <p className="text-gray-600">Preview of the blog post content...</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Start innovating for impact today
          </h2>
          <Button size="lg" variant="secondary">
            Join The Lab
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;