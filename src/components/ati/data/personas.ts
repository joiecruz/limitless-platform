import corporateAsset from "@/assets/persona-corporate.png.asset.json";
import educatorAsset from "@/assets/persona-educator.png.asset.json";
import entrepreneurAsset from "@/assets/persona-entrepreneur.png.asset.json";
import publicServantAsset from "@/assets/persona-public-servant.png.asset.json";
import studentAsset from "@/assets/persona-student.png.asset.json";

export type PersonaId = "business_owner" | "corporate" | "public_servant" | "educator" | "student";

export interface Persona {
  id: PersonaId;
  name: string;
  description: string;
  image: string;
  contextLabel: string;
  contextOptions: string[];
}

export const PERSONAS: Persona[] = [
  {
    id: "business_owner",
    name: "Business Owner",
    description: "Entrepreneur, founder, MSME owner",
    image: entrepreneurAsset.url,
    contextLabel: "Organization size",
    contextOptions: ["Solo/Freelancer", "Micro (2–9)", "Small (10–49)", "Medium (50–199)", "Large (200+)"],
  },
  {
    id: "corporate",
    name: "Corporate Professional",
    description: "Corporate team member or manager",
    image: corporateAsset.url,
    contextLabel: "Industry",
    contextOptions: ["Tech/Digital", "Retail/Commerce", "Finance/Banking", "Health/Wellness", "Manufacturing", "Other"],
  },
  {
    id: "public_servant",
    name: "Public Servant",
    description: "Government official or civil servant",
    image: publicServantAsset.url,
    contextLabel: "Level of government",
    contextOptions: ["National/Federal", "Regional", "Local Government (LGU)", "State-owned Enterprise"],
  },
  {
    id: "educator",
    name: "Educator",
    description: "Teacher, trainer, or academic",
    image: educatorAsset.url,
    contextLabel: "Institution type",
    contextOptions: ["Basic Education (K–12)", "Higher Education", "TVET/Training Center", "NGO/Learning Program"],
  },
  {
    id: "student",
    name: "Student",
    description: "Currently studying or in training",
    image: studentAsset.url,
    contextLabel: "Study level",
    contextOptions: ["Senior High School", "College/University", "Graduate/Postgrad", "Self-directed/Online"],
  },
];

export const getPersona = (id: PersonaId) => PERSONAS.find((p) => p.id === id)!;
