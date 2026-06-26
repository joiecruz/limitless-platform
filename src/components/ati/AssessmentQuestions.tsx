import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PILLARS, type Question } from "./data/questions";

interface AssessmentQuestionsProps {
  questions: Question[];
  initialAnswers?: number[];
  onComplete: (answers: number[]) => void;
  onBackToStart: () => void;
}

export function AssessmentQuestions({ questions, initialAnswers, onComplete, onBackToStart }: AssessmentQuestionsProps) {
  const [answers, setAnswers] = useState<number[]>(initialAnswers ?? Array(questions.length).fill(-1));
  const [current, setCurrent] = useState(0);

  const total = questions.length;
  const q = questions[current];
  const progress = ((current + (answers[current] >= 0 ? 1 : 0)) / total) * 100;

  // Pillars completed = pillars whose all questions have an answer
  const completedPillars = new Set<string>();
  PILLARS.forEach(({ id }) => {
    const idxs = questions.map((qq, i) => (qq.pillar === id ? i : -1)).filter((i) => i >= 0);
    if (idxs.length > 0 && idxs.every((i) => answers[i] >= 0)) completedPillars.add(id);
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  const handlePick = (optionIdx: number) => {
    const next = [...answers];
    next[current] = optionIdx;
    setAnswers(next);
    setTimeout(() => {
      if (current < total - 1) setCurrent(current + 1);
      else onComplete(next);
    }, 250);
  };

  const goBack = () => {
    if (current === 0) onBackToStart();
    else setCurrent(current - 1);
  };

  const goNext = () => {
    if (answers[current] < 0) return;
    if (current < total - 1) setCurrent(current + 1);
    else onComplete(answers);
  };

  const pillarLabel = PILLARS.find((p) => p.id === q.pillar)?.label ?? "";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Question {current + 1} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#393CA0] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Pillar tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PILLARS.map((p) => {
          const isActive = p.id === q.pillar;
          const isDone = completedPillars.has(p.id);
          return (
            <span
              key={p.id}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                isActive
                  ? "bg-[#393CA0] text-white border-[#393CA0]"
                  : isDone
                  ? "bg-[#393CA0]/10 text-[#393CA0] border-[#393CA0]/20"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {isDone && !isActive && <Check className="h-3 w-3" />}
              {p.label}
            </span>
          );
        })}
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              q.scope === "universal"
                ? "bg-teal-100 text-teal-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {q.scope === "universal" ? "Universal" : "Your role"}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {pillarLabel}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          {q.text}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {q.options.map((opt, i) => {
          const active = answers[current] === i;
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                active
                  ? "border-[#393CA0] bg-[#393CA0]/5"
                  : "border-gray-200 bg-white hover:border-[#393CA0]/50"
              }`}
            >
              <span
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  active ? "bg-[#393CA0] text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-gray-800 pt-1.5">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button
          onClick={goNext}
          disabled={answers[current] < 0}
          className="bg-[#393CA0] hover:bg-[#393CA0]/90"
        >
          {current === total - 1 ? "See my score" : "Next"}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
