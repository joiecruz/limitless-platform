import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { MainNav } from "@/components/site-config/MainNav";
import { CTASection } from "@/components/site-config/CTASection";
import { Footer } from "@/components/site-config/Footer";
import heroImage from "@/assets/aim-asean-hero.jpg";

export default function AIMASEAN() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px] max-h-[800px]">
        <img 
          src={heroImage} 
          alt="AIM ASEAN Program" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div className="relative h-full flex flex-col items-start justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
            AIM ASEAN
          </h1>
          <p className="text-2xl text-white/90 mb-12">
            Empowering Filipino MSMEs to harness the power of AI for growth, innovation, and resilience
          </p>
          
          {/* Target Impact Label */}
          <p className="text-xs text-white/60 uppercase tracking-wider mb-4">Target Impact</p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">17,500+</div>
              <div className="text-white/80 text-sm">MSMEs to be Trained (PH)</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">100K</div>
              <div className="text-white/80 text-sm">MSMEs (ASEAN-wide)</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">2025-2027</div>
              <div className="text-white/80 text-sm">Implementation Period</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Narrative */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xl text-foreground leading-relaxed">
          A dynamic image showing small business owners in action—using laptops, mobile devices, or working 
          with digital tools—set against the ASEAN map. This represents the future where Filipino MSMEs are 
          equipped with AI skills to compete and thrive in the digital economy.
        </p>
      </div>

      {/* About Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">💡 About the Program</h2>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          AIM ASEAN (Artificial Intelligence for MSME Advancement in ASEAN) is a two-year regional initiative 
          led by the ASEAN Foundation, under the AI Opportunity Fund: Asia-Pacific, in collaboration with AVPN 
          and supported by Google.org and the Asian Development Bank (ADB).
        </p>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          In the Philippines, Limitless Lab serves as the Local Implementing Partner (LIP), leading nationwide 
          efforts to equip Filipino micro, small, and medium enterprises (MSMEs) with practical AI skills and 
          tools that enhance efficiency, competitiveness, and long-term resilience.
        </p>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          This program aims to make AI accessible to everyday entrepreneurs—from retailers and manufacturers to 
          creatives and service providers—helping them adapt, innovate, and thrive in the digital economy.
        </p>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          <strong>Connection to Limitless Lab's Mission:</strong> As an impact-driven enterprise that champions 
          human-centered and AI-powered innovation, Limitless Lab sees AIM ASEAN as an opportunity to bridge the 
          AI literacy gap and ensure that the digital transformation of ASEAN economies is inclusive, ethical, 
          and sustainable.
        </p>
      </div>

      {/* Objectives Section */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">🎯 Program Objectives</h2>
          <p className="text-lg text-muted-foreground mb-6">By the end of the program, AIM ASEAN seeks to:</p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-primary mr-3 mt-1">✓</span>
              <span className="text-lg text-muted-foreground">Equip MSMEs with practical, sector-relevant AI skills for business growth</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 mt-1">✓</span>
              <span className="text-lg text-muted-foreground">Increase awareness and understanding of AI's role in marketing, e-commerce, and financial management</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 mt-1">✓</span>
              <span className="text-lg text-muted-foreground">Build a national network of trainers and experts capable of cascading AI literacy to local business communities</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 mt-1">✓</span>
              <span className="text-lg text-muted-foreground">Facilitate collaboration between MSMEs, government agencies, and the private sector to create a thriving AI ecosystem</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 mt-1">✓</span>
              <span className="text-lg text-muted-foreground">Contribute to ASEAN's collective goal of responsible and inclusive AI adoption by 2030</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Components */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">🔑 Main Components and Activities</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">AI Training for MSMEs</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Localised and practical AI learning modules (4 hours each) tailored to business sectors such as 
              retail, manufacturing, agriculture, and services. The modules focus on AI-powered marketing, 
              e-commerce tools, and financial management systems.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Training of Trainers (ToT)</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A national-level capacity-building initiative to equip Master Trainers who will cascade AI training 
              sessions across regions and industries.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">MSME AI Learning Series</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A hybrid training rollout (in-person and online) designed to reach at least 17,500 Filipino MSME 
              owners, ensuring inclusivity and accessibility even in remote areas.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">National Policy Roundtable</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A multi-sectoral dialogue convening policymakers, business chambers, NGOs, and academia to 
              strengthen the policy environment for AI adoption among MSMEs.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Awareness and Impact Campaigns</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A communications campaign that amplifies success stories, highlights AI use cases, and raises 
              awareness of responsible AI across Filipino MSMEs.
            </p>
          </div>
        </div>
      </div>

      {/* Target Participants */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">👩‍💼 Target Participants / Beneficiaries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-foreground mb-2">MSME Owners</h3>
              <p className="text-muted-foreground">Micro, small, and medium enterprise owners across all sectors</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-foreground mb-2">Entrepreneurs</h3>
              <p className="text-muted-foreground">Business owners in retail, manufacturing, services, and creative industries</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-foreground mb-2">Business Organizations</h3>
              <p className="text-muted-foreground">Business development organizations and chambers</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-foreground mb-2">LGUs & Trainers</h3>
              <p className="text-muted-foreground">Local government units, digital transformation champions, and MSME educators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">🤝 Partners and Supporters</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border border-primary/20">
            <h3 className="text-xl font-semibold text-foreground mb-2">ASEAN Foundation</h3>
            <p className="text-muted-foreground font-medium">Lead Implementing Organization</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-2">AVPN</h3>
            <p className="text-muted-foreground">Collaborator</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-2">Google.org</h3>
            <p className="text-muted-foreground">Supporter</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-2">Asian Development Bank (ADB)</h3>
            <p className="text-muted-foreground">Supporter</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-2">Limitless Lab</h3>
            <p className="text-muted-foreground">Philippine Local Implementing Partner</p>
          </div>
        </div>
      </div>

      {/* Get Involved */}
      <div className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">🚀 Get Involved</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Are you an MSME owner, trainer, or policymaker interested in advancing AI adoption in the Philippines?
            Join AIM ASEAN and be part of the movement empowering businesses for the digital future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a href="mailto:hello@limitlesslab.org">
              <Button size="lg">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="https://limitlesslab.org" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                Visit Our Website
              </Button>
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Follow the journey: <strong>#AIMASEAN #AIforMSMEs</strong>
          </p>
        </div>
      </div>

      {/* Footer Attribution */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center p-8 bg-muted/30 rounded-lg">
          <p className="text-lg text-muted-foreground leading-relaxed">
            A regional initiative for MSME advancement delivered in the Philippines by <strong>Limitless Lab</strong>, 
            in partnership with the <strong>ASEAN Foundation</strong>, <strong>AVPN</strong>, <strong>Google.org</strong>, 
            and the <strong>Asian Development Bank</strong>.
          </p>
          <p className="text-lg text-muted-foreground mt-4">
            Together, we are helping Filipino MSMEs harness AI for growth, innovation, and resilience.
          </p>
        </div>
      </div>
      
      <CTASection />
      <Footer />
    </div>
  );
}
