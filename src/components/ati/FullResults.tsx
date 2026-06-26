import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { PillarBar } from "./PillarBar";
import { PILLARS, type Pillar } from "./data/questions";
import { getLevel, LEVEL_DESCRIPTIONS } from "./data/levels";
import { getPersona, type PersonaId } from "./data/personas";
import { RECOMMENDATIONS } from "./data/recommendations";

interface FullResultsProps {
  persona: PersonaId;
  context: string;
  overall: number;
  pillarScores: Record<Pillar, number>;
  onRetake: () => void;
}

export function FullResults({ persona, context, overall, pillarScores, onRetake }: FullResultsProps) {
  const level = getLevel(overall);
  const personaData = getPersona(persona);
  const description = LEVEL_DESCRIPTIONS[persona][level];

  // Top 3 lowest pillar scores → recommendations
  const top3 = [...PILLARS]
    .map((p) => ({ pillar: p.id, label: p.label, score: pillarScores[p.id] }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#393CA0]/10 text-[#393CA0] text-sm font-medium mb-5">
          {personaData.name} · {context}
        </div>
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Your AI Transformation Index
        </p>
        <div
          className="text-7xl sm:text-8xl font-bold text-[#393CA0] leading-none mb-3"
          style={{ fontFamily: '"Times New Roman MT Condensed Bold", "Times New Roman", Times, serif' }}
        >
          {overall}
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#393CA0] text-white font-semibold mb-4">
          {level}
        </div>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Pillar bars */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your pillar breakdown</h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {PILLARS.map((p) => (
            <PillarBar key={p.id} pillar={p.id} score={pillarScores[p.id]} />
          ))}
        </div>
      </div>

      {/* Top 3 recommendations */}
      <div className="bg-gradient-to-br from-[#393CA0] to-[#4548B8] rounded-2xl p-6 sm:p-8 text-white mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-[#66E6F5]" />
          <h2 className="text-xl font-bold">Your top 3 moves</h2>
        </div>
        <p className="text-white/80 mb-6 text-sm">
          Based on your lowest-scoring pillars — start here for the biggest lift.
        </p>
        <ol className="space-y-5">
          {top3.map((r, i) => (
            <li key={r.pillar} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#66E6F5] text-[#393CA0] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-[#66E6F5] text-sm uppercase tracking-wider mb-1">
                  {r.label} · {r.score}/100
                </p>
                <p className="text-white/95 leading-relaxed">
                  {RECOMMENDATIONS[persona][r.pillar]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          asChild
          size="lg"
          className="bg-[#393CA0] hover:bg-[#393CA0]/90"
        >
          <a href="mailto:hello@limitlesslab.org?subject=Free%20AI%20Readiness%20Consultation">
            Book a free AI Readiness Consultation <ArrowRight className="h-4 w-4 ml-1" />
          </a>
        </Button>
        <Button size="lg" variant="outline" onClick={onRetake} className="border-[#393CA0] text-[#393CA0]">
          <RotateCcw className="h-4 w-4 mr-1" /> Retake Assessment
        </Button>
      </div>
    </div>
  );
}
