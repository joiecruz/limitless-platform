import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AINav } from "@/components/ai-homepage/AINav";
import { Footer } from "@/components/site-config/Footer";
import { PersonaIntake } from "@/components/ati/PersonaIntake";
import { AssessmentQuestions } from "@/components/ati/AssessmentQuestions";
import { ScorePreview } from "@/components/ati/ScorePreview";
import { FullResults } from "@/components/ati/FullResults";
import { getQuestionsFor, type Pillar } from "@/components/ati/data/questions";
import type { PersonaId } from "@/components/ati/data/personas";
import { calculateScores } from "@/components/ati/lib/scoring";
import type { LeadFormValues } from "@/components/ati/LeadCaptureForm";

type Screen = "persona" | "questions" | "preview" | "results";

export default function ATI() {
  const { toast } = useToast();
  const [screen, setScreen] = useState<Screen>("persona");
  const [persona, setPersona] = useState<PersonaId | null>(null);
  const [context, setContext] = useState<string>("");
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const questions = useMemo(() => (persona ? getQuestionsFor(persona) : []), [persona]);
  const scores = useMemo(
    () =>
      persona && answers.length === questions.length
        ? calculateScores(questions, answers)
        : { overall: 0, pillarScores: {} as Record<Pillar, number> },
    [persona, questions, answers]
  );

  const handleBegin = (p: PersonaId, c: string) => {
    setPersona(p);
    setContext(c);
    setAnswers(Array(getQuestionsFor(p).length).fill(-1));
    setScreen("questions");
  };

  const handleComplete = (finalAnswers: number[]) => {
    setAnswers(finalAnswers);
    setScreen("preview");
  };

  const handleSubmitLead = async (values: LeadFormValues) => {
    if (!persona) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("ati_leads").insert({
        first_name: values.firstName,
        email: values.email,
        organization: values.organization,
        referral_source: values.referralSource || null,
        persona,
        context,
        answers,
        overall_score: scores.overall,
        pillar_scores: scores.pillarScores,
      });
      if (error) throw error;
      setScreen("results");
    } catch (err) {
      console.error("ATI lead submit failed", err);
      toast({
        title: "Something went wrong",
        description: "We couldn't save your results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setPersona(null);
    setContext("");
    setAnswers([]);
    setScreen("persona");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Helmet>
        <title>AI Transformation Index — Free Assessment | Limitless Lab</title>
        <meta
          name="description"
          content="Take Limitless Lab's free AI Transformation Index assessment. Get your AI maturity score across six pillars and a personalized roadmap in 5 minutes."
        />
        <link rel="canonical" href="https://limitlesslab.org/ati" />
        <meta property="og:title" content="AI Transformation Index — Free Assessment | Limitless Lab" />
        <meta
          property="og:description"
          content="Discover your AI maturity across six pillars and get a personalized roadmap from Limitless Lab."
        />
        <meta property="og:url" content="https://limitlesslab.org/ati" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <AINav />

      <main className="pt-24">
        {screen === "persona" && <PersonaIntake onBegin={handleBegin} />}
        {screen === "questions" && persona && (
          <AssessmentQuestions
            questions={questions}
            initialAnswers={answers}
            onComplete={handleComplete}
            onBackToStart={() => setScreen("persona")}
          />
        )}
        {screen === "preview" && persona && (
          <ScorePreview
            persona={persona}
            overall={scores.overall}
            pillarScores={scores.pillarScores}
            onSubmit={handleSubmitLead}
            submitting={submitting}
          />
        )}
        {screen === "results" && persona && (
          <FullResults
            persona={persona}
            context={context}
            overall={scores.overall}
            pillarScores={scores.pillarScores}
            onRetake={handleRetake}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
