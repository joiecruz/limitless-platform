import { Button } from "@/components/ui/button";
import { Construction, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Construction className="h-16 w-16 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            🚧 Oops – You Caught Us Early!
          </h1>
          
          <p className="text-xl text-muted-foreground">
            You're ahead of the curve! Our Project Dashboard Module is currently under construction, 
            but as a valued Limitless Lab member, you'll be the first to experience it when it launches.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Sparkles className="h-5 w-5" />
            <h2>What to Expect:</h2>
          </div>
          
          <ul className="space-y-2 text-left list-disc list-inside text-muted-foreground">
            <li>A streamlined, intuitive, and AI-powered way to manage your innovation projects</li>
            <li>Tried and tested innovation workflows to increase your chances of success</li>
            <li>Collaborative tools designed to bring ideas to life faster</li>
            <li>Insights and analytics to help you measure the impact for your projects</li>
          </ul>
          
          <p className="text-sm italic">
            We're building something exciting – and you'll get exclusive early access once it's ready!
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            👉 In the meantime, why not dive into our existing modules and keep your innovation journey going strong?
          </p>

          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/dashboard/courses")}>
              Explore Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard/tools")}>
              Browse Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          Thanks for being part of our Limitless community – we can't wait to show you what's next!
        </p>
      </div>
    </div>
  );
}