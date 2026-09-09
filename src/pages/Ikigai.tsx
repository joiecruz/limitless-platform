import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Boxes,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  ContactRound,
  LayoutDashboard,
  Loader2,
  PackageSearch,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WandSparkles,
} from "lucide-react";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const waitlistSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name").max(80, "Keep your first name under 80 characters"),
  lastName: z.string().trim().min(1, "Enter your last name").max(80, "Keep your last name under 80 characters"),
  company: z.string().trim().min(1, "Enter your company or business name").max(160, "Keep this under 160 characters"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Keep your email under 255 characters"),
  employeeCount: z.string().min(1, "Select your team size"),
  industry: z.string().min(1, "Select your industry"),
  referralSource: z.string().min(1, "Tell us how you heard about us"),
  system: z.string().trim().min(1, "Tell us what business system you want to build").max(255, "Keep this under 255 characters"),
});

type WaitlistValues = z.infer<typeof waitlistSchema>;
type WaitlistErrors = Partial<Record<keyof WaitlistValues, string>>;

const problems = [
  "Too many disconnected tools",
  "Repetitive manual work",
  "Information scattered everywhere",
  "Systems that don’t fit your workflow",
  "Constant dependence on other people for technical help",
];

const possibilities = [
  { label: "Customer or client management system", icon: ContactRound },
  { label: "Booking and appointment platform", icon: CalendarDays },
  { label: "Sales and lead tracker", icon: LayoutDashboard },
  { label: "Inventory or order management tool", icon: PackageSearch },
  { label: "Project and task dashboard", icon: ClipboardList },
  { label: "Internal operations portal", icon: Boxes },
  { label: "Custom AI-powered business tool", icon: Bot },
];

const outcomes = [
  "A custom business system built around your workflow",
  "A live working version you can use immediately",
  "Less dependence on scattered tools and manual processes",
  "A practical understanding of AI-powered building",
  "The confidence to improve your system and create new tools",
];

const audiences = [
  "Business owners overwhelmed by manual processes",
  "Freelancers and self-employed professionals",
  "Consultants, coaches, and service providers",
  "Non-technical founders with an app or system idea",
  "Anyone who has ever thought, “I wish there were a tool for this”",
];

function Eyebrow({ children, inverse = false }: { children: ReactNode; inverse?: boolean }) {
  return (
    <p className={`mb-4 text-xs font-bold uppercase tracking-[0.18em] ${inverse ? "text-white/80" : "text-ikigai"}`}>
      {children}
    </p>
  );
}

function WaitlistButton({ className = "", inverse = false, onClick }: { className?: string; inverse?: boolean; onClick: () => void }) {
  return (
    <Button
      type="button"
      size="lg"
      onClick={onClick}
      className={`${inverse ? "bg-white text-ikigai hover:bg-ikigai-soft" : "bg-ikigai text-ikigai-foreground hover:bg-ikigai/90"} h-12 px-7 text-base shadow-sm ${className}`}
    >
      Join the Waitlist
      <ArrowRight aria-hidden="true" />
    </Button>
  );
}

export default function Ikigai() {
  const heroRef = useRef<HTMLElement>(null);
  const formSectionRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [heroEmail, setHeroEmail] = useState("");
  const [values, setValues] = useState<WaitlistValues>({ firstName: "", lastName: "", company: "", email: "", employeeCount: "", industry: "", referralSource: "", system: "" });
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "duplicate" | "error">("idle");

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const formSection = formSectionRef.current;
    if (!formSection) return;
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(formSection);
    return () => observer.disconnect();
  }, []);

  const updateValue = (field: keyof WaitlistValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  const openWaitlist = (email = "") => {
    const normalizedEmail = email.trim();
    if (normalizedEmail) updateValue("email", normalizedEmail);
    setDialogOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = waitlistSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: WaitlistErrors = {};
      parsed.error.errors.forEach((error) => {
        const field = error.path[0] as keyof WaitlistValues | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = error.message;
      });
      setErrors(nextErrors);
      setStatus("idle");
      const firstInvalid = Object.keys(nextErrors)[0];
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
      return;
    }

    setStatus("submitting");
    const { error } = await supabase.from("ikigai_waitlist").insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      full_name: `${parsed.data.firstName} ${parsed.data.lastName}`,
      email: parsed.data.email.toLowerCase(),
      company_name: parsed.data.company,
      business_or_profession: parsed.data.company,
      employee_count: parsed.data.employeeCount,
      industry: parsed.data.industry,
      referral_source: parsed.data.referralSource,
      system_to_build: parsed.data.system,
    });

    if (!error) {
      setStatus("success");
      return;
    }
    setStatus(error.code === "23505" ? "duplicate" : "error");
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-ikigai-paper text-ikigai-ink">
      <Helmet>
        <title>IKIGAI Vibe Coding Bootcamp | Build Your Business System in 2 Days</title>
        <meta name="description" content="A two-day hands-on bootcamp by Limitless Lab for non-technical business owners. Use AI to build and launch a custom business system—no coding experience required." />
        <link rel="canonical" href="https://limitlesslab.org/ikigai" />
        <meta property="og:title" content="IKIGAI Vibe Coding Bootcamp | Build Your Business System in 2 Days" />
        <meta property="og:description" content="A two-day hands-on bootcamp by Limitless Lab for non-technical business owners. Use AI to build and launch a custom business system—no coding experience required." />
        <meta property="og:url" content="https://limitlesslab.org/ikigai" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Limitless Lab" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="IKIGAI Vibe Coding Bootcamp | Build Your Business System in 2 Days" />
        <meta name="twitter:description" content="Use AI to build and launch a custom business system in two hands-on days—no coding experience required." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          name: "IKIGAI Vibe Coding Bootcamp",
          description: "A two-day hands-on bootcamp for non-technical business owners to build and launch a custom business system with AI.",
          url: "https://limitlesslab.org/ikigai",
          provider: { "@type": "Organization", name: "Limitless Lab", url: "https://limitlesslab.org" },
          timeRequired: "P2D",
          educationalLevel: "Beginner",
        })}</script>
      </Helmet>

      <div className="fixed inset-x-0 top-0 z-40 overflow-hidden border-b border-white/20 bg-ikigai py-3 text-white shadow-[0_0_24px_hsl(var(--ikigai)/0.45)]" aria-label="Bootcamp highlights">
        <div className="ikigai-marquee flex w-max items-center gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em] sm:text-sm">
          {["Build with AI", "No coding required", "Two hands-on days", "Launch your own system", "For business owners", "Build with AI", "No coding required", "Two hands-on days", "Launch your own system", "For business owners"].map((item, index) => <span key={`${item}-${index}`} className="flex items-center gap-8"><span>{item}</span><Sparkles className="h-4 w-4" aria-hidden="true" /></span>)}
        </div>
      </div>
      <main>
        <section ref={heroRef} className="relative flex min-h-[720px] items-center pb-20 pt-28 sm:min-h-[760px] sm:pt-32" aria-labelledby="ikigai-title">
          <div className="mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="ikigai-reveal mx-auto">
              <Eyebrow>IKIGAI VIBE CODING BOOTCAMP<br /><span className="font-medium normal-case tracking-normal text-gray-500">By Limitless Lab</span></Eyebrow>
              <h1 id="ikigai-title" className="mx-auto max-w-4xl text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-8xl">
                Take control of your business.
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-2xl font-semibold leading-tight text-ikigai sm:text-3xl">
                Create your own business system—in just 2 days.
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                No coding experience needed. Bring your business challenge and leave with a custom, working system that is live and ready to use.
              </p>
              <form className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); openWaitlist(heroEmail); }}>
                <Label htmlFor="hero-email" className="sr-only">Email address</Label>
                <Input id="hero-email" type="email" inputMode="email" autoComplete="email" required placeholder="Enter your email address" value={heroEmail} onChange={(event) => setHeroEmail(event.target.value)} className="h-14 flex-1 border-gray-300 bg-white px-5 text-base focus-visible:ring-ikigai" />
                <Button type="submit" size="lg" className="h-14 bg-ikigai px-8 text-base text-white shadow-[0_0_20px_hsl(var(--ikigai)/0.3)] hover:bg-ikigai/90">Join the Waitlist <ArrowRight aria-hidden="true" /></Button>
              </form>
              <div>
                <p className="mt-3 text-sm text-gray-500">Be the first to know when enrollment opens.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28" aria-labelledby="problem-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Eyebrow>DOES THIS SOUND FAMILIAR?</Eyebrow>
              <h2 id="problem-heading" className="text-4xl font-bold leading-tight sm:text-5xl">Your business shouldn’t feel this complicated.</h2>
              <div className="mt-7 space-y-5 text-lg leading-8 text-gray-600">
                <p>You’re running your business through spreadsheets, chat threads, paper forms, and disconnected apps.</p>
                <p>Customer details are scattered. Tasks are followed up manually. Important information lives in different places. And the software you pay for never quite works the way your business does.</p>
                <p>You know there must be a better way—but building your own system feels too technical, expensive, or out of reach.</p>
              </div>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              {problems.map((problem, index) => (
                <article key={problem} className={`relative min-h-40 border border-gray-300 ${index % 2 ? "bg-ikigai-soft" : "bg-white"} p-5 shadow-[4px_4px_0_hsl(var(--ikigai))] ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}>
                  <div className="mb-7 flex gap-1.5" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-ikigai" /><span className="h-2 w-2 rounded-full bg-gray-300" /><span className="h-2 w-2 rounded-full bg-gray-300" /></div>
                  <h3 className="text-xl font-semibold leading-snug">{problem}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ikigai-soft py-20 sm:py-28" aria-labelledby="agitate-heading">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <h2 id="agitate-heading" className="text-4xl font-bold leading-tight sm:text-5xl">The longer you work around broken processes, the harder it becomes to grow.</h2>
            <div className="mx-auto mt-8 max-w-3xl space-y-5 text-lg leading-8 text-gray-700">
              <p>You spend hours repeating tasks that should be automated.</p>
              <p>Things fall through the cracks. Your team depends on you for every answer. You subscribe to more tools, but your business only becomes more complicated.</p>
              <p>Instead of focusing on your customers and growing your business, you spend your time holding everything together.</p>
            </div>
            <p className="mx-auto mt-12 max-w-4xl border-y-2 border-ikigai py-8 text-2xl font-bold leading-snug text-ikigai sm:text-3xl">
              Your business doesn’t need another generic app. It needs a system designed around how you actually work.
            </p>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28" aria-labelledby="solution-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
              <div>
                <Eyebrow>A BETTER WAY TO BUILD</Eyebrow>
                <h2 id="solution-heading" className="text-4xl font-bold leading-tight sm:text-5xl">Now, you can build it yourself—with AI.</h2>
                <div className="mt-7 space-y-5 text-lg leading-8 text-gray-600">
                  <p>IKIGAI Vibe Coding Bootcamp is a hands-on, two-day experience for non-technical business owners and self-employed professionals.</p>
                  <p>You’ll learn how to use AI-powered tools to turn your ideas and workflows into a custom business system—without needing to become a programmer.</p>
                  <p>By the end of the bootcamp, you’ll have a working system that is live, usable, and designed for your business.</p>
                </div>
                <div className="mt-8"><WaitlistButton onClick={() => openWaitlist()} /></div>
              </div>
              <div className="border border-gray-200 bg-ikigai-paper p-6 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Before</p>
                    {['Messy processes', 'Too many tools', 'Manual work'].map((item) => <p key={item} className="mb-2 border border-gray-200 bg-white px-4 py-3 font-medium">{item}</p>)}
                  </div>
                  <ArrowRight className="hidden h-8 w-8 text-ikigai sm:block" aria-hidden="true" />
                  <ArrowDown className="mx-auto h-8 w-8 text-ikigai sm:hidden" aria-hidden="true" />
                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-ikigai">After</p>
                    {['One custom system', 'Clear workflows', 'More control'].map((item) => <p key={item} className="mb-2 border border-ikigai bg-ikigai-soft px-4 py-3 font-semibold text-ikigai">{item}</p>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28" aria-labelledby="possibilities-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 id="possibilities-heading" className="text-4xl font-bold sm:text-5xl">What could you create?</h2>
              <p className="mt-4 text-xl text-gray-600">Build the tool your business actually needs.</p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {possibilities.map(({ label, icon: Icon }, index) => (
                <article key={label} className={`border border-gray-200 bg-white p-6 ${index === possibilities.length - 1 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
                  <span className="mb-8 flex h-11 w-11 items-center justify-center border border-ikigai bg-ikigai-soft text-ikigai"><Icon aria-hidden="true" /></span>
                  <h3 className="text-lg font-semibold leading-snug">{label}</h3>
                </article>
              ))}
            </div>
            <p className="mt-10 text-center text-xl font-semibold">You bring the business problem. <span className="text-ikigai">We’ll guide you in building the solution.</span></p>
          </div>
        </section>

        <section className="bg-ikigai-ink py-20 text-white sm:py-28" aria-labelledby="experience-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Eyebrow inverse>HOW IT WORKS</Eyebrow>
            <h2 id="experience-heading" className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">From idea to live system in two days.</h2>
            <div className="relative mt-14 grid gap-8 lg:grid-cols-2">
              <div className="absolute left-1/2 top-8 hidden h-px w-[calc(50%-4rem)] -translate-x-1/2 bg-ikigai lg:block" aria-hidden="true" />
              {[
                { day: 'Day 1', title: 'Design and Build', copy: 'Identify your biggest business bottleneck, map your ideal workflow, define the essential features, and build your first working version with AI.' },
                { day: 'Day 2', title: 'Improve and Launch', copy: 'Add your data, refine the experience, test how everything works, and prepare your system for real-world use.' },
              ].map(({ day, title, copy }) => (
                <article key={day} className="relative border border-white/20 bg-white/5 p-7 sm:p-9">
                  <span className="mb-8 inline-flex h-12 items-center bg-ikigai px-5 font-bold">{day}</span>
                  <h3 className="text-3xl font-bold">{title}</h3>
                  <p className="mt-5 text-lg leading-8 text-white/70">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28" aria-labelledby="outcomes-heading">
          <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 id="outcomes-heading" className="text-4xl font-bold leading-tight sm:text-5xl">You won’t just learn. You’ll build.</h2>
              <ul className="mt-9 space-y-5">
                {outcomes.map((outcome) => <li key={outcome} className="flex gap-4 text-lg"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center bg-ikigai text-white"><Check className="h-4 w-4" aria-hidden="true" /></span><span>{outcome}</span></li>)}
              </ul>
            </div>
            <div className="flex items-center border-l-4 border-ikigai bg-ikigai-soft p-8 sm:p-10">
              <p className="text-2xl font-bold leading-snug sm:text-3xl">This isn’t a bootcamp where you simply watch someone else build. You will create something your business can actually use.</p>
            </div>
          </div>
        </section>

        <section className="pb-20 sm:pb-28" aria-labelledby="guarantee-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="bg-ikigai p-7 text-white sm:p-12 lg:p-16">
              <ShieldCheck className="mb-7 h-14 w-14" aria-hidden="true" />
              <Eyebrow inverse>OUR BUILD-IT-LIVE GUARANTEE</Eyebrow>
              <h2 id="guarantee-heading" className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Build your system live—or get your money back.</h2>
              <p className="mt-7 max-w-4xl text-lg leading-8 text-white/90">Attend both days, complete the guided activities, and work with our facilitators. If you still don’t have a functional first version of your business system live by the end of the bootcamp, you may request a full refund.</p>
              <p className="mt-8 max-w-4xl border-t border-white/30 pt-6 text-sm leading-6 text-white/75">The guarantee applies to participants who attend the complete two-day program, complete the required build activities, and request facilitator support when needed. “Live” means a functional first version of the agreed bootcamp project that has been deployed and can be accessed online. Refund requests must be submitted within seven days after the bootcamp.</p>
            </div>
          </div>
        </section>

        <section className="bg-ikigai-soft py-20 sm:py-28" aria-labelledby="audience-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <h2 id="audience-heading" className="text-4xl font-bold leading-tight sm:text-5xl">Built for non-tech people with real business problems.</h2>
                <p className="mt-7 inline-block bg-ikigai px-5 py-3 text-xl font-bold text-white">No coding background required.</p>
                <p className="mt-5 text-lg leading-8 text-gray-600">Just bring your laptop, your business challenge, and your willingness to create.</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {audiences.map((audience) => <li key={audience} className="flex min-h-28 items-start gap-3 border border-ikigai/20 bg-white p-5"><UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-ikigai" aria-hidden="true" /><span className="font-semibold leading-6">{audience}</span></li>)}
              </ul>
            </div>
          </div>
        </section>

        <section ref={formSectionRef} id="ikigai-waitlist" className="scroll-mt-16 bg-ikigai py-20 text-center text-white sm:py-28" aria-labelledby="waitlist-heading">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div>
              <Sparkles className="mb-7 h-11 w-11" aria-hidden="true" />
              <h2 id="waitlist-heading" className="text-4xl font-bold leading-tight sm:text-5xl">Stop adjusting your business to fit generic software.</h2>
              <p className="mt-6 text-2xl font-semibold leading-tight">Build a system that fits your business.</p>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85">Join the waitlist to receive first access, bootcamp updates, and an exclusive founding cohort offer.</p>
              <WaitlistButton inverse onClick={() => openWaitlist()} className="mt-9" />
            </div>
          </div>
        </section>
      </main>

      <Footer ikigaiBranding />

      {!heroVisible && !formVisible && status !== "success" && status !== "duplicate" && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ikigai/20 bg-white/95 p-3 shadow-lg backdrop-blur md:hidden">
          <WaitlistButton className="w-full" onClick={() => openWaitlist()} />
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-lg border-gray-200 p-6 sm:p-10">
          {status === "success" || status === "duplicate" ? (
            <div role="status" aria-live="polite" className="flex min-h-[360px] flex-col justify-center text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-ikigai" aria-hidden="true" />
              <DialogTitle className="mt-6 text-3xl">{status === "success" ? "You’re on the list!" : "You’re already on the list!"}</DialogTitle>
              <DialogDescription className="mx-auto mt-5 max-w-lg text-lg leading-8">We’ll let you know as soon as enrollment for the IKIGAI Vibe Coding Bootcamp opens. Get ready to build a better way to run your business.</DialogDescription>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Join the waitlist</DialogTitle>
                <DialogDescription className="text-base">Tell us a bit about your business—we’ll let you know as soon as you’re in.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"} className="mt-4 grid gap-5 sm:grid-cols-2">
                {([['firstName', 'First name', 'given-name'], ['lastName', 'Last name', 'family-name']] as const).map(([field, label, autoComplete]) => <div key={field}><Label htmlFor={field}>{label}</Label><Input id={field} autoComplete={autoComplete} value={values[field]} onChange={(event) => updateValue(field, event.target.value)} maxLength={80} aria-invalid={Boolean(errors[field])} className="mt-2 h-12 border-gray-300 focus-visible:ring-ikigai" />{errors[field] && <p className="mt-1.5 text-sm text-red-700">{errors[field]}</p>}</div>)}
                <div className="sm:col-span-2"><Label htmlFor="company">Company or business name</Label><Input id="company" autoComplete="organization" value={values.company} onChange={(event) => updateValue('company', event.target.value)} maxLength={160} aria-invalid={Boolean(errors.company)} className="mt-2 h-12 border-gray-300 focus-visible:ring-ikigai" />{errors.company && <p className="mt-1.5 text-sm text-red-700">{errors.company}</p>}</div>
                <div className="sm:col-span-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(event) => updateValue('email', event.target.value)} maxLength={255} aria-invalid={Boolean(errors.email)} className="mt-2 h-12 border-gray-300 focus-visible:ring-ikigai" />{errors.email && <p className="mt-1.5 text-sm text-red-700">{errors.email}</p>}</div>
                <div><Label>Number of employees</Label><Select value={values.employeeCount} onValueChange={(value) => updateValue('employeeCount', value)}><SelectTrigger className="mt-2 h-12"><SelectValue placeholder="Select one" /></SelectTrigger><SelectContent>{['Just me', '2–10', '11–50', '51–200', '201+'].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>{errors.employeeCount && <p className="mt-1.5 text-sm text-red-700">{errors.employeeCount}</p>}</div>
                <div><Label>Industry</Label><Select value={values.industry} onValueChange={(value) => updateValue('industry', value)}><SelectTrigger className="mt-2 h-12"><SelectValue placeholder="Select one" /></SelectTrigger><SelectContent>{['Professional services', 'Education', 'Retail & e-commerce', 'Hospitality', 'Health & wellness', 'Creative industries', 'Technology', 'Other'].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>{errors.industry && <p className="mt-1.5 text-sm text-red-700">{errors.industry}</p>}</div>
                <div className="sm:col-span-2"><Label>How did you hear about us?</Label><Select value={values.referralSource} onValueChange={(value) => updateValue('referralSource', value)}><SelectTrigger className="mt-2 h-12"><SelectValue placeholder="Select one" /></SelectTrigger><SelectContent>{['Social media', 'Search engine', 'Friend or colleague', 'Limitless Lab event', 'Email newsletter', 'Other'].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>{errors.referralSource && <p className="mt-1.5 text-sm text-red-700">{errors.referralSource}</p>}</div>
                <div className="sm:col-span-2"><Label htmlFor="system">What business system would you like to build?</Label><Textarea id="system" value={values.system} onChange={(event) => updateValue('system', event.target.value)} maxLength={1000} rows={3} aria-invalid={Boolean(errors.system)} className="mt-2 min-h-24 resize-y border-gray-300 focus-visible:ring-ikigai" />{errors.system && <p className="mt-1.5 text-sm text-red-700">{errors.system}</p>}</div>
                {status === "error" && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">We couldn’t save your details. Please try again in a moment.</p>}
                <Button type="submit" size="lg" disabled={status === "submitting"} className="h-13 w-full bg-ikigai text-base text-white hover:bg-ikigai/90 sm:col-span-2">{status === "submitting" ? <><Loader2 className="animate-spin" aria-hidden="true" />Joining…</> : <>Join the IKIGAI Waitlist <ArrowRight aria-hidden="true" /></>}</Button>
                <p className="text-center text-sm text-gray-500 sm:col-span-2">Limited slots will be available for the first cohort.</p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}