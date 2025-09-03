import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Globe, BookOpen, Users2 } from "lucide-react";

export default function AIReadyASEAN() {
  const pillars = [
    {
      icon: Brain,
      title: "AI Training & Education",
      description: "Comprehensive AI curriculum designed for ASEAN professionals and students"
    },
    {
      icon: Globe,
      title: "Policy Development",
      description: "Supporting regional AI governance frameworks and ethical guidelines"
    },
    {
      icon: BookOpen,
      title: "Technical Skills Development",
      description: "Hands-on training in machine learning, data science, and AI implementation"
    },
    {
      icon: Users2,
      title: "Regional Collaboration",
      description: "Fostering partnerships and knowledge sharing across ASEAN nations"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              AI Ready ASEAN
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Building AI capabilities across ASEAN nations through comprehensive training, 
              policy development, and regional collaboration initiatives.
            </p>
            <Link to="/contact">
              <Button size="lg" className="mr-4">
                Join the Initiative
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Program Pillars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Four Pillars of AI Readiness
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {pillars.map((pillar, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <pillar.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Our Impact Across ASEAN
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <div className="text-lg text-muted-foreground">ASEAN Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-lg text-muted-foreground">Professionals Trained</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-lg text-muted-foreground">Partner Organizations</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Be Part of the AI Ready ASEAN Movement
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals building AI capabilities across the region
          </p>
          <Link to="/contact">
            <Button size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}