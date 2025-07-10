import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

export interface ProjectOverviewRef {
  validate: () => boolean | string;
  getValues: () => {
    name: string;
    description: string;
    problem: string;
    customers: string;
  };
  setValues: (values: {
    name: string;
    description: string;
    problem: string;
    customers: string;
  }) => void;
}

const ProjectOverview = forwardRef<ProjectOverviewRef>((props, ref) => {
  const { projectId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [problem, setProblem] = useState("");
  const [customers, setCustomers] = useState("");
  const [touched, setTouched] = useState(false);
  const [isGenerating, setIsGenerating] = useState({
    description: false,
    problem: false,
    customers: false
  });
  const { toast } = useToast();

  useImperativeHandle(ref, () => ({
    validate: () => {
      setTouched(true);
      if (
        name.trim() === "" ||
        description.trim() === "" ||
        problem.trim() === "" ||
        customers.trim() === ""
      ) return "All fields must be filled out.";
      return true;
    },
    getValues: () => ({ name, description, problem, customers }),
    setValues: (values) => {
      if (projectId) {
        console.log('[ProjectOverview] For projectId:', projectId, 'reloaded fields from database:', values);
      } else {
        console.log('[ProjectOverview] Reloaded fields from database:', values);
      }
      setName(values.name);
      setDescription(values.description);
      // If values.problem or values.customers are undefined, fallback to empty string
      setProblem(values.problem ?? '');
      setCustomers(values.customers ?? '');
    }
  }));

  const generateContent = async (field: 'description' | 'problem' | 'customers') => {
    if (!name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(prev => ({ ...prev, [field]: true }));
    
    try {
      const prompt = field === 'description' 
        ? `Generate a clear, professional project description for: "${name}". Focus on goals, objectives, and expected value. Keep it concise (2-3 sentences).`
        : field === 'problem'
        ? `Based on the project "${name}"${description ? ` with description: "${description}"` : ''}, identify and describe the main problem or opportunity this project addresses. Be specific and actionable.`
        : `Based on the project "${name}"${description ? ` with description: "${description}"` : ''}${problem ? ` addressing: "${problem}"` : ''}, identify the target customers or audience who would benefit from this project. Be specific about demographics, needs, and characteristics.`;

      const { data, error } = await supabase.functions.invoke('generate-description', {
        body: { prompt }
      });
      
      if (error) throw error;
      
      if (field === 'description') {
        setDescription(data.generatedText);
      } else if (field === 'problem') {
        setProblem(data.generatedText);
      } else {
        setCustomers(data.generatedText);
      }
      
      toast({
        title: "Content Generated",
        description: `AI has generated content for ${field}`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: `Failed to generate ${field}. Please try again or enter manually.`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="mt-1.5 bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-start" style={{ width: '55vw', minHeight: '52vh' }}>
      <div className="flex items-center mb-3">
        <img src="/projects-navbar-icons/info-circle.svg" alt="Info" width={22} height={14} style={{ marginRight: 13, color: '#2FD5C8', filter: 'invert(62%) sepia(99%) saturate(377%) hue-rotate(127deg) brightness(97%) contrast(92%)' }} />
        <span className="text-[17px] font-bold font-sans" style={{ color: '#1E2128FF' }}>Overview</span>
      </div>
      <label className="block text-[13px] text-gray-600 font-bold font-sans mb-0" htmlFor="project-name">Project Name</label>
      <input
        id="project-name"
        type="text"
        placeholder="What is the name of your project?"
        className={`w-full rounded-[10px] border font-medium px-4 py-3 text-[13px] h-[40px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] ${touched && name.trim() === "" ? 'border-red-400' : 'border-gray-200'}`}
        style={{ marginBottom: 10 }}
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <div className="flex items-center gap-2 mb-1">
        <label className="block text-[13px] text-gray-600 font-bold font-sans" htmlFor="project-description">Project Description</label>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1 h-6 px-2 text-[11px]"
          onClick={() => generateContent('description')}
          disabled={isGenerating.description}
        >
          <Sparkles className="h-3 w-3" />
          {isGenerating.description ? "Generating..." : "Generate with AI"}
        </Button>
      </div>
      <textarea
        id="project-description"
        placeholder="Provide a summary of your project goals and objectives."
        className={`w-full rounded-[10px] border font-medium px-4 py-3 text-[13px] h-[80px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] resize-none ${touched && description.trim() === "" ? 'border-red-400' : 'border-gray-200'}`}
        style={{ marginBottom: 10 }}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <div className="flex items-center gap-2 mb-1">
        <label className="block text-[13px] text-gray-600 font-bold font-sans" htmlFor="project-problem">Problem or Opportunity</label>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1 h-6 px-2 text-[11px]"
          onClick={() => generateContent('problem')}
          disabled={isGenerating.problem}
        >
          <Sparkles className="h-3 w-3" />
          {isGenerating.problem ? "Generating..." : "Generate with AI"}
        </Button>
      </div>
      <textarea
        id="project-problem"
        placeholder="Describe the problem the project aims to solve or the opportunity it seeks to leverage."
        className={`w-full rounded-[10px] border font-medium px-4 py-3 text-[13px] h-[80px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] resize-none ${touched && problem.trim() === "" ? 'border-red-400' : 'border-gray-200'}`}
        style={{ marginBottom: 10 }}
        value={problem}
        onChange={e => setProblem(e.target.value)}
      />

      <div className="flex items-center gap-2 mb-1">
        <label className="block text-[13px] text-gray-600 font-bold font-sans" htmlFor="project-customers">Target customers or audience</label>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1 h-6 px-2 text-[11px]"
          onClick={() => generateContent('customers')}
          disabled={isGenerating.customers}
        >
          <Sparkles className="h-3 w-3" />
          {isGenerating.customers ? "Generating..." : "Generate with AI"}
        </Button>
      </div>
      <input
        id="project-customers"
        type="text"
        placeholder="Identify the primary audience or beneficiaries of the project"
        className={`w-full rounded-[10px] border font-medium px-4 py-3 text-[13px] h-[40px] font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] ${touched && customers.trim() === "" ? 'border-red-400' : 'border-gray-200'}`}
        style={{ marginBottom: 10 }}
        value={customers}
        onChange={e => setCustomers(e.target.value)}
      />
    </div>
  );
});

export default ProjectOverview; 