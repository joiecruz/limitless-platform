import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { RichTextEditor } from "@/components/admin/blog/RichTextEditor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface LessonSection {
  id: string;
  title: string;
  content: string;
}

interface LessonSectionsEditorProps {
  sections: LessonSection[];
  onChange: (sections: LessonSection[]) => void;
  lessonId?: string;
}

export function LessonSectionsEditor({ sections, onChange, lessonId }: LessonSectionsEditorProps) {
  const [expandedSection, setExpandedSection] = useState<string | undefined>();

  const addSection = () => {
    const newSection: LessonSection = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
    };
    onChange([...sections, newSection]);
    setExpandedSection(newSection.id);
  };

  const updateSection = (id: string, field: keyof LessonSection, value: string) => {
    onChange(
      sections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const removeSection = (id: string) => {
    onChange(sections.filter((section) => section.id !== id));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    onChange(newSections);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Sections (Optional)</h3>
          <p className="text-xs text-muted-foreground">Add collapsible sections to organize lesson content</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addSection}>
          <Plus className="h-4 w-4 mr-1" />
          Add Section
        </Button>
      </div>

      {sections.length > 0 && (
        <Accordion
          type="single"
          collapsible
          value={expandedSection}
          onValueChange={setExpandedSection}
          className="space-y-2"
        >
          {sections.map((section, index) => (
            <AccordionItem key={section.id} value={section.id} className="border rounded-lg">
              <div className="flex items-center gap-2 px-4">
                <div className="flex flex-col">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                  >
                    <GripVertical className="h-3 w-3" />
                  </Button>
                </div>
                <AccordionTrigger className="flex-1 hover:no-underline">
                  <span className="text-sm font-medium">
                    {section.title || `Section ${index + 1}`}
                  </span>
                </AccordionTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection(section.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Section Title</label>
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(section.id, "title", e.target.value)}
                      placeholder="Enter section title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Section Content</label>
                    <RichTextEditor
                      value={section.content}
                      onChange={(value) => updateSection(section.id, "content", value)}
                      blogId={lessonId}
                      className="min-h-[200px]"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {sections.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              No sections added yet
            </p>
            <p className="text-xs text-muted-foreground">
              Sections are optional and help organize longer lessons into collapsible parts
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
