import type { PersonaId } from "./personas";

export type Pillar = "strategy" | "people" | "operations" | "data" | "technology" | "impact";

export const PILLARS: { id: Pillar; label: string }[] = [
  { id: "strategy", label: "Strategy" },
  { id: "people", label: "People" },
  { id: "operations", label: "Operations" },
  { id: "data", label: "Data" },
  { id: "technology", label: "Technology" },
  { id: "impact", label: "Impact" },
];

export interface Question {
  id: string;
  pillar: Pillar;
  scope: "universal" | "persona";
  text: string;
  options: [string, string, string, string, string];
}

// Generic 5-step maturity ladder used for most questions
const MATURITY: [string, string, string, string, string] = [
  "Not yet — we haven't started",
  "Exploring — we're learning the basics",
  "Piloting — we've tried it in small ways",
  "Embedded — it's part of how we work",
  "Leading — we set the standard for others",
];

// 16 universal questions across the 6 pillars (Strategy×3, People×3, Operations×3, Data×3, Technology×2, Impact×2)
export const UNIVERSAL_QUESTIONS: Question[] = [
  { id: "u-s1", pillar: "strategy", scope: "universal", text: "We have a clear vision for how AI fits into our goals.", options: MATURITY },
  { id: "u-s2", pillar: "strategy", scope: "universal", text: "AI priorities are tied to measurable outcomes we care about.", options: MATURITY },
  { id: "u-s3", pillar: "strategy", scope: "universal", text: "Leadership actively champions responsible AI use.", options: MATURITY },

  { id: "u-p1", pillar: "people", scope: "universal", text: "I (or my team) feel confident using AI tools day to day.", options: MATURITY },
  { id: "u-p2", pillar: "people", scope: "universal", text: "We invest time in upskilling on AI and digital tools.", options: MATURITY },
  { id: "u-p3", pillar: "people", scope: "universal", text: "There's a culture of experimentation and learning from failure.", options: MATURITY },

  { id: "u-o1", pillar: "operations", scope: "universal", text: "We've identified workflows that AI can meaningfully improve.", options: MATURITY },
  { id: "u-o2", pillar: "operations", scope: "universal", text: "AI is integrated into at least one of our regular processes.", options: MATURITY },
  { id: "u-o3", pillar: "operations", scope: "universal", text: "We have clear guidelines for when and how to use AI.", options: MATURITY },

  { id: "u-d1", pillar: "data", scope: "universal", text: "Our data is organized, accessible, and usable.", options: MATURITY },
  { id: "u-d2", pillar: "data", scope: "universal", text: "We use data to make decisions, not just intuition.", options: MATURITY },
  { id: "u-d3", pillar: "data", scope: "universal", text: "We handle data privacy and security with care.", options: MATURITY },

  { id: "u-t1", pillar: "technology", scope: "universal", text: "We use modern tools that work well together.", options: MATURITY },
  { id: "u-t2", pillar: "technology", scope: "universal", text: "We can adopt new tools quickly when they make sense.", options: MATURITY },

  { id: "u-i1", pillar: "impact", scope: "universal", text: "We can point to concrete value AI (or digital tools) has created for us.", options: MATURITY },
  { id: "u-i2", pillar: "impact", scope: "universal", text: "We consider the human and ethical impact of the tools we use.", options: MATURITY },
];

// 4 persona-specific questions per persona, one across distinct pillars
export const PERSONA_QUESTIONS: Record<PersonaId, Question[]> = {
  business_owner: [
    { id: "bo-s", pillar: "strategy", scope: "persona", text: "I have a clear plan for how AI will help my business grow.", options: MATURITY },
    { id: "bo-o", pillar: "operations", scope: "persona", text: "I use AI to automate or speed up repetitive parts of running the business.", options: MATURITY },
    { id: "bo-t", pillar: "technology", scope: "persona", text: "I'm using AI tools for marketing, sales, or customer service.", options: MATURITY },
    { id: "bo-i", pillar: "impact", scope: "persona", text: "AI has helped me save time, cut costs, or reach more customers.", options: MATURITY },
  ],
  corporate: [
    { id: "co-s", pillar: "strategy", scope: "persona", text: "My team has a defined AI roadmap aligned with the wider organization.", options: MATURITY },
    { id: "co-p", pillar: "people", scope: "persona", text: "Colleagues across functions collaborate on AI initiatives.", options: MATURITY },
    { id: "co-o", pillar: "operations", scope: "persona", text: "AI is improving how we deliver our core work or services.", options: MATURITY },
    { id: "co-i", pillar: "impact", scope: "persona", text: "We can measure the business impact of our AI initiatives.", options: MATURITY },
  ],
  public_servant: [
    { id: "ps-s", pillar: "strategy", scope: "persona", text: "Our agency has a stated approach to using AI for public service.", options: MATURITY },
    { id: "ps-o", pillar: "operations", scope: "persona", text: "AI helps us deliver services to citizens more effectively.", options: MATURITY },
    { id: "ps-d", pillar: "data", scope: "persona", text: "We use data responsibly to inform policy and programs.", options: MATURITY },
    { id: "ps-i", pillar: "impact", scope: "persona", text: "Our AI-enabled work has visibly improved outcomes for citizens.", options: MATURITY },
  ],
  educator: [
    { id: "ed-s", pillar: "strategy", scope: "persona", text: "Our institution has guidance on integrating AI into teaching and learning.", options: MATURITY },
    { id: "ed-p", pillar: "people", scope: "persona", text: "I help my learners build healthy, capable habits with AI.", options: MATURITY },
    { id: "ed-o", pillar: "operations", scope: "persona", text: "I use AI to design lessons, give feedback, or save planning time.", options: MATURITY },
    { id: "ed-i", pillar: "impact", scope: "persona", text: "AI has improved learning outcomes or engagement in my classroom.", options: MATURITY },
  ],
  student: [
    { id: "st-p", pillar: "people", scope: "persona", text: "I use AI tools to support my learning in responsible ways.", options: MATURITY },
    { id: "st-o", pillar: "operations", scope: "persona", text: "I use AI to plan, organize, or accelerate my work.", options: MATURITY },
    { id: "st-t", pillar: "technology", scope: "persona", text: "I'm comfortable trying new AI tools as they appear.", options: MATURITY },
    { id: "st-i", pillar: "impact", scope: "persona", text: "Using AI has noticeably improved the quality of my work or learning.", options: MATURITY },
  ],
};

export function getQuestionsFor(persona: PersonaId): Question[] {
  return [...UNIVERSAL_QUESTIONS, ...PERSONA_QUESTIONS[persona]];
}
