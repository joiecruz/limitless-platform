import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";
import { Paintbrush, Briefcase, GraduationCap, Palette, LayoutPanelLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const services = [
  {
    icon: Palette,
    title: "Brand Design",
    description: "Create a compelling brand identity that resonates with your audience. We help you develop a cohesive visual language, messaging strategy, and brand guidelines that set you apart."
  },
  {
    icon: Briefcase,
    title: "Toolkit Design",
    description: "Custom-designed innovation toolkits that empower your team. We create practical, user-friendly resources that guide your innovation process and drive results."
  },
  {
    icon: GraduationCap,
    title: "Training of Trainers Curriculum Design",
    description: "Develop effective training programs that create lasting impact. Our curriculum design expertise ensures your trainers are equipped with the right materials and methodologies."
  },
  {
    icon: LayoutPanelLeft,
    title: "UX/UI Design and Development",
    description: "Create intuitive digital experiences that users love. Our team combines design thinking with technical expertise to build user-centered solutions."
  },
  {
    icon: Paintbrush,
    title: "Program Design and Implementation",
    description: "End-to-end program development that drives innovation. We help you design, launch, and scale programs that create meaningful change in your organization."
  }
];

export default function Services() {
  const { data: caseStudies } = useQuery({
    queryKey: ['case-studies'],
    queryFn: async () => {
      const { data } = await supabase
        .from('case_studies')
        .select('*')
        .limit(3);
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Hero Section */}
      <section className="pt-20 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Co-Design.png"
                alt="Co-design Process"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Accelerate your innovation journey with expert support
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6">
                Get hands-on, customized guidance to turn your organization challenges into innovation projects that are measurable and impactful.
              </p>
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                Our team has worked with organizations from public, private, and civil society on diverse verticals and sectors.
              </p>
              <Button 
                variant="default"
                size="lg"
                className="bg-[#393CA0] hover:bg-[#2F3282] text-white px-8"
                onClick={() => window.open('https://calendar.app.google/Sbztdtob1XHqj1gbA', '_blank')}
              >
                Book a Consultation Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <service.icon className="h-12 w-12 text-[#393CA0] mb-4" />
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Co-Design Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">What Makes Us Different: Our Co-Design Process</h2>
          <p className="text-lg text-gray-600 mb-12">
            Our signature co-design process makes sure that our clients and their stakeholders are part of the innovation journey. 
            When innovations and solutions are co-designed, we achieve greater ownership and greater impact.
          </p>
          
          <div className="aspect-video w-full mb-12 bg-gray-100 rounded-lg">
            {/* Placeholder for process image */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Process Image Placeholder
            </div>
          </div>

          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="deliver">Deliver</TabsTrigger>
              <TabsTrigger value="debrief">Debrief</TabsTrigger>
            </TabsList>
            <TabsContent value="discover" className="mt-6 text-left">
              <h3 className="text-xl font-semibold mb-3">Discover Phase</h3>
              <p className="text-gray-600">
                In this initial phase, we work closely with stakeholders to understand the context, challenges, and opportunities. 
                Through user research and collaborative workshops, we gather insights that inform our approach.
              </p>
            </TabsContent>
            <TabsContent value="design" className="mt-6 text-left">
              <h3 className="text-xl font-semibold mb-3">Design Phase</h3>
              <p className="text-gray-600">
                During the design phase, we collaborate with stakeholders to generate and refine solutions. 
                Through iterative prototyping and testing, we ensure that the solutions meet user needs and organizational goals.
              </p>
            </TabsContent>
            <TabsContent value="deliver" className="mt-6 text-left">
              <h3 className="text-xl font-semibold mb-3">Deliver Phase</h3>
              <p className="text-gray-600">
                In the delivery phase, we implement the solutions with careful attention to quality and user experience. 
                We provide training and support to ensure smooth adoption and sustainable impact.
              </p>
            </TabsContent>
            <TabsContent value="debrief" className="mt-6 text-left">
              <h3 className="text-xl font-semibold mb-3">Debrief Phase</h3>
              <p className="text-gray-600">
                The debrief phase focuses on measuring impact and gathering learnings. 
                We document insights, celebrate successes, and identify opportunities for continuous improvement.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">See how we've helped organizations achieve their innovation goals</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies?.map((study) => (
              <Card key={study.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  {study.cover_photo && (
                    <img
                      src={study.cover_photo}
                      alt={study.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{study.name}</CardTitle>
                  {study.client && (
                    <CardDescription>{study.client}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">{study.description}</p>
                  <Link to={`/case-studies/${study.slug}`}>
                    <Button variant="link" className="mt-4 p-0 h-auto text-[#393CA0]">
                      Read more →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#393CA0] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Innovation Journey?</h2>
          <p className="text-lg mb-8 opacity-90">
            Schedule a consultation call with our experts to discuss your project and explore how we can help.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white text-[#393CA0] hover:bg-gray-100"
            onClick={() => window.open('https://calendar.app.google/Sbztdtob1XHqj1gbA', '_blank')}
          >
            Book Your Free Consultation
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}