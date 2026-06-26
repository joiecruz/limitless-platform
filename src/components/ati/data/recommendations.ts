import type { PersonaId } from "./personas";
import type { Pillar } from "./questions";

export const RECOMMENDATIONS: Record<PersonaId, Record<Pillar, string>> = {
  business_owner: {
    strategy: "Write a one-page AI plan: list the top 3 outcomes you want (more leads, faster ops, better service) and one AI experiment per outcome.",
    people: "Invest 2 hours/week learning one AI tool deeply (e.g. ChatGPT, Claude, or Gemini). Compound knowledge beats scattered exposure.",
    operations: "Pick your most repetitive task this week and rebuild it with AI — invoicing, content drafting, lead replies, or scheduling.",
    data: "Centralize your customer and sales data in one place (even a spreadsheet) so AI tools have something to work from.",
    technology: "Choose one AI-native stack (e.g. for marketing or sales) and go deep before adding more tools.",
    impact: "Define 1–2 metrics (e.g. hours saved, leads added, revenue from AI campaigns) and track them monthly.",
  },
  corporate: {
    strategy: "Co-create a 90-day AI roadmap with your team — 2 quick wins, 1 ambitious bet, owned by named people.",
    people: "Run a team-wide AI capability sprint: shared tools, shared prompts, shared wins.",
    operations: "Map one core workflow and redesign it with AI in the loop — measure cycle time before and after.",
    data: "Audit data access for your top use cases and remove the biggest friction (permissions, formats, quality).",
    technology: "Standardize on a small set of enterprise-safe AI tools so you can scale practices, not just experiments.",
    impact: "Tie AI initiatives to one P&L or customer KPI; share results quarterly with leadership.",
  },
  public_servant: {
    strategy: "Publish a short, plain-language statement of how your agency will (and won't) use AI.",
    people: "Run an AI literacy program for staff — focus on responsible use, not just tools.",
    operations: "Identify one citizen-facing service where AI can reduce wait time or paperwork; pilot it.",
    data: "Strengthen data governance: classification, access, and quality. Citizen trust depends on it.",
    technology: "Adopt secure, well-governed AI tools sanctioned for public-sector use.",
    impact: "Measure citizen outcomes (time saved, satisfaction, access) — not just internal efficiency.",
  },
  educator: {
    strategy: "Draft a simple classroom AI policy: what's encouraged, what's off-limits, and why.",
    people: "Teach AI skills explicitly — prompting, evaluating, citing — as part of your subject.",
    operations: "Use AI for lesson planning, differentiation, and feedback to reclaim time for human teaching.",
    data: "Track learner progress data and use AI to spot patterns you'd otherwise miss.",
    technology: "Pick 2–3 AI tools that fit your subject and master them before expanding.",
    impact: "Document one classroom AI experiment per term and share what you learned.",
  },
  student: {
    strategy: "Decide what kind of learner you want to be with AI — assistant, tutor, or thinking partner — and use it intentionally.",
    people: "Build a daily AI habit: 1 question, 1 tool, 1 reflection. Skill compounds fast.",
    operations: "Use AI to plan your week, break down assignments, and outline before writing.",
    data: "Keep a notes vault (Notion, Obsidian, Docs) AI can search to make your study sessions stronger.",
    technology: "Try one new AI tool each month and keep the ones that genuinely help you learn.",
    impact: "Reflect monthly: where did AI make my thinking better, and where did it weaken it?",
  },
};
