import { FeatureSection } from "./FeatureSection";

export function Features() {
  const features = [
    {
      badge: "Product",
      title: "Innovation Management Platform",
      description: [
        "Streamline your innovation process with our AI-powered platform designed to support every stage—from user research, ideation to impact measurement.",
        "Empower your team with tools that make collaboration easier, faster, and more effective."
      ],
      buttonText: "Learn more",
      buttonLink: "/product",
      imageSrc: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Innovation_Mangement_Platform.png",
      imageAlt: "Innovation Management Platform"
    },
    {
      badge: "Services",
      title: "Custom Co-design Services",
      description: [
        "Bring your vision to life with our collaborative co-design services.",
        "We work alongside your team and key stakeholders to tackle unique challenges, creating tailored solutions that reflect diverse perspectives, align with your organization's goals, and drive meaningful impact."
      ],
      buttonText: "Explore services",
      buttonLink: "/services",
      imageSrc: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Co-Design.png",
      imageAlt: "Custom Co-design Services",
      isReversed: true
    },
    {
      badge: "Tools",
      title: "Tools and Resources",
      description: [
        "Jumpstart your innovation projects with our collection of ready-to-use worksheets, templates, and frameworks.",
        "These tools are designed to simplify complex processes and guide your team toward effective solutions, every step of the way."
      ],
      buttonText: "Access tools",
      buttonLink: "/tools",
      imageSrc: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Website_Assets__2_.png",
      imageAlt: "Tools and Resources"
    },
    {
      badge: "Training",
      title: "In-Person Training and Online Courses",
      description: [
        "Equip your team with the skills and mindset for innovation.",
        "Through engaging in-person workshops and flexible online courses, we provide hands-on learning experiences that drive real change and empower continuous growth."
      ],
      buttonText: "Browse courses",
      buttonLink: "/courses",
      imageSrc: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/3.png",
      imageAlt: "In-Person Training and Online Courses",
      isReversed: true
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-32">
          {features.map((feature, index) => (
            <FeatureSection key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}