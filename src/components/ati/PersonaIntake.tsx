import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PERSONAS, type PersonaId } from "./data/personas";

interface PersonaIntakeProps {
  onBegin: (persona: PersonaId, context: string) => void;
}

export function PersonaIntake({ onBegin }: PersonaIntakeProps) {
  const [persona, setPersona] = useState<PersonaId | null>(null);
  const [context, setContext] = useState<string>("");

  const selected = persona ? PERSONAS.find((p) => p.id === persona)! : null;

  const handleSelectPersona = (id: PersonaId) => {
    if (id !== persona) {
      setPersona(id);
      setContext("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#393CA0]/10 text-[#393CA0] text-sm font-medium mb-5">
          Free Assessment · 5 mins
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          AI Transformation Index
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover your AI maturity across six pillars and get a personalized roadmap. Start by telling us who you are.
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">1. Which best describes you?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            const active = persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPersona(p.id)}
                className={`group relative text-left p-5 rounded-2xl border-2 transition-all bg-white ${
                  active
                    ? "border-[#393CA0] shadow-md"
                    : "border-gray-200 hover:border-[#393CA0]/50 hover:-translate-y-0.5"
                }`}
              >
                {active && (
                  <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#393CA0] text-white flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <span
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-colors ${
                    active ? "bg-[#393CA0] text-white" : "bg-[#393CA0]/10 text-[#393CA0]"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
            2. {selected.contextLabel}
          </h2>
          <div className="flex flex-wrap gap-2">
            {selected.contextOptions.map((opt) => {
              const active = context === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setContext(opt)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? "bg-[#393CA0] text-white border-[#393CA0]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#393CA0]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          disabled={!persona || !context}
          onClick={() => persona && context && onBegin(persona, context)}
          className="px-10 py-6 text-lg bg-[#393CA0] hover:bg-[#393CA0]/90 disabled:opacity-40"
        >
          Begin Assessment →
        </Button>
      </div>
    </div>
  );
}
