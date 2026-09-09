import { useState } from "react";
import type { FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import slidePreview from "@/assets/pafjo-slides-preview.png.asset.json";

// TODO: drop the real deck at public/pafjo-slides.pdf (or replace with a hosted URL)
const SLIDES_DOWNLOAD_URL = "/pafjo-slides.pdf";

const leadSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name").max(80, "Keep your first name under 80 characters"),
  lastName: z.string().trim().min(1, "Enter your last name").max(80, "Keep your last name under 80 characters"),
  company: z.string().trim().min(1, "Enter your company or organization").max(160, "Keep this under 160 characters"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Keep your email under 255 characters"),
  employeeCount: z.string().min(1, "Select your team size"),
  industry: z.string().min(1, "Select your industry"),
  referralSource: z.string().min(1, "Tell us how you heard about us"),
});

type LeadValues = z.infer<typeof leadSchema>;
type LeadErrors = Partial<Record<keyof LeadValues, string>>;

const teamSizes = ["Just me", "2–10", "11–50", "51–200", "201+"];
const industries = ["Professional services", "Education", "Retail & e-commerce", "Hospitality", "Health & wellness", "Creative industries", "Technology", "Other"];
const referralSources = ["Social media", "Search engine", "Friend or colleague", "Limitless Lab event", "Email newsletter", "Other"];

export default function PafjoSlides() {
  const [values, setValues] = useState<LeadValues>({ firstName: "", lastName: "", company: "", email: "", employeeCount: "", industry: "", referralSource: "" });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const updateValue = (field: keyof LeadValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: LeadErrors = {};
      parsed.error.errors.forEach((error) => {
        const field = error.path[0] as keyof LeadValues | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = error.message;
      });
      setErrors(nextErrors);
      const firstInvalid = Object.keys(nextErrors)[0];
      if (firstInvalid) document.getElementById(`pafjo-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("submitting");
    const { error } = await supabase.from("pafjo_slide_leads").insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      company: parsed.data.company,
      email: parsed.data.email.toLowerCase(),
      team_size: parsed.data.employeeCount,
      industry: parsed.data.industry,
      referral_source: parsed.data.referralSource,
    });

    setStatus(error ? "error" : "success");
  };

  const fieldError = (field: keyof LeadValues) =>
    errors[field] ? <p className="mt-1.5 text-sm text-red-700">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-900">
      <Helmet>
        <title>The AI Advantage — Download the Slides | Limitless Lab</title>
        <meta name="description" content="Download the slides from The AI Advantage: Transforming How We Work and Live, presented by Joie Cruz, Founder & CEO of Limitless Lab, at the PAFJO TMJ, Orofacial Pain & Airway Course Program — Batch 2." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: headline + slide preview */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              PAFJO TMJ, Orofacial Pain &amp; Airway Course Program — Batch 2
            </p>
            <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              The AI<br />Advantage
            </h1>
            <p className="mt-4 text-xl font-semibold text-[#393CA0] sm:text-2xl">
              Transforming How We Work and Live
            </p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">
              Get the full slide deck from Joie Cruz's session — practical ways AI can support your practice, your team, and your everyday work.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
              <img
                src={slidePreview.url}
                alt="Title slide of The AI Advantage — Transforming How We Work and Live by Joie Cruz, Founder & CEO of Limitless Lab"
                className="h-auto w-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: form / success */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
            {status === "success" ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 className="h-14 w-14 text-[#393CA0]" aria-hidden="true" />
                <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">You're all set!</h2>
                <p className="mt-3 max-w-sm text-base text-gray-600">
                  Thanks, {values.firstName}. Your copy of the slides is ready — click below to download it.
                </p>
                <Button asChild size="lg" className="mt-8 h-12 w-full bg-[#393CA0] px-7 text-base text-white hover:bg-[#2e3180]">
                  <a href={SLIDES_DOWNLOAD_URL} download>
                    <Download aria-hidden="true" />
                    Download the Slides
                  </a>
                </Button>
                <p className="mt-4 text-sm text-gray-500">A link will also be useful later — keep this page handy.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Download the slides</h2>
                <p className="mt-2 text-base text-gray-600">
                  Fill in your details and get instant access to the full deck.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="pafjo-firstName">First name</Label>
                    <Input id="pafjo-firstName" className="mt-2 h-12" autoComplete="given-name" value={values.firstName} onChange={(e) => updateValue("firstName", e.target.value)} />
                    {fieldError("firstName")}
                  </div>
                  <div>
                    <Label htmlFor="pafjo-lastName">Last name</Label>
                    <Input id="pafjo-lastName" className="mt-2 h-12" autoComplete="family-name" value={values.lastName} onChange={(e) => updateValue("lastName", e.target.value)} />
                    {fieldError("lastName")}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="pafjo-company">Company / organization</Label>
                    <Input id="pafjo-company" className="mt-2 h-12" autoComplete="organization" value={values.company} onChange={(e) => updateValue("company", e.target.value)} />
                    {fieldError("company")}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="pafjo-email">Email</Label>
                    <Input id="pafjo-email" type="email" className="mt-2 h-12" autoComplete="email" value={values.email} onChange={(e) => updateValue("email", e.target.value)} />
                    {fieldError("email")}
                  </div>
                  <div>
                    <Label htmlFor="pafjo-employeeCount">Number of employees</Label>
                    <Select value={values.employeeCount} onValueChange={(value) => updateValue("employeeCount", value)}>
                      <SelectTrigger id="pafjo-employeeCount" className="mt-2 h-12"><SelectValue placeholder="Select one" /></SelectTrigger>
                      <SelectContent>{teamSizes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select>
                    {fieldError("employeeCount")}
                  </div>
                  <div>
                    <Label htmlFor="pafjo-industry">Industry</Label>
                    <Select value={values.industry} onValueChange={(value) => updateValue("industry", value)}>
                      <SelectTrigger id="pafjo-industry" className="mt-2 h-12"><SelectValue placeholder="Select one" /></SelectTrigger>
                      <SelectContent>{industries.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select>
                    {fieldError("industry")}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="pafjo-referralSource">How did you hear about us?</Label>
                    <Select value={values.referralSource} onValueChange={(value) => updateValue("referralSource", value)}>
                      <SelectTrigger id="pafjo-referralSource" className="mt-2 h-12"><SelectValue placeholder="Select one" /></SelectTrigger>
                      <SelectContent>{referralSources.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select>
                    {fieldError("referralSource")}
                  </div>

                  {status === "error" && (
                    <p className="sm:col-span-2 text-sm text-red-700">Something went wrong saving your details. Please try again.</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "submitting"}
                    className="h-12 w-full bg-[#393CA0] text-base text-white hover:bg-[#2e3180] sm:col-span-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="animate-spin" aria-hidden="true" />
                        Saving your spot…
                      </>
                    ) : (
                      <>
                        Get the Slides
                        <ArrowRight aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="mt-5 text-center text-xs leading-relaxed text-gray-500">
                  By downloading, you agree to receive occasional updates from Limitless Lab. No spam, unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
