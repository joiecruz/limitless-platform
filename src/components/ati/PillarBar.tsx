import type { Pillar } from "./data/questions";
import { PILLARS } from "./data/questions";

interface PillarBarProps {
  pillar: Pillar;
  score: number;
}

export function PillarBar({ pillar, score }: PillarBarProps) {
  const label = PILLARS.find((p) => p.id === pillar)?.label ?? pillar;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <span className="text-sm font-bold text-[#393CA0]">{score}</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#393CA0] to-[#66E6F5] transition-all duration-700"
          style={{ width: `${Math.max(score, 2)}%` }}
        />
      </div>
    </div>
  );
}
