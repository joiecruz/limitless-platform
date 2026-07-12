import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { AINav } from "@/components/ai-homepage/AINav";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, Sparkles, Clock, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const PERSONAS = [
  "Business Owner / Entrepreneur",
  "Corporate Professional",
  "Government / Public Sector",
  "Educator / School Leader",
  "Student",
  "Nonprofit / Development Org",
  "Other",
];

const INDUSTRIES = [
  "Technology",
  "Financial Services",
  "Healthcare",
  "Education",
  "Government / Public Sector",
  "Retail / E-commerce",
  "Manufacturing",
  "Professional Services",
  "Nonprofit / NGO",
  "Media & Creative",
  "Other",
];

const COMPANY_SIZES = ["Just me", "2–10", "11–50", "51–200", "201–1000", "1000+"];

const TIMELINES = ["This month", "Next 1–3 months", "Exploring for later"];

const INTERESTS = [
  "AI literacy & upskilling training",
  "Leadership & team AI workshops",
  "Custom in-house training program",
  "AI readiness assessment for our team",
  "Innovation / design thinking sprint",
  "Strategy & roadmap consultation",
  "Program partnership (LimitlessGov, AI Ready ASEAN, etc.)",
  "Something else",
];

const schema = z.object({
  fullName: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  organization: z.string().trim().min(1, "Required").max(160),
  roleTitle: z.string().trim().min(1, "Required").max(120),
  persona: z.string().min(1, "Please select one"),
  industry: z.string().min(1, "Please select one"),
  companySize: z.string().optional(),
  interests: z.array(z.string()).min(1, "Pick at least one"),
  timeline: z.string().optional(),
  message: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function BookConsultation() {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    email: "",
    organization: "",
    roleTitle: "",
    persona: "",
    industry: "",
    companySize: "",
    interests: [],
    timeline: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const toggleInterest = (v: string) => {
    setValues((s) => ({
      ...s,
      interests: s.interests.includes(v)
        ? s.interests.filter((i) => i !== v)
        : [...s.interests, v],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) errs[err.path[0] as string] = err.message;
      });
      setErrors(errs);
      toast.error("Please check the highlighted fields.");
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("consultation_requests").insert({
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      organization: parsed.data.organization,
      role_title: parsed.data.roleTitle,
      persona: parsed.data.persona,
      industry: parsed.data.industry,
      company_size: parsed.data.companySize || null,
      interests: parsed.data.interests,
      timeline: parsed.data.timeline || null,
      message: parsed.data.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Book a Free Consultation — Limitless Lab</title>
        <meta
          name="description"
          content="Book a free 30-minute consultation with a Limitless Lab strategist to map your next step with human-centered AI, training, and innovation."
        />
        <link rel="canonical" href="https://limitlesslab.org/book-consultation" />
        <meta property="og:title" content="Book a Free Consultation — Limitless Lab" />
        <meta
          property="og:description"
          content="30 minutes with a Limitless Lab strategist. No obligation, actionable next steps."
        />
        <meta property="og:url" content="https://limitlesslab.org/book-consultation" />
        <meta property="og:type" content="website" />
      </Helmet>

      <AINav />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {done ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-9 w-9 text-green-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Thanks — we'll be in touch.
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                One of our strategists will reach out within 1 business day to schedule
                your free consultation.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => navigate("/")}
                  className="bg-[#393CA0] hover:bg-[#393CA0]/90"
                >
                  Return home
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/programs">Explore our programs</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
              {/* Left */}
              <div className="lg:col-span-2 lg:sticky lg:top-28">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#393CA0]/10 text-[#393CA0] text-sm font-medium mb-5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Free consultation
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">
                  Let's map your next step with{" "}
                  <span className="italic text-[#393CA0]" style={{ fontFamily: "Georgia, serif" }}>
                    human-centered AI
                  </span>
                  .
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  30 focused minutes with a Limitless Lab strategist. We'll listen to
                  where you are, share what's worked for similar teams, and leave you
                  with clear next steps — whether or not we end up working together.
                </p>
                <ul className="space-y-4">
                  {[
                    {
                      icon: <Sparkles className="h-4 w-4" />,
                      title: "Personalized to your context",
                      desc: "We'll come prepared based on what you share below.",
                    },
                    {
                      icon: <Clock className="h-4 w-4" />,
                      title: "30 minutes, no obligation",
                      desc: "You leave with recommendations, not a sales pitch.",
                    },
                    {
                      icon: <Shield className="h-4 w-4" />,
                      title: "Actionable next steps",
                      desc: "Concrete direction on training, strategy, or partnership.",
                    },
                  ].map((f) => (
                    <li key={f.title} className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#393CA0]/10 text-[#393CA0] flex items-center justify-center">
                        {f.icon}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{f.title}</p>
                        <p className="text-sm text-gray-600">{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — form */}
              <div className="lg:col-span-3">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full name *</Label>
                      <Input
                        id="fullName"
                        value={values.fullName}
                        onChange={(e) => setValues({ ...values, fullName: e.target.value })}
                        maxLength={120}
                        required
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Work email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={values.email}
                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                        maxLength={255}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organization">Organization / School *</Label>
                      <Input
                        id="organization"
                        value={values.organization}
                        onChange={(e) =>
                          setValues({ ...values, organization: e.target.value })
                        }
                        maxLength={160}
                        required
                      />
                      {errors.organization && (
                        <p className="text-sm text-red-600 mt-1">{errors.organization}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="roleTitle">Role / job title *</Label>
                      <Input
                        id="roleTitle"
                        value={values.roleTitle}
                        onChange={(e) =>
                          setValues({ ...values, roleTitle: e.target.value })
                        }
                        maxLength={120}
                        required
                      />
                      {errors.roleTitle && (
                        <p className="text-sm text-red-600 mt-1">{errors.roleTitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="persona">I am a… *</Label>
                      <Select
                        value={values.persona || undefined}
                        onValueChange={(v) => setValues({ ...values, persona: v })}
                      >
                        <SelectTrigger id="persona">
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                          {PERSONAS.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.persona && (
                        <p className="text-sm text-red-600 mt-1">{errors.persona}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry *</Label>
                      <Select
                        value={values.industry || undefined}
                        onValueChange={(v) => setValues({ ...values, industry: v })}
                      >
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.industry && (
                        <p className="text-sm text-red-600 mt-1">{errors.industry}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companySize">
                        Company size{" "}
                        <span className="text-gray-400 font-normal">(optional)</span>
                      </Label>
                      <Select
                        value={values.companySize || undefined}
                        onValueChange={(v) => setValues({ ...values, companySize: v })}
                      >
                        <SelectTrigger id="companySize">
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPANY_SIZES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timeline">
                        Preferred timeline{" "}
                        <span className="text-gray-400 font-normal">(optional)</span>
                      </Label>
                      <Select
                        value={values.timeline || undefined}
                        onValueChange={(v) => setValues({ ...values, timeline: v })}
                      >
                        <SelectTrigger id="timeline">
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMELINES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">What are you looking for? *</Label>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((opt) => {
                        const active = values.interests.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleInterest(opt)}
                            className={`px-3.5 py-2 rounded-full border text-sm font-medium transition ${
                              active
                                ? "bg-[#393CA0] text-white border-[#393CA0]"
                                : "bg-white text-gray-700 border-gray-300 hover:border-[#393CA0]/50"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {errors.interests && (
                      <p className="text-sm text-red-600 mt-2">{errors.interests}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">
                      Anything else we should know?{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={values.message}
                      onChange={(e) => setValues({ ...values, message: e.target.value })}
                      maxLength={1000}
                      rows={4}
                      placeholder="A challenge you're facing, a goal for the year, or a question you'd like us to prep for."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full bg-[#393CA0] hover:bg-[#393CA0]/90"
                  >
                    {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Book my free consultation
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    By submitting, you agree to be contacted by Limitless Lab about your
                    request. We respect your privacy.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
