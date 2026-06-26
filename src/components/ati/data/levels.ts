import type { PersonaId } from "./personas";

export type Level = "Beginner" | "Emerging" | "Developing" | "Advanced" | "Leader";

export function getLevel(score: number): Level {
  if (score <= 20) return "Beginner";
  if (score <= 40) return "Emerging";
  if (score <= 60) return "Developing";
  if (score <= 80) return "Advanced";
  return "Leader";
}

export const LEVEL_DESCRIPTIONS: Record<PersonaId, Record<Level, string>> = {
  business_owner: {
    Beginner: "You're at the very start of your AI journey — there's huge room to unlock growth with the right first steps.",
    Emerging: "You've started exploring AI for your business and are ready to make it a real growth lever.",
    Developing: "AI is helping parts of your business; with focus, it can become a true engine of growth.",
    Advanced: "AI is meaningfully shaping how you run and grow your business.",
    Leader: "You're using AI as a strategic advantage — a model for other entrepreneurs.",
  },
  corporate: {
    Beginner: "Your team is just beginning to think about AI — a focused plan can move things quickly.",
    Emerging: "You're piloting AI in pockets; the next step is connecting those pilots to real outcomes.",
    Developing: "AI is starting to scale across your work — now is the moment to embed it.",
    Advanced: "AI is part of how your team delivers value — keep widening the lens.",
    Leader: "You're an AI-mature team setting the bar inside your organization.",
  },
  public_servant: {
    Beginner: "Your agency is just starting on AI — early, structured steps can build strong public trust.",
    Emerging: "Pockets of innovation exist; aligning them will deliver clearer citizen value.",
    Developing: "AI is improving how you serve citizens; with governance, you can scale responsibly.",
    Advanced: "You're delivering meaningful citizen impact with AI in a responsible way.",
    Leader: "You're a model of human-centered, responsible AI in the public sector.",
  },
  educator: {
    Beginner: "You're starting to explore AI in education — a few intentional habits can transform your practice.",
    Emerging: "You're trying AI in your work; the next step is integrating it into how you teach.",
    Developing: "AI is supporting your teaching and learners; you can deepen the impact.",
    Advanced: "AI is enriching your classroom and learner outcomes.",
    Leader: "You're modeling what AI-empowered learning can look like.",
  },
  student: {
    Beginner: "You're new to using AI for learning — building good habits now will pay off enormously.",
    Emerging: "You've started using AI; with intention, it can sharpen your thinking and work.",
    Developing: "AI is helping your learning; you can use it as a true thinking partner.",
    Advanced: "You're a confident, capable AI-enabled learner.",
    Leader: "You're an exemplar of how to learn and create with AI.",
  },
};
