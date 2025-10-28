import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Globe } from "lucide-react";
import { MainNav } from "@/components/site-config/MainNav";
import { CTASection } from "@/components/site-config/CTASection";
import { Footer } from "@/components/site-config/Footer";
import heroImage from "@/assets/limitlessgov-hero.jpg";

export default function LimitlessGov() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Hero Section with Cover Image */}
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="LimitlessGov youth leaders workshop" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              LimitlessGov
            </h1>
            <p className="text-2xl md:text-3xl mb-8 font-light">
              Human-Centered and AI-Powered Governance
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold">298</div>
                <div className="text-sm opacity-90">Youth Leaders Trained</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">5</div>
                <div className="text-sm opacity-90">Partner LGUs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">24</div>
                <div className="text-sm opacity-90">AI Solutions Developed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">2</div>
                <div className="text-sm opacity-90">MOUs Signed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About the Program */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">About the Program</h2>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          LimitlessGov is a capability development program that empowers young public servants—particularly Sangguniang Kabataan (SK) officials and youth leaders—to reimagine governance through design thinking, good governance principles, and artificial intelligence (AI).
        </p>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          The program aims to strengthen transparency, accountability, and inclusivity in local governance by equipping youth leaders with practical AI and innovation tools to design data-driven, citizen-centered solutions.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          This initiative reflects Limitless Lab's mission to democratize innovation and emerging technologies for public good, helping LGUs and youth councils design governance that is more human-centered, ethical, and future-ready.
        </p>
      </div>

      {/* Program Objectives */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Program Objectives</h2>
          <p className="text-lg text-muted-foreground mb-6">By the end of the program, participants were able to:</p>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
              <p className="text-lg text-muted-foreground">Integrate AI and design thinking into their governance planning processes.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
              <p className="text-lg text-muted-foreground">Apply transparency, accountability, and inclusivity principles in developing projects.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
              <p className="text-lg text-muted-foreground">Build AI-assisted solutions for community challenges such as waste management, disaster resilience, and youth mental health.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">4</div>
              <p className="text-lg text-muted-foreground">Use AI tools ethically and responsibly, ensuring data privacy and fairness in public service.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">5</div>
              <p className="text-lg text-muted-foreground">Create a network of values-driven, AI-proficient youth innovators across the Philippines.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Components */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">Main Components / Activities</h2>
        <div className="space-y-8">
          <div className="border-l-4 border-primary pl-6">
            <h3 className="text-2xl font-semibold text-foreground mb-3">1. Project Vivid Vision</h3>
            <p className="text-lg text-muted-foreground">
              Participants reflected on their leadership values and created personal and collective visions for human-centered, AI-powered governance.
            </p>
          </div>
          <div className="border-l-4 border-primary pl-6">
            <h3 className="text-2xl font-semibold text-foreground mb-3">2. AI and Design Thinking Bootcamps</h3>
            <p className="text-lg text-muted-foreground">
              Intensive two-day workshops conducted in Taytay, Iligan, Sipalay, Mandaluyong, and Naga City, combining good governance principles with practical AI applications.
            </p>
          </div>
          <div className="border-l-4 border-primary pl-6">
            <h3 className="text-2xl font-semibold text-foreground mb-3">3. Online Course & Learning Management System (LMS)</h3>
            <p className="text-lg text-muted-foreground">
              A dedicated LimitlessGov LMS allowed participants to access online lessons, toolkits, and micro-content on design thinking, AI, and ethical governance.
            </p>
          </div>
          <div className="border-l-4 border-primary pl-6">
            <h3 className="text-2xl font-semibold text-foreground mb-3">4. Capstone Projects & Innovation Pitches</h3>
            <p className="text-lg text-muted-foreground">
              Participants developed and pitched 24 AI-powered solutions addressing real community challenges.
            </p>
          </div>
          <div className="border-l-4 border-primary pl-6">
            <h3 className="text-2xl font-semibold text-foreground mb-3">5. Community Building & Ongoing Collaboration</h3>
            <p className="text-lg text-muted-foreground">
              Post-program online community where youth leaders continue exchanging ideas and co-developing projects with their LGUs.
            </p>
          </div>
        </div>
      </div>

      {/* Target Participants */}
      <div className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Target Participants / Beneficiaries</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Sangguniang Kabataan (SK) Officials</h3>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Youth Organization Leaders</h3>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Local Youth Development Officers</h3>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-3">🏛️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">LGU Representatives</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">Partners and Supporters</h2>
        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-foreground">Supported by:</span>{" "}
            <span className="text-muted-foreground">U.S. Embassy in the Philippines</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-foreground">Implemented by:</span>{" "}
            <span className="text-muted-foreground">Limitless Lab</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-foreground">Partner LGUs:</span>{" "}
            <span className="text-muted-foreground">Taytay (Rizal), Sipalay City, Iligan City, Naga City, Mandaluyong City</span>
          </p>
        </div>
      </div>

      {/* Impact and Stories */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">💡 Impact and Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card p-6 rounded-lg border text-center">
              <div className="text-4xl font-bold text-primary mb-2">298</div>
              <p className="text-muted-foreground">Youth leaders trained nationwide</p>
            </div>
            <div className="bg-card p-6 rounded-lg border text-center">
              <div className="text-4xl font-bold text-primary mb-2">24</div>
              <p className="text-muted-foreground">AI-powered governance solutions developed</p>
            </div>
            <div className="bg-card p-6 rounded-lg border text-center">
              <div className="text-4xl font-bold text-primary mb-2">5</div>
              <p className="text-muted-foreground">Partner LGUs engaged</p>
            </div>
            <div className="bg-card p-6 rounded-lg border text-center">
              <div className="text-4xl font-bold text-primary mb-2">2</div>
              <p className="text-muted-foreground">MOUs and local resolutions passed</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-foreground mb-6">Sample AI Solutions:</h3>
          <div className="space-y-4 mb-8">
            <div className="bg-card p-6 rounded-lg border">
              <h4 className="font-semibold text-foreground mb-2">Taytay Flood Network</h4>
              <p className="text-muted-foreground">AI-based early warning and communication system for flood-prone areas</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h4 className="font-semibold text-foreground mb-2">TeenTalk</h4>
              <p className="text-muted-foreground">AI-supported reproductive health awareness campaign in Sipalay City</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h4 className="font-semibold text-foreground mb-2">Basuready</h4>
              <p className="text-muted-foreground">AI-assisted waste management heatmap developed by youth in Naga City</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h4 className="font-semibold text-foreground mb-2">TrashCoin</h4>
              <p className="text-muted-foreground">Reward-based recycling system designed by Iligan youth leaders</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h4 className="font-semibold text-foreground mb-2">OpportuNEXT</h4>
              <p className="text-muted-foreground">AI-powered scholarship finder for Iligan students</p>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg border-l-4 border-primary">
            <p className="text-lg text-muted-foreground italic mb-4">
              "We realized that AI isn't just for tech companies—it's for SKs too. It can help us plan better and solve real problems in our barangays."
            </p>
            <p className="text-muted-foreground font-medium">— SK Chairperson, Taytay, Rizal</p>
          </div>
        </div>
      </div>

      {/* Get Involved */}
      <div className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">🚀 Get Involved</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Want to bring LimitlessGov to your city or organization?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:hello@limitlesslab.org">
              <Button size="lg">
                <Mail className="mr-2 h-5 w-5" />
                Email us
              </Button>
            </a>
            <a href="https://limitlesslab.org" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                <Globe className="mr-2 h-5 w-5" />
                Visit limitlesslab.org
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      <CTASection />
      <Footer />
    </div>
  );
}