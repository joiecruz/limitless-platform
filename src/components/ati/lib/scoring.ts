import { PILLARS, type Pillar, type Question } from "../data/questions";

export interface ScoreResult {
  overall: number;
  pillarScores: Record<Pillar, number>;
}

export function calculateScores(questions: Question[], answers: number[]): ScoreResult {
  // answers: index 0-4 → score 1-5
  let totalSum = 0;
  let totalMax = 0;
  const pillarSums: Record<string, { sum: number; count: number }> = {};

  questions.forEach((q, i) => {
    const idx = answers[i];
    if (idx === undefined || idx < 0) return;
    const score = idx + 1;
    totalSum += score;
    totalMax += 5;
    if (!pillarSums[q.pillar]) pillarSums[q.pillar] = { sum: 0, count: 0 };
    pillarSums[q.pillar].sum += score;
    pillarSums[q.pillar].count += 1;
  });

  const pillarScores = {} as Record<Pillar, number>;
  PILLARS.forEach(({ id }) => {
    const ps = pillarSums[id];
    pillarScores[id] = ps && ps.count > 0 ? Math.round((ps.sum / (ps.count * 5)) * 100) : 0;
  });

  return {
    overall: totalMax > 0 ? Math.round((totalSum / totalMax) * 100) : 0,
    pillarScores,
  };
}
