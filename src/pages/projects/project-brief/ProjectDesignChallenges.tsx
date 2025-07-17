import React, { useState, useEffect } from "react";
import ProjectLoading from "./ProjectLoading";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectDesignChallengesProps {
  projectData: {
    name: string;
    description: string;
    problem: string;
    customers: string;
    targetOutcomes: string;
    sdgs: string[];
    innovationTypes: string[];
  };
  onSubmit: (selectedChallenge: string) => void;
}

export default function ProjectDesignChallenges({ projectData, onSubmit }: ProjectDesignChallengesProps) {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false); // <-- new state
  const { toast } = useToast();

  useEffect(() => {
    generateDesignChallenges();
  }, []);

  const generateDesignChallenges = async () => {
    try {
      const contextInfo = [
        `Project: "${projectData.name}"`,
        `Description: "${projectData.description}"`,
        `Problem: "${projectData.problem}"`,
        `Target audience: "${projectData.customers}"`,
        `Target outcomes: "${projectData.targetOutcomes}"`,
        `SDGs: ${projectData.sdgs.join(', ')}`,
        `Innovation types: ${projectData.innovationTypes.join(', ')}`
      ].filter(Boolean).join('. ');

      const prompt = `Based on this project brief: ${contextInfo}. Generate 3 distinct "How might we..." design challenge statements that are specific to this project. Each should be actionable, inspiring, and focused on different aspects of the problem. Return them as a JSON array of strings.`;

      const { data, error } = await supabase.functions.invoke('generate-description', {
        body: { prompt }
      });
      
      if (error) throw error;
      
      // Try to parse as JSON, fallback to splitting by lines
      let generatedChallenges;
      try {
        generatedChallenges = JSON.parse(data.generatedText);
      } catch {
        generatedChallenges = data.generatedText
          .split('\n')
          .filter((line: string) => line.trim().startsWith('How might we'))
          .slice(0, 3);
      }
      
      if (Array.isArray(generatedChallenges) && generatedChallenges.length > 0) {
        setChallenges(generatedChallenges);
      } else {
        // Fallback challenges
        setChallenges([
          `How might we solve the core problem: ${projectData.problem}?`,
          `How might we better serve ${projectData.customers} in achieving ${projectData.targetOutcomes}?`,
          `How might we innovate ${projectData.name} to create meaningful impact?`
        ]);
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Using fallback challenges. Please try again.",
        variant: "destructive",
      });
      
      // Fallback challenges
      setChallenges([
        `How might we solve the core problem: ${projectData.problem}?`,
        `How might we better serve ${projectData.customers} in achieving ${projectData.targetOutcomes}?`,
        `How might we innovate ${projectData.name} to create meaningful impact?`
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      onSubmit(challenges[selected]);
      setSubmitting(false);
    }, 1200); // simulate loading, adjust as needed
  };

  if (submitting) {
    return <ProjectLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full ml-[-18px]">
      <h2 className="mt-11 text-[26px] text-gray-800 font-bold text-center mb-7">Design Challenges</h2>
      <p className="text-center text-gray-600 mb-10 max-w-xl text-[15px]">
        Based on your project brief, we recommend the following options for your overarching design challenge.<br /><br />
        Select the one that best fits your needs, and feel free to make any modifications. Once you're ready, submit to continue.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xl mb-6 items-center text-[15px]">
        {challenges.map((challenge, idx) => (
          <button
            key={idx}
            type="button"
            className={`text-left px-4 py-3 rounded-[8px] border transition-all duration-150 text-[15px] text-gray-800 font-normal focus:outline-none w-[750px] ${
              selected === idx
                ? "border-[#393CA0] bg-[#F4F4FB] shadow-sm"
                : "border-gray-200 bg-white hover:border-[#393CA0]"
            }`}
            onClick={() => setSelected(idx)}
            disabled={loading}
          >
            {challenge}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="mt-[8px] text-gray-500 text-[15px] font-sans flex items-center justify-center gap-1">
          Generating design challenges...
        </div>
      ) : (
        <button
          className="mt-[8px] bg-[#393CA0] hover:bg-[#2C2E7A] text-white font-semibold py-2 rounded-[6px] text-[15px] w-[150px] h-[40px] font-sans transition-colors flex items-center justify-center gap-1"
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}
    </div>
  );
}
