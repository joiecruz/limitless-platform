import { FormEvent, useEffect, useRef, useState } from "react";
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
  Rocket,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WandSparkles,
} from "lucide-react";
import { AINav } from "@/components/ai-homepage/AINav";
import { Footer } from "@/components/site-config/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import heroIllustration from "@/assets/ikigai-business-system.jpg";

const waitlistSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name").max(120, "Keep your name under 120 characters"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Keep your email under 255 characters"),
  business: z.string().trim().min(1, "Tell us about your business or profession").max(160, "Keep this under 160 characters"),
  system: z.string().trim().min(10, "Tell us a little more about what you want to build").max(1000, "Keep this under 1,000 characters"),
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

function Eyebrow({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return (
    <p className={`mb-4 text-xs font-bold uppercase tracking-[0.18em] ${inverse ? "text-white/80" : "text-ikigai"}`}>
      {children}
    </p>
  );
}

function WaitlistButton({ className = "", inverse = false }: { className?: string; inverse?: boolean }) {
  const scrollToForm = () => {
    const form = document.getElementById("ikigai-waitlist");
    form?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => document.getElementById("fullName")?.focus({ preventScroll: true }), 650);
  };

  return (
    <Button
      type="button"
      size="lg"
      onClick={scrollToForm}
      className={`${inverse ? "bg-white text-ikigai hover:bg-ikigai-soft" : "bg-ikigai text-ikigai-foreground hover:bg-ikigai/90"} h-12 px-7 text-base shadow-sm ${className}`}
    >
      Join the Waitlist
      <ArrowRight aria-hidden="true" />
    </Button>
  );
}

export default function Ikigai() {
  const heroRef = useRef<HTMLElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [values, setValues] = useState<WaitlistValues>({ fullName: "", email: "", business: "", system: "" });
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "duplicate" | "error">("idle");

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0.1 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const updateValue = (field: keyof WaitlistValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") setStatus("idle");
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
      full_name: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
      business_or_profession: parsed.data.business,
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

      <AINav />
      <main>
        <section ref={heroRef} className="relative pt-28 sm:pt-32 pb-16 lg:pb-24" aria-labelledby="ikigai-title">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="ikigai-reveal">
              <Eyebrow>IKIGAI VIBE CODING BOOTCAMP<br /><span className="font-medium normal-case tracking-normal text-gray-500">By Limitless Lab</span></Eyebrow>
              <h1 id="ikigai-title" className="max-w-2xl text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
                Take control of your business.
              </h1>
              <p className="mt-6 max-w-xl text-2xl font-semibold leading-tight text-ikigai sm:text-3xl">
                Create your own business system—in just 2 days.
              </p>
              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                No coding experience needed. Bring your business challenge and leave with a custom, working system that is live and ready to use.
              </p>
              <div className="mt-8">
                <WaitlistButton />
                <p className="mt-3 text-sm text-gray-500">Be the first to know when enrollment opens.</p>
              </div>
            </div>
            <div className="relative ikigai-reveal [animation-delay:120ms]">
              <div className="absolute -left-3 top-8 h-20 w-20 rotate-6 border-2 border-ikigai/20 bg-ikigai-soft" aria-hidden="true" />
              <img
                src={heroIllustration}
                alt="A business owner transforming scattered spreadsheets, messages, and notes into one organized business dashboard"
                width={1408}
                height={1104}
                fetchPriority="high"
                className="relative w-full border border-gray-200 bg-white object-cover shadow-[10px_12px_0_hsl(var(--ikigai-soft))]"
              />
              <div className="absolute -bottom-5 right-5 -rotate-2 bg-ikigai px-5 py-3 text-sm font-bold text-white shadow-md">
                Messy → made useful
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
                <article key={problem} className={`relative min-h-40 border border-gray-300 bg-${index % 2 ? "ikigai-soft" : "white"} p-5 shadow-[4px_4px_0_hsl(var(--ikigai))] ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}>
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
                <div className="mt-8"><WaitlistButton /></div>
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

        <section id="ikigai-waitlist" className="scroll-mt-16 bg-ikigai py-20 text-white sm:py-28" aria-labelledby="waitlist-heading">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <Sparkles className="mb-7 h-11 w-11" aria-hidden="true" />
              <h2 id="waitlist-heading" className="text-4xl font-bold leading-tight sm:text-5xl">Stop adjusting your business to fit generic software.</h2>
              <p className="mt-6 text-2xl font-semibold leading-tight">Build a system that fits your business.</p>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">Join the waitlist to receive first access, bootcamp updates, and an exclusive founding cohort offer.</p>
            </div>

            <div className="bg-white p-6 text-ikigai-ink shadow-[10px_10px_0_hsl(var(--ikigai-ink))] sm:p-9">
              {status === "success" || status === "duplicate" ? (
                <div role="status" aria-live="polite" className="flex min-h-[420px] flex-col justify-center text-center">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-ikigai" aria-hidden="true" />
                  <h3 className="mt-6 text-3xl font-bold">{status === "success" ? "You’re on the list!" : "You’re already on the list!"}</h3>
                  <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-gray-600">We’ll let you know as soon as enrollment for the IKIGAI Vibe Coding Bootcamp opens. Get ready to build a better way to run your business.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"} className="space-y-5">
                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" name="fullName" autoComplete="name" value={values.fullName} onChange={(event) => updateValue("fullName", event.target.value)} maxLength={120} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} className="mt-2 h-12 border-gray-300 focus-visible:ring-ikigai" />
                    {errors.fullName && <p id="fullName-error" className="mt-1.5 text-sm text-red-700">{errors.fullName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(event) => updateValue("email", event.target.value)} maxLength={255} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className="mt-2 h-12 border-gray-300 focus-visible:ring-ikigai" />
                    {errors.email && <p id="email-error" className="mt-1.5 text-sm text-red-700">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="business">Business or profession</Label>
                    <Input id="business" name="business" autoComplete="organization" value={values.business} onChange={(event) => updateValue("business", event.target.value)} maxLength={160} aria-invalid={Boolean(errors.business)} aria-describedby={errors.business ? "business-error" : undefined} className="mt-2 h-12 border-gray-300 focus-visible:ring-ikigai" />
                    {errors.business && <p id="business-error" className="mt-1.5 text-sm text-red-700">{errors.business}</p>}
                  </div>
                  <div>
                    <Label htmlFor="system">What business system would you like to build?</Label>
                    <Textarea id="system" name="system" value={values.system} onChange={(event) => updateValue("system", event.target.value)} maxLength={1000} rows={4} aria-invalid={Boolean(errors.system)} aria-describedby={errors.system ? "system-error" : undefined} className="mt-2 min-h-28 resize-y border-gray-300 focus-visible:ring-ikigai" />
                    {errors.system && <p id="system-error" className="mt-1.5 text-sm text-red-700">{errors.system}</p>}
                  </div>
                  {status === "error" && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-800">We couldn’t save your details. Please try again in a moment.</p>}
                  <Button type="submit" size="lg" disabled={status === "submitting"} className="h-12 w-full bg-ikigai text-base text-white hover:bg-ikigai/90 focus-visible:ring-ikigai">
                    {status === "submitting" ? <><Loader2 className="animate-spin" aria-hidden="true" />Joining…</> : <><WandSparkles aria-hidden="true" />Join the IKIGAI Waitlist</>}
                  </Button>
                  <p className="text-center text-sm text-gray-500">Limited slots will be available for the first cohort.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer ikigaiBranding />

      {showSticky && status !== "success" && status !== "duplicate" && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ikigai/20 bg-white/95 p-3 shadow-lg backdrop-blur md:hidden">
          <WaitlistButton className="w-full" />
        </div>
      )}
    </div>
  );
}