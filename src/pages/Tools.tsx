import { ToolCard } from "@/components/tools/ToolCard";
import { ToolsHeader } from "@/components/tools/ToolsHeader";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";

export interface Tool {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  price: number | null;
  downloadUrl?: string;
}

export const tools: Tool[] = [
  {
    id: "persona-worksheet",
    title: "Persona Development Worksheet",
    subtitle: "Stakeholder and Persona Mapping",
    description:
      "Create detailed personas by outlining users' goals, challenges, behaviors, and preferences, enabling you to tailor solutions to their specific needs",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    price: null,
    downloadUrl: "#",
  },
  {
    id: "smart-goals",
    title: "SMART Goals Worksheet",
    subtitle: "Evaluation and Feedback",
    description:
      "Set specific, measurable, achievable, relevant, and time-bound goals with our comprehensive SMART goals worksheet",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    price: null,
    downloadUrl: "#",
  },
  {
    id: "user-testing",
    title: "User Testing Checklist",
    subtitle: "Evaluation and Feedback",
    description:
      "Ensure thorough user testing with our comprehensive checklist covering all aspects of the testing process",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    price: 45.0,
  },
];

export default function Tools() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Tools & Resources
        </h1>
        <p className="text-muted-foreground mt-1">
          Download free worksheets and resources to supercharge your innovation process
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
