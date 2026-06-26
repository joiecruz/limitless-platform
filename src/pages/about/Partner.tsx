import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  HeartHandshake,
  Building2,
  Landmark,
  GraduationCap,
  Users,
  Briefcase,
  CheckCircle2,
  Globe2,
  Trophy,
  Sparkles,
} from "lucide-react";
import { MainNav } from "@/components/site-config/MainNav";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { CTASection } from "@/components/site-config/CTASection";
import { Footer } from "@/components/site-config/Footer";
import { InfiniteLogos } from "@/components/site-config/InfiniteLogos";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Partner() {
  usePageTitle("Partner with Limitless Lab | Limitless Lab");

  const proofPoints = [
    { icon: Users, stat: "13,000+", label: "Filipinos trained in digital & AI literacy" },
    { icon: Globe2, stat: "ASEAN-wide", label: "Programs across Southeast Asia" },
    { icon: Trophy, stat: "WSIS & Good Design", label: "Awards & nominations" },
    { icon: Sparkles, stat: "8+ years", label: "Designing for social impact" },
  ];

  const partnerTypes = [
    {
      icon: HeartHandshake,
      title: "Program & Grant Partners",
      description:
        "Foundations and development organizations co-funding large-scale innovation, digital literacy, and AI capability programs.",
    },
    {
      icon: Landmark,
      title: "Government & Public Sector",
      description:
        "National agencies and local governments co-designing policies, services, and capability programs for public servants.",
    },
    {
      icon: Building2,
      title: "Corporate & CSR Partners",
      description:
        "Companies investing in inclusive innovation, AI for good, and capability-building for employees, MSMEs, and communities.",
    },
    {
      icon: GraduationCap,
      title: "Academic & Research Institutions",
      description:
        "Universities and think tanks partnering on curriculum, research, and student innovation programs.",
    },
    {
      icon: Users,
      title: "Community & Implementation Partners",
      description:
        "Local organizations and grassroots networks helping us reach communities and co-deliver programs on the ground.",
    },
    {
      icon: Briefcase,
      title: "Tech & Platform Partners",
      description:
        "Technology providers and AI platforms collaborating on responsible AI tools and digital infrastructure for impact.",
    },
  ];

  const partnershipShapes = [
    {
      title: "Co-Design",
      description: "We co-create programs, products, and policies with you — grounded in user research and design thinking.",
    },
    {
      title: "Co-Funding",
      description: "We bring matching investment, in-kind support, and a track record of leveraging resources for impact.",
    },
    {
      title: "Co-Implementation",
      description: "We deliver on the ground with our team and regional network of trainers, designers, and community partners.",
    },
    {
      title: "Knowledge Sharing",
      description: "We publish toolkits, case studies, and open resources so the work compounds across the region.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <OpenGraphTags
        title="Partner with Limitless Lab"
        description="Partner with Limitless Lab to co-design and scale innovation, AI, and digital literacy programs that create social impact across Southeast Asia."
        imageUrl="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"
        url="https://limitlesslab.org/about/partner"
      />
      <MainNav />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest text-[#393CA0] font-semibold mb-4">Work With Us</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Partner with Limitless Lab
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Together, we co-create programs, products, and policies that help people, organizations, and ecosystems across Southeast Asia grow beyond limits.
          </p>
          <a href="mailto:hello@limitlesslab.org?subject=Partnership%20inquiry">
            <Button size="lg" className="bg-[#393CA0] hover:bg-[#393CA0]/90">
              Start a conversation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Proof points */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Partner With Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We bring proven methods, regional reach, and a portfolio of impact across the public, private, and development sectors.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {proofPoints.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#393CA0]/10 text-[#393CA0] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{p.stat}</div>
                  <div className="text-sm text-gray-600">{p.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ways to Partner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ways to Partner</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We design partnerships around your goals — from one-off engagements to multi-year regional programs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerTypes.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#393CA0]/10 text-[#393CA0] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{t.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partnership Shapes */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Partnership Looks Like</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every partnership is shaped together — here's how we typically work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnershipShapes.map((s) => (
              <div key={s.title} className="bg-white rounded-xl p-6 border border-gray-100 flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#393CA0] shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Trusted by partners across the region</h2>
            <p className="text-gray-600">A few of the organizations we've collaborated with.</p>
          </div>
          <InfiniteLogos />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Let's build what's next, together.</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Tell us about your goals and the change you want to see. We'll get back to you within 3 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hello@limitlesslab.org?subject=Partnership%20inquiry">
              <Button size="lg" className="bg-[#393CA0] hover:bg-[#393CA0]/90">
                Start a conversation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Link to="/about/transformation-model">
              <Button size="lg" variant="outline">
                See our transformation model
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}
