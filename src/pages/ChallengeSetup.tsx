
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ChallengeSetup() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [challengeStatement, setChallengeStatement] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("projects")
        .update({
          challenge_statement: challengeStatement,
          challenge_description: challengeDescription,
        })
        .eq("id", projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Challenge details saved successfully",
      });

      navigate("/dashboard/projects");
    } catch (error: any) {
      console.error("Error saving challenge:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save challenge details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Define Your Challenge</h1>
        <p className="mt-2 text-muted-foreground">
          Start by defining your challenge statement and providing additional context.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="statement" className="block font-medium">
              Challenge Statement
            </label>
            <Input
              id="statement"
              placeholder="How might we..."
              value={challengeStatement}
              onChange={(e) => setChallengeStatement(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block font-medium">
              Challenge Description
            </label>
            <Textarea
              id="description"
              placeholder="Provide more context about the challenge..."
              value={challengeDescription}
              onChange={(e) => setChallengeDescription(e.target.value)}
              required
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/projects")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Challenge"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
