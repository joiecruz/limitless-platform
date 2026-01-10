import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SafeHTML } from "@/components/common/SafeHTML";
import { BookOpen } from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface LessonSectionsProps {
  sections: Section[];
}

const LessonSections = ({ sections }: LessonSectionsProps) => {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="mt-8 px-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Lesson Sections</h2>
      </div>
      
      <Accordion type="single" collapsible className="w-full space-y-3">
        {sections.map((section, index) => (
          <AccordionItem 
            key={section.id} 
            value={section.id}
            className="border rounded-lg bg-card shadow-sm overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-left font-medium text-foreground">
                  {section.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <div className="pt-2 border-t">
                <SafeHTML
                  html={section.content}
                  as="div"
                  className="prose prose-slate max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-pre:bg-muted prose-pre:text-foreground prose-p:whitespace-pre-wrap prose-p:mb-4 prose-li:mb-1 prose-img:rounded-lg"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default LessonSections;
