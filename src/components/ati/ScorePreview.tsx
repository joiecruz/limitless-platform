import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm, type LeadFormValues } from "./LeadCaptureForm";
import { PillarBar } from "./PillarBar";
import { PILLARS, type Pillar } from "./data/questions";
import { getLevel, LEVEL_DESCRIPTIONS } from "./data/levels";
import { getPersona, type PersonaId } from "./data/personas";

interface ScorePreviewProps {
  persona: PersonaId;
  overall: number;
  pillarScores: Record<Pillar, number>;
  onSubmit: (values: LeadFormValues) => Promise<void>;
  submitting: boolean;
}

export function ScorePreview({ persona, overall, pillarScores, onSubmit, submitting }: ScorePreviewProps) {
  const [showForm, setShowForm] = useState(false);
  const level = getLevel(overall);
  const personaData = getPersona(persona);
  const description = LEVEL_DESCRIPTIONS[persona][level];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Hero */}
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Your AI Transformation Index
        </p>
        <div
          className="text-7xl sm:text-8xl font-bold text-[#393CA0] leading-none mb-3"
          style={{ fontFamily: '"Times New Roman MT Condensed Bold", "Times New Roman", Times, serif' }}
        >
          {overall}
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#393CA0]/10 text-[#393CA0] font-semibold mb-4">
          {level}
        </div>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">{description}</p>
      </div>

      {/* Locked preview */}
      <div className="relative mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-5">Your full breakdown is ready</h3>
          <div className="space-y-4 filter blur-sm pointer-events-none select-none" aria-hidden>
            {PILLARS.map((p) => (
              <PillarBar key={p.id} pillar={p.id} score={pillarScores[p.id]} />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 via-white/40 to-white/95 flex items-end justify-center pb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#393CA0] text-white mb-3">
              <Lock className="h-5 w-5" />
            </div>
            <p className="text-gray-800 font-semibold mb-4">Unlock your personalized roadmap</p>
            {!showForm && (
              <Button
                size="lg"
                onClick={() => setShowForm(true)}
                className="bg-[#393CA0] hover:bg-[#393CA0]/90"
              >
                Unlock my full results <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Where should we send your full results?</h3>
          <p className="text-sm text-gray-600 mb-5">
            We'll show your pillar breakdown and top 3 recommendations for <span className="font-semibold text-[#393CA0]">{personaData.name}</span>.
          </p>
          <LeadCaptureForm onSubmit={onSubmit} submitting={submitting} />
        </div>
      )}
    </div>
  );
}
