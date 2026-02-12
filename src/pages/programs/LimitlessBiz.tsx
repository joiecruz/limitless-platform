import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle } from "lucide-react";
import { MainNav } from "@/components/site-config/MainNav";
import { CTASection } from "@/components/site-config/CTASection";
import { Footer } from "@/components/site-config/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function LimitlessBiz() {
  usePageTitle("LimitlessBiz: AI for Business Owners Challenge | Limitless Lab");

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      {/* Hero Section */}
      <div className="relative min-h-[600px] max-h-[800px] h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative h-full flex flex-col items-start justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <p className="text-sm uppercase tracking-widest text-white/70 mb-4">Challenge Mechanics</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            LimitlessBiz
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-3xl font-light">
            AI for Business Owners Challenge
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">₱55K+</div>
              <div className="text-white/80 text-sm">Total Prizes</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">8</div>
              <div className="text-white/80 text-sm">Winners</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">FREE</div>
              <div className="text-white/80 text-sm">Course Enrollment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Who Can Join */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">👩‍💼 Who Can Join</h2>
        <p className="text-lg text-muted-foreground mb-6">This competition is open to:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            "Business owners",
            "Business managers",
            "Solopreneurs",
            "Freelancers running a business",
            "Micro, Small, and Medium Enterprises (MSMEs)",
            "Both registered and unregistered businesses",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-lg text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-4">Participants must:</h3>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span className="text-lg text-muted-foreground">Be at least 18 years old</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span className="text-lg text-muted-foreground">Be currently operating a business in the Philippines</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span className="text-lg text-muted-foreground">Complete the LimitlessBiz online course</span>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground italic">
          Employees of Limitless Lab and their immediate family members are not eligible.
        </p>
      </div>

      {/* How to Join */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">📋 How to Join</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Follow Limitless Lab</h3>
                <p className="text-lg text-muted-foreground">Follow Limitless Lab on Facebook and Instagram.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Enroll in the FREE LimitlessBiz Course</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  After enrolling, you will automatically receive access to the LimitlessBiz AI online course.
                  You will receive access to the Learning Management System (LMS) in your email.
                </p>
                <a href="https://bit.ly/LimitlessBizEnroll" target="_blank" rel="noopener noreferrer">
                  <Button>
                    Enroll Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Complete the Course</h3>
                <p className="text-lg text-muted-foreground">
                  Finish all 4 Essential Modules to receive your official digital certificate.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">4</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Post Your Certificate on Facebook</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Post your certificate on Facebook (set to <strong>PUBLIC</strong>). You may also post a selfie holding your certificate.
                </p>
                <div className="bg-card border rounded-lg p-6">
                  <p className="font-semibold text-foreground mb-3">In your caption, share:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      What you learned from the course
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      How you will use AI to improve or grow your business
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Invite other business owners to take the FREE course
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      Use the hashtags: <strong className="text-foreground">#AIMASEAN #AIforMSMEs #LimitlessBiz</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tag: <strong className="text-foreground">@Limitless Lab</strong> and <strong className="text-foreground">@ASEANFoundation</strong>
                    </p>
                    <p className="text-sm text-destructive mt-2 font-medium">
                      Only PUBLIC posts will be eligible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prizes */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">🏆 Prizes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">🥇</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">3 Winners</h3>
            <p className="text-3xl font-bold text-primary">₱10,000 each</p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-zinc-50 dark:from-slate-950/30 dark:to-zinc-950/30 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">🥈</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">5 Winners</h3>
            <p className="text-3xl font-bold text-primary">₱5,000 each</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-6 italic">
          Prizes will be awarded to the individual participant. Applicable taxes, if any, will be shouldered by the winner.
        </p>
      </div>

      {/* Duration */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">⏰ Duration</h2>
          <div className="bg-card border rounded-xl p-8 flex items-center gap-6">
            <Clock className="h-12 w-12 text-primary shrink-0" />
            <div>
              <p className="text-xl font-semibold text-foreground mb-1">
                Enrollment and submission deadline: <span className="text-primary">May 31, 2026</span>
              </p>
              <p className="text-muted-foreground font-medium">Late submissions will not be accepted.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Judging Criteria */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">📝 Judging Criteria</h2>
        <p className="text-lg text-muted-foreground mb-6">Entries will be evaluated based on:</p>
        <div className="space-y-4">
          {[
            { label: "Practical application to the business", weight: "40%" },
            { label: "Clarity of learning and insight", weight: "30%" },
            { label: "Impact and growth potential", weight: "20%" },
            { label: "Quality and authenticity of story", weight: "10%" },
          ].map((criterion) => (
            <div key={criterion.label} className="flex items-center gap-4">
              <div className="flex-1 bg-card border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-foreground">{criterion.label}</span>
                  <span className="text-xl font-bold text-primary">{criterion.weight}</span>
                </div>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: criterion.weight }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6 italic">
          The judges' decision is final.
        </p>
      </div>

      {/* CTA */}
      <div className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">🚀 Join the Challenge Now</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Enroll in the FREE LimitlessBiz course, complete the modules, and share your AI journey for a chance to win!
          </p>
          <a href="https://bit.ly/LimitlessBizEnroll" target="_blank" rel="noopener noreferrer">
            <Button size="lg">
              Enroll Now – It's Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <p className="text-sm text-muted-foreground mt-6">
            Follow the journey: <strong>#AIMASEAN #AIforMSMEs #LimitlessBiz</strong>
          </p>
        </div>
      </div>

      <CTASection />
      <Footer />
    </div>
  );
}
