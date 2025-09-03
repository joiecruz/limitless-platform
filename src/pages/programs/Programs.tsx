import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Programs() {
  const programs = [
    {
      title: "LimitlessGov",
      description: "Empowering government digital transformation through innovative solutions and capacity building.",
      href: "/programs/limitlessgov",
      features: ["Digital Strategy", "Process Automation", "Citizen Services", "Data Analytics"]
    },
    {
      title: "AI Ready ASEAN", 
      description: "Building AI capabilities across ASEAN nations through comprehensive training and development programs.",
      href: "/programs/ai-ready-asean",
      features: ["AI Training", "Policy Development", "Technical Skills", "Regional Collaboration"]
    },
    {
      title: "ASEAN Digital Literacy Programme",
      description: "Advancing digital literacy and skills development across the ASEAN region for inclusive growth.",
      href: "/programs/asean-digital-literacy",
      features: ["Digital Skills", "Online Safety", "Digital Tools", "Community Outreach"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Our Programs
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transformative programs designed to build digital capabilities and drive innovation across the region
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {program.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {program.description}
                </p>
                
                <ul className="space-y-2 mb-8">
                  {program.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-muted-foreground">
                      <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to={program.href}>
                  <Button className="w-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}