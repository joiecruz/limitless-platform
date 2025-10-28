import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { MainNav } from "@/components/site-config/MainNav";
import { CTASection } from "@/components/site-config/CTASection";
import { Footer } from "@/components/site-config/Footer";
import heroImage from "@/assets/ai-ready-asean-hero.jpg";

export default function AIReadyASEAN() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden mb-8 relative">
          <img 
            src={heroImage} 
            alt="AI Ready ASEAN Program" 
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-5xl font-bold text-white mb-4">
                AI Ready ASEAN
              </h1>
              <p className="text-xl text-white/90">
                Empowering the Future of ASEAN, One AI Skill at a Time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Narrative */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-xl text-foreground leading-relaxed mb-8">
          Imagine a future where every Filipino, from students and teachers to parents and community leaders, 
          understands how to use Artificial Intelligence (AI) to learn, create, and solve problems responsibly. 
          That is the vision of AI Ready ASEAN, a regional movement led by the ASEAN Foundation, supported by 
          Google.org, and implemented locally by Limitless Lab.
        </p>
      </div>

      {/* Quick Highlights */}
      <div className="bg-secondary/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Impact at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-2xl font-bold text-foreground mb-1">5.5M+</div>
              <div className="text-muted-foreground">People reached across ASEAN</div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-2">🇵🇭</div>
              <div className="text-2xl font-bold text-foreground mb-1">320,000</div>
              <div className="text-muted-foreground">Filipinos to be empowered by 2026</div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-2">🎓</div>
              <div className="text-2xl font-bold text-foreground mb-1">48,000</div>
              <div className="text-muted-foreground">Trained learners</div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-2">🤝</div>
              <div className="text-2xl font-bold text-foreground mb-1">Google.org</div>
              <div className="text-muted-foreground">Program supporter</div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-2">🧑‍🏫</div>
              <div className="text-2xl font-bold text-foreground mb-1">80+</div>
              <div className="text-muted-foreground">Master Trainers nationwide</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">💡 About the Program</h2>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          AI Ready ASEAN was born from a simple belief: everyone deserves the chance to understand 
          and benefit from the power of AI.
        </p>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          Today, AI is transforming how we live, learn, and work. Yet, many people still feel left behind. 
          This program exists to change that.
        </p>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          In the Philippines, Limitless Lab brings this vision to life by working with schools, teachers, 
          and communities to make AI learning simple, fun, and inclusive.
        </p>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          Through engaging activities, challenges, and real stories, we help Filipinos see AI not as 
          something intimidating but as a tool that can empower creativity, curiosity, and meaningful change.
        </p>
      </div>

      {/* Objectives Section */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">🎯 Program Objectives</h2>
          <p className="text-lg text-muted-foreground mb-6">Through AI Ready ASEAN, we aim to:</p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-primary mr-3 mt-1">✓</span>
              <span className="text-lg text-muted-foreground">Build AI literacy and promote responsible, ethical use of technology</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 mt-1">✓</span>
              <span className="text-lg text-muted-foreground">Reach 320,000 learners through nationwide campaigns and Hour of Code activities</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 mt-1">✓</span>
              <span className="text-lg text-muted-foreground">Train 48,000 learners through 12-hour AI learning courses</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 mt-1">✓</span>
              <span className="text-lg text-muted-foreground">Equip over 80 Master Trainers across the country</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 mt-1">✓</span>
              <span className="text-lg text-muted-foreground">Localize ASEAN-wide AI learning materials for the Philippine context</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3 mt-1">✓</span>
              <span className="text-lg text-muted-foreground">Support inclusive and accessible learning opportunities for all</span>
            </li>
          </ul>
          <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
            Our goal is simple: to make AI education accessible to everyone, so no Filipino is left behind 
            in the digital age.
          </p>
        </div>
      </div>

      {/* Main Components */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">🔑 Main Components and Activities</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Hour of Code Challenge</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A fun and interactive introduction to AI and coding for students and teachers. Even schools 
              without computers can join using mobile-friendly or unplugged activities.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Training of Trainers (ToT)</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A 20-hour program for educators and volunteers who want to become AI Master Trainers and 
              guide others in their communities.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">12-Hour AI Courses</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Step-by-step learning for youth, parents, and teachers covering what AI is, how it affects 
              our lives, and how to use it for good.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Awareness Campaigns and Events</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Creative online and offline activities that inspire people to see AI as a positive force 
              for innovation and empowerment.
            </p>
          </div>
        </div>
      </div>

      {/* Target Participants */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">👩‍🏫 Target Participants</h2>
          <p className="text-lg text-muted-foreground mb-8">
            AI Ready ASEAN welcomes everyone, because AI impacts everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-foreground mb-2">Youth (15–35 years old)</h3>
              <p className="text-muted-foreground">Explore AI skills and discover future opportunities</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-foreground mb-2">Educators</h3>
              <p className="text-muted-foreground">Learn how to teach AI and integrate it into the classroom</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-foreground mb-2">Parents</h3>
              <p className="text-muted-foreground">Understand AI to guide your children in the digital world</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-foreground mb-2">Communities</h3>
              <p className="text-muted-foreground">Access free resources and participate in fun learning activities</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground mt-6">
            Each participant becomes part of a growing movement that uses technology for learning, 
            creativity, and positive change.
          </p>
        </div>
      </div>

      {/* Partners */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">🤝 Partners and Supporters</h2>
        <p className="text-lg text-muted-foreground mb-6">This program is made possible by:</p>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border border-primary/20">
            <h3 className="text-xl font-semibold text-foreground mb-2">ASEAN Foundation</h3>
            <p className="text-muted-foreground font-medium">Program Initiator - Leading AI literacy across Southeast Asia</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-2">Google.org</h3>
            <p className="text-muted-foreground">Global supporter promoting inclusive and responsible technology education</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-2">Limitless Lab</h3>
            <p className="text-muted-foreground">Local Implementing Partner (LIP) in the Philippines, working with schools and communities nationwide</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-xl font-semibold text-foreground mb-2">Department of Education (DepEd)</h3>
            <p className="text-muted-foreground">Partner supporting AI education integration in Philippine schools</p>
          </div>
        </div>
        <p className="text-lg text-muted-foreground mt-6 font-medium">
          Together, we are helping every Filipino become ready for the age of AI.
        </p>
      </div>

      {/* Impact Stories */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">💬 Impact and Stories</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Across ASEAN, AI Ready ASEAN will reach over 5.5 million people.
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            In the Philippines, thousands of students and teachers have already begun their AI learning journey.
          </p>
          <div className="bg-card p-8 rounded-lg border-l-4 border-primary">
            <p className="text-lg text-muted-foreground italic mb-4">
              "I used to think AI was only for tech experts. Now I know I can use it for my school 
              projects and even help my community."
            </p>
            <p className="text-muted-foreground font-medium">— Maria, High School Student, Cebu City</p>
          </div>
          <p className="text-lg text-muted-foreground mt-6">
            These stories remind us that AI education is not about machines but about people and their 
            potential to make a difference.
          </p>
        </div>
      </div>


      {/* Get Involved */}
      <div className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🚀 Get Involved</h2>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Join the AI Ready ASEAN movement and help bring AI literacy to your school community
          </p>
          <div className="max-w-md mx-auto bg-card p-8 rounded-lg border text-center mb-8">
            <div className="text-5xl mb-4">🏫</div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Partner Schools</h3>
            <p className="text-muted-foreground mb-6">
              Become a Partner School and host AI Ready ASEAN programs, Hour of Code events, and training sessions for your students and teachers.
            </p>
          </div>
          <div className="flex justify-center">
            <Link to="/contact">
              <Button size="lg">
                Apply as a Partner School
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Attribution */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center p-8 bg-muted/30 rounded-lg">
          <p className="text-lg text-muted-foreground leading-relaxed">
            A flagship program delivered in the Philippines by <strong>Limitless Lab</strong>, in partnership 
            with the <strong>ASEAN Foundation</strong> and <strong>Google.org</strong>.
          </p>
          <p className="text-lg text-muted-foreground mt-4">
            Together, we are helping every Filipino understand and use AI responsibly, creatively, and for good.
          </p>
        </div>
      </div>
      
      <CTASection />
      <Footer />
    </div>
  );
}