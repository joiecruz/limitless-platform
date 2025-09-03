import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Users, Zap, Target } from "lucide-react";

export default function LimitlessGov() {
  const features = [
    {
      icon: Building,
      title: "Digital Strategy",
      description: "Comprehensive digital transformation strategies tailored for government entities"
    },
    {
      icon: Zap,
      title: "Process Automation",
      description: "Streamline government processes through intelligent automation solutions"
    },
    {
      icon: Users,
      title: "Citizen Services",
      description: "Enhance citizen experience through digital service delivery platforms"
    },
    {
      icon: Target,
      title: "Data Analytics",
      description: "Evidence-based decision making through advanced data analytics and insights"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              LimitlessGov
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Empowering government digital transformation through innovative solutions, 
              capacity building, and sustainable change management.
            </p>
            <Link to="/contact">
              <Button size="lg" className="mr-4">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Transforming Government Services
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Transform Your Government Services?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join leading government organizations in their digital transformation journey
          </p>
          <Link to="/contact">
            <Button size="lg">
              Schedule a Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}