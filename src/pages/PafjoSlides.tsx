import { useState } from "react";
import type { FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Download, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import slidePreview from "@/assets/pafjo-slides-preview.png.asset.json";
import pafjoSlidesPdf from "@/assets/pafjo-slides.pdf.asset.json";

const SLIDES_DOWNLOAD_URL = pafjoSlidesPdf.url;

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [values, setValues] = useState<LeadValues>({ firstName: "", lastName: "", company: "", email: "", employeeCount: "", industry: "", referralSource: "" });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "duplicate" | "error">("idle");

  const updateValue = (field: keyof LeadValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  const openDialog = (email = "") => {
    const normalizedEmail = email.trim();
    if (normalizedEmail) updateValue("email", normalizedEmail);
    setDialogOpen(true);
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
      setStatus("idle");
      const firstInvalid = Object.keys(nextErrors)[0];
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
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

    if (!error) {
      setStatus("success");
      return;
    }
    setStatus(error.code === "23505" ? "duplicate" : "error");
  };

  const downloadButton = (
    <Button asChild size="lg" className="h-12 w-full bg-[#393CA0] px-7 text-base text-white hover:bg-[#2e3180]">
      <a href={SLIDES_DOWNLOAD_URL} download>
        <Download aria-hidden="true" />
        Download the Slides
      </a>
    </Button>
  );

  const lockedDownloadCard = (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <Lock className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">Slides locked</h3>
      <p className="mt-1 text-sm text-gray-500">Submit the form to unlock your download.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-900">
      <Helmet>
        <title>The AI Advantage — Download the Slides | Limitless Lab</title>
        <meta name="description" content="Download the slides from The AI Advantage: Transforming How We Work and Live, presented by Joie Cruz, Founder & CEO of Limitless Lab, at the PAFJO TMJ, Orofacial Pain & Airway Course Program — Batch 2." />
        <link rel="canonical" href="https://limitlesslab.org/pafjo-slides" />
        <meta property="og:title" content="The AI Advantage — Download the Slides | Limitless Lab" />
        <meta property="og:description" content="Get the full slide deck from Joie Cruz's session on practical ways AI can support your practice, your team, and your everyday work." />
        <meta property="og:url" content="https://limitlesslab.org/pafjo-slides" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Limitless Lab" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The AI Advantage — Download the Slides | Limitless Lab" />
        <meta name="twitter:description" content="Get the full slide deck from Joie Cruz's session on practical ways AI can support your practice, your team, and your everyday work." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DigitalDocument",
          name: "The AI Advantage — Transforming How We Work and Live",
          description: "Slide deck from Joie Cruz's session at the PAFJO TMJ, Orofacial Pain & Airway Course Program — Batch 2.",
          url: "https://limitlesslab.org/pafjo-slides",
          author: { "@type": "Person", name: "Joie Cruz" },
          publisher: { "@type": "Organization", name: "Limitless Lab", url: "https://limitlesslab.org" },
        })}</script>
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

            <div className="mt-6">
              {status === "success" || status === "duplicate" ? downloadButton : lockedDownloadCard}
            </div>
            {(status === "success" || status === "duplicate") && (
              <p className="mt-3 text-center text-sm text-gray-500">
                {status === "duplicate" ? "You already have access — download above." : "Your download is ready above."}
              </p>
            )}
          </div>

          {/* Right: lead capture card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Download the slides</h2>
            <p className="mt-2 text-base text-gray-600">
              Enter your email and we'll send you the full deck instantly.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={(event) => updateValue("email", event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    openDialog(values.email);
                  }
                }}
                className="h-12 flex-1 border-gray-300 focus-visible:ring-[#393CA0]"
              />
              <Button
                type="button"
                size="lg"
                onClick={() => openDialog(values.email)}
                className="h-12 bg-[#393CA0] px-7 text-base text-white hover:bg-[#2e3180]"
              >
                Get the Slides
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>

            <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
              By downloading, you agree to receive occasional updates from Limitless Lab. No spam, unsubscribe anytime.
            </p>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-900">What you'll get:</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#393CA0]" aria-hidden="true" />
                  Full slide deck from the PAFJO session
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#393CA0]" aria-hidden="true" />
                  Practical AI use cases for your practice
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#393CA0]" aria-hidden="true" />
                  Tools and prompts you can use right away
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-lg border-gray-200 p-6 sm:p-10">
          {status === "success" || status === "duplicate" ? (
            <div role="status" aria-live="polite" className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-14 w-14 text-[#393CA0]" aria-hidden="true" />
              <DialogTitle className="mt-6 text-3xl">
                {status === "success" ? "You're all set!" : "You already have access!"}
              </DialogTitle>
              <DialogDescription className="mx-auto mt-5 max-w-lg text-lg leading-8">
                {status === "success"
                  ? `Thanks, ${values.firstName}. Your copy of the slides is ready — click below to download it.`
                  : "This email is already on our list. Your download is ready below."}
              </DialogDescription>
              <div className="mt-8 w-full max-w-sm">
                {downloadButton}
              </div>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Download the slides</DialogTitle>
                <DialogDescription className="text-base">
                  Tell us a bit about yourself and we'll unlock the full deck.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"} className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" autoComplete="given-name" value={values.firstName} onChange={(event) => updateValue("firstName", event.target.value)} maxLength={80} aria-invalid={Boolean(errors.firstName)} className="mt-2 h-12 border-gray-300 focus-visible:ring-[#393CA0]" />
                  {errors.firstName && <p className="mt-1.5 text-sm text-red-700">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" autoComplete="family-name" value={values.lastName} onChange={(event) => updateValue("lastName", event.target.value)} maxLength={80} aria-invalid={Boolean(errors.lastName)} className="mt-2 h-12 border-gray-300 focus-visible:ring-[#393CA0]" />
                  {errors.lastName && <p className="mt-1.5 text-sm text-red-700">{errors.lastName}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="company">Company or organization</Label>
                  <Input id="company" autoComplete="organization" value={values.company} onChange={(event) => updateValue("company", event.target.value)} maxLength={160} aria-invalid={Boolean(errors.company)} className="mt-2 h-12 border-gray-300 focus-visible:ring-[#393CA0]" />
                  {errors.company && <p className="mt-1.5 text-sm text-red-700">{errors.company}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(event) => updateValue("email", event.target.value)} maxLength={255} aria-invalid={Boolean(errors.email)} className="mt-2 h-12 border-gray-300 focus-visible:ring-[#393CA0]" />
                  {errors.email && <p className="mt-1.5 text-sm text-red-700">{errors.email}</p>}
                </div>
                <div>
                  <Label>Number of employees</Label>
                  <Select value={values.employeeCount} onValueChange={(value) => updateValue("employeeCount", value)}>
                    <SelectTrigger className="mt-2 h-12"><SelectValue placeholder="Select one" /></SelectTrigger>
                    <SelectContent>{teamSizes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.employeeCount && <p className="mt-1.5 text-sm text-red-700">{errors.employeeCount}</p>}
                </div>
                <div>
                  <Label>Industry</Label>
                  <Select value={values.industry} onValueChange={(value) => updateValue("industry", value)}>
                    <SelectTrigger className="mt-2 h-12"><SelectValue placeholder="Select one" /></SelectTrigger>
                    <SelectContent>{industries.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.industry && <p className="mt-1.5 text-sm text-red-700">{errors.industry}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label>How did you hear about us?</Label>
                  <Select value={values.referralSource} onValueChange={(value) => updateValue("referralSource", value)}>
                    <SelectTrigger className="mt-2 h-12"><SelectValue placeholder="Select one" /></SelectTrigger>
                    <SelectContent>{referralSources.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.referralSource && <p className="mt-1.5 text-sm text-red-700">{errors.referralSource}</p>}
                </div>
                {status === "error" && (
                  <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">
                    We couldn't save your details. Please try again in a moment.
                  </p>
                )}
                <Button type="submit" size="lg" disabled={status === "submitting"} className="h-12 w-full bg-[#393CA0] text-base text-white hover:bg-[#2e3180] sm:col-span-2">
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Saving your details…
                    </>
                  ) : (
                    <>
                      Get the Slides
                      <ArrowRight aria-hidden="true" />
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-gray-500 sm:col-span-2">
                  Limited to one download per email. We'll also send occasional Limitless Lab updates.
                </p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
