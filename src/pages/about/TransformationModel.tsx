import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, Globe2, Lightbulb, Handshake, Rocket, Compass, Sparkles } from "lucide-react";
import { MainNav } from "@/components/site-config/MainNav";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { CTASection } from "@/components/site-config/CTASection";
import { Footer } from "@/components/site-config/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function TransformationModel() {
  usePageTitle("Our Transformation Model | Limitless Lab");

  const layers = [
    {
      icon: Users,
      title: "Individual",
      subtitle: "Mindsets & Skills",
      description:
        "We equip changemakers — leaders, public servants, educators, and entrepreneurs — with the human-centered and AI fluency skills to grow beyond limits.",
      highlights: ["Courses & certifications", "Coaching & mentoring", "Tools & toolkits"],
    },
    {
      icon: Building2,
      title: "Organizational",
      subtitle: "Capabilities & Culture",
      description:
        "We help organizations embed innovation as a capability — through co-design sprints, AI adoption roadmaps, and internal innovation labs.",
      highlights: ["Innovation strategy", "AI adoption & enablement", "Co-design sprints"],
    },
    {
      icon: Globe2,
      title: "Ecosystem",
      subtitle: "Programs & Platforms",
      description:
        "We design and run regional programs that build capabilities at scale — from public sector leadership to AI literacy for MSMEs across ASEAN.",
      highlights: ["LimitlessGov", "AI Ready ASEAN", "AIM ASEAN"],
    },
  ];

  const pillars = [
    {
      title: "Training",
      description:
        "We equip individuals and institutions with the tools, knowledge, skills, and mindsets to lead change through design thinking, AI, and emerging tech.",
    },
    {
      title: "Co-Design",
      description:
        "We collaborate with partners and communities to co-create strategies, tools, policies, and services rooted in human-centered design.",
    },
    {
      title: "Product",
      description:
        "We develop digital tools, platforms, and AI-powered solutions that support innovation, governance, and social enterprise growth.",
    },
  ];

  const methodology = [
    { step: "01", title: "Discover", description: "Listen deeply to people, context, and systems to uncover real needs." },
    { step: "02", title: "Design", description: "Co-create solutions with stakeholders using design thinking and AI." },
    { step: "03", title: "Develop", description: "Prototype, test, and refine ideas into tangible tools and services." },
    { step: "04", title: "Deploy", description: "Implement with partners and communities, building capacity along the way." },
    { step: "05", title: "Scale", description: "Document, share, and grow impact across sectors and regions." },
  ];

  const principles = [
    { icon: Users, title: "Human-Centered", text: "People — not technology — sit at the center of every solution." },
    { icon: Sparkles, title: "AI-Enabled", text: "We use AI responsibly to amplify human creativity and impact." },
    { icon: Compass, title: "Evidence-Based", text: "Decisions are grounded in research, data, and community insight." },
    { icon: Handshake, title: "Locally Rooted", text: "Solutions are co-designed with the people they serve." },
    { icon: Rocket, title: "Regionally Scaled", text: "We design for impact across ASEAN and beyond." },
    { icon: Lightbulb, title: "Open & Shared", text: "We publish toolkits and learnings so others can build on them." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <OpenGraphTags
        title="Our Transformation Model | Limitless Lab"
        description="How Limitless Lab drives transformation across individuals, organizations, and ecosystems — combining design thinking, AI, and systems thinking."
        imageUrl="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png"
        url="https://limitlesslab.org/about/transformation-model"
      />
      <MainNav />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-widest text-[#393CA0] font-semibold mb-4">About Limitless Lab</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Transformation Model
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            How we help people, organizations, and ecosystems grow beyond limits — through human-centered design, responsible AI, and systems thinking.
          </p>
        </div>
      </section>

      {/* Approach */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">The Limitless Approach</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Transformation isn't a workshop or a tool — it's a journey. We combine design thinking, AI, and systems thinking to deliver change that is human-centered at the core, tech-enabled at the edges, and impact-driven at every step.
          </p>
        </div>
      </section>

      {/* Three Layers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Three Layers of Transformation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We work across three interconnected levels — because lasting change requires growth at every layer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {layers.map((layer) => {
              const Icon = layer.icon;
              return (
                <div key={layer.title} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-[#393CA0]/10 text-[#393CA0] flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{layer.title}</h3>
                  <p className="text-sm uppercase tracking-wider text-[#393CA0] font-semibold mb-4">{layer.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{layer.description}</p>
                  <ul className="space-y-2">
                    {layer.highlights.map((h) => (
                      <li key={h} className="flex items-center text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#393CA0] mr-3" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Three Pillars</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything we do flows from these three interconnected practices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p) => (
              <div key={p.title} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{p.title}</h3>
                <p className="text-gray-600 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Methodology</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A repeatable, human-centered process that turns insight into impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {methodology.map((m) => (
              <div key={m.step} className="relative bg-white border border-gray-100 rounded-xl p-6 hover:border-[#393CA0]/40 transition-colors">
                <div className="text-sm font-bold text-[#393CA0] mb-3">{m.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{m.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Guiding Principles</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The non-negotiables that shape how we design, build, and deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-white rounded-xl p-6 border border-gray-100 flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-[#393CA0]/10 text-[#393CA0] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{p.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to grow beyond limits?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're an individual, an organization, or an institution shaping a region — we'd love to design what's next together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about/partner">
              <Button size="lg" className="bg-[#393CA0] hover:bg-[#393CA0]/90">
                Partner with us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline">
                Learn more about us
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
