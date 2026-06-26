import { Briefcase, Building2, Landmark, GraduationCap, BookOpen, type LucideIcon } from "lucide-react";

export type PersonaId = "business_owner" | "corporate" | "public_servant" | "educator" | "student";

export interface Persona {
  id: PersonaId;
  name: string;
  description: string;
  icon: LucideIcon;
  contextLabel: string;
  contextOptions: string[];
}

export const PERSONAS: Persona[] = [
  {
    id: "business_owner",
    name: "Business Owner",
    description: "Entrepreneur, founder, MSME owner",
    icon: Briefcase,
    contextLabel: "Organization size",
    contextOptions: ["Solo/Freelancer", "Micro (2–9)", "Small (10–49)", "Medium (50–199)", "Large (200+)"],
  },
  {
    id: "corporate",
    name: "Corporate Professional",
    description: "Corporate team member or manager",
    icon: Building2,
    contextLabel: "Industry",
    contextOptions: ["Tech/Digital", "Retail/Commerce", "Finance/Banking", "Health/Wellness", "Manufacturing", "Other"],
  },
  {
    id: "public_servant",
    name: "Public Servant",
    description: "Government official or civil servant",
    icon: Landmark,
    contextLabel: "Level of government",
    contextOptions: ["National/Federal", "Regional", "Local Government (LGU)", "State-owned Enterprise"],
  },
  {
    id: "educator",
    name: "Educator",
    description: "Teacher, trainer, or academic",
    icon: GraduationCap,
    contextLabel: "Institution type",
    contextOptions: ["Basic Education (K–12)", "Higher Education", "TVET/Training Center", "NGO/Learning Program"],
  },
  {
    id: "student",
    name: "Student",
    description: "Currently studying or in training",
    icon: BookOpen,
    contextLabel: "Study level",
    contextOptions: ["Senior High School", "College/University", "Graduate/Postgrad", "Self-directed/Online"],
  },
];

export const getPersona = (id: PersonaId) => PERSONAS.find((p) => p.id === id)!;
