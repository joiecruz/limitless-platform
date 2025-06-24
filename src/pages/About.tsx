
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";

export default function About() {
  const timelineEvents = [
    {
      year: "2017",
      title: "It All Started with an Idea",
      description: "Joie Cruz founded B612 Design after years of experience in government, media, and nonprofits. Launched the first Design Thinking for Development Communicators workshop with UPLB DevComSoc."
    },
    {
      year: "2018",
      title: "Establishing Our Roots",
      description: "Joined the YSEALI Academic Fellowship in the U.S., where the vision for Bayanivation was born. Participated in DTI's Project One—the first government-led design sprint. Ran early co-design projects in Rizal, Makati, and the Bangsamoro region. Incorporated as B612 Design Innovation Labs, Inc."
    },
    {
      year: "2019",
      title: "Taking the Leap",
      description: "Rebranded to Limitless Lab. Hired the first full-time team member. Partnered with DAP, PNB, and Educo on innovation and learning programs. Became a Local Implementing Partner for the ASEAN Digital Innovation Programme. Released our first open-source toolkit: POSIBLE! for civic engagement and local innovation."
    },
    {
      year: "2020",
      title: "Adapting Amidst Crisis",
      description: "Piloted Bayanivation in Pasig and Sipalay. Responded to COVID-19 with digital initiatives like Adapt PH, SIKAP PH, and Puhon! Partnered with DA-ATI to co-develop the Digital Farmers Program toolkit for agriculture communities."
    },
    {
      year: "2021",
      title: "Expanding Impact",
      description: "Became a subcontractor for USAID's BEACON project. Relaunched in-person programs with the first post-pandemic Bayanivation in Del Carmen, Siargao. Launched Mabini PH, our first digital governance platform. Collaborated with Plan International, The Asia Foundation, and ASEAN Foundation."
    },
    {
      year: "2022",
      title: "Laying the Foundation for Scale",
      description: "Relaunched Bayanivation 2.0 in 20+ barangays. Established GovTech PH, the Philippines' first open community for govtech collaboration. Trained over 13,000 Filipinos in digital literacy via #DigiTalino under ADLP. Moved into our Mandaluyong HQ."
    },
    {
      year: "2023",
      title: "Deepening Roots and Building New Communities",
      description: "Launched Limitless Communities, a platform for lifelong innovation engagement. Facilitated multiple youth innovation bootcamps in partnership with the ASEAN Foundation and DA-ATI. Piloted GreatGov GPT, our first AI tool for governance, laying the groundwork for govtech innovation using generative AI."
    },
    {
      year: "2024",
      title: "Regional Scale and Global Recognition",
      description: "Nominated for the WSIS Prizes 2024 for Digitalino. Finalist for Good Design Awards 2024. Participated in the AI for Good Global Summit (ITU) in Geneva, Switzerland. Featured by CNA for our work on Digitalino and ASEAN Digital Literacy Programme (ADLP). Introduced the Accelerate Women Catalog in partnership with The Asia Foundation, promoting visibility for women-led MSMEs in Mindanao."
    },
    {
      year: "2025",
      title: "Using AI for Good",
      description: "Launch of the Limitless Lab Platform. Expansion of training offerings and consulting services to AI. Launch of LimitlessGov, blending AI and design thinking in public sector leadership programs. Deepening partnerships across ASEAN, Europe, and global institutions to democratize innovation."
    }
  ];

  const pillars = [
    {
      title: "Training",
      description: "We equip individuals and institutions with the tools, knowledge, skills, and mindsets to lead change through design thinking, AI, and emerging tech."
    },
    {
      title: "Co-Design",
      description: "We collaborate with partners and communities to co-create strategies, tools, policies, and services rooted in human-centered design."
    },
    {
      title: "Product",
      description: "We develop digital tools, platforms, and AI-powered solutions that support innovation, governance, and social enterprise growth."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Who We Are
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Limitless Lab is an impact enterprise founded in 2018 with the mission to democratize innovation, design, and emerging technologies for the public good.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Based in the Philippines with operations across Southeast Asia, we work with governments, nonprofits, development organizations, and mission-driven businesses to build solutions that are human-centered, tech-enabled, and impact-driven.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="w-full overflow-hidden rounded-2xl">
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/About%20photo.png"
                alt="Limitless Lab Team"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We operate at the intersection of design thinking, digital transformation, and responsible AI—offering services such as innovation and digital strategy consulting, AI and design thinking training, co-design workshops and community engagement, and development of digital platforms for governance, education, and enterprise support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Founding Story */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Founding Story</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Limitless Lab began in 2018 as a passion project by Joie Cruz, a development communicator and design thinking advocate. After years of working with public institutions and grassroots organizations, Joie saw the need for a more creative, collaborative, and tech-enabled approach to solving social and civic challenges.
              </p>
              <p>
                Starting with just one workshop on innovation for youth leaders, Limitless Lab has since grown into a regional force for inclusive innovation—co-creating programs, platforms, and solutions with partners across Southeast Asia and beyond.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600">A Timeline of Innovation and Impact</p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#393CA0] transform md:-translate-x-0.5"></div>
            
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[#393CA0] rounded-full transform -translate-x-2 md:-translate-x-2 z-10"></div>
                  
                  {/* Content */}
                  <div className={`w-full md:w-1/2 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl font-bold text-[#393CA0] mr-4">{event.year}</span>
                        <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Year {parseInt(event.year) - 2016}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Impact Statement */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Impact</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Over the years, Limitless Lab has trained thousands of changemakers, developed multiple platforms for government and citizen engagement, and co-led regional initiatives like the Digital Literacy Programme and the AI Ready ASEAN in partnership with the ASEAN Foundation and Google.org.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
