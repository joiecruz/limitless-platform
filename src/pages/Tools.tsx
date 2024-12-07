import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Lock } from "lucide-react";
import { Link } from "react-router-dom";

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
    description: "Create detailed personas by outlining users' goals, challenges, behaviors, and preferences, enabling you to tailor solutions to their specific needs",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    price: null,
    downloadUrl: "#"
  },
  {
    id: "smart-goals",
    title: "SMART Goals Worksheet",
    subtitle: "Evaluation and Feedback",
    description: "Set specific, measurable, achievable, relevant, and time-bound goals with our comprehensive SMART goals worksheet",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    price: null,
    downloadUrl: "#"
  },
  {
    id: "user-testing",
    title: "User Testing Checklist",
    subtitle: "Evaluation and Feedback",
    description: "Ensure thorough user testing with our comprehensive checklist covering all aspects of the testing process",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    price: 45.00
  }
];

export default function Tools() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Tools & Resources</h1>
        <p className="mt-1 text-sm text-gray-500">
          Download free worksheets and resources to supercharge your innovation process
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.id} to={`/tools/${tool.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="aspect-video relative">
                <img
                  src={tool.imageUrl}
                  alt={tool.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-medium bg-white rounded-full">
                    {tool.price === null ? "Free" : `$${tool.price.toFixed(2)}`}
                  </span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="leading-tight">{tool.title}</CardTitle>
                <CardDescription className="text-primary-600">{tool.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">{tool.description}</p>
                <Button 
                  className="w-full"
                  variant={tool.price === null ? "default" : "secondary"}
                >
                  {tool.price === null ? (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Unlock for ${tool.price.toFixed(2)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}