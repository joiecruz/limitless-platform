import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StepCard from "../../../components/projects/StepCard";
import DocumentEditor from "../../../components/projects/DocumentEditor"; 
import Define from "./Define";
import { useStepNavigation } from "../../../components/projects/ProjectNavBar";
import { useEmpathize } from '@/hooks/useEmpathize';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const steps = [
  {
    title: "Select your user research method",
    description: "Choose the best method to gather insights and understand your users deeply",
    options: ["User interviews", "Surveys", "Focused Groups"],
    duration: null,
    action: { label: "Recommend", active: true },
  },
  {
    title: "Create a user research plan",
    description: "Develop a comprehensive plan to guide your research efforts effectively",
    options: null,
    duration: "4 hours",
    action: { label: "Generate", active: true },
  },
  {
    title: "Conduct user research",
    description: "Execute your research plan to collect valuable data from your users",
    options: null,
    duration: "1 - 2 weeks",
    action: { label: "Generate", active: true },
  },
  {
    title: "Generate insights from your user research",
    description: "Analyze the gathered data to uncover actionable insights",
    options: null,
    duration: "2 days",
    action: { label: "Analyze", active: true },
  },
  {
    title: "Create customer persona/s",
    description: "Come up with a visual representation of the people you are designing for",
    options: null,
    duration: "30 mins",
    action: { label: "Generate", active: true },
  },
];

const stepIds = [
  '880e8400-e29b-41d4-a716-446655440001', // Select your user research method
  '880e8400-e29b-41d4-a716-446655440002', // Create a User Research Plan
  '880e8400-e29b-41d4-a716-446655440003', // Conduct User Research
  '880e8400-e29b-41d4-a716-446655440004', // Generate insights from your user research
  '880e8400-e29b-41d4-a716-446655440005', // Create customer persona/s
];

export default function Empathize() {
  const { projectId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState([false, false, false, false, false]);
  const [showDefine, setShowDefine] = useState(false);
  const [checkedOptions, setCheckedOptions] = useState([false, false, false]);
  const navigate = useNavigate();
  const { changeStep, selectedStep } = useStepNavigation();
  const documentEditorRef = useRef<any>(null);
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<{
    name: string;
    description?: string;
    problem?: string;
    customers?: string;
    targetOutcomes?: string;
  } | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;
      try {
        const { data: project, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        if (error) throw error;
        const metadata = (project.metadata as any) || {};
        setProjectData({
          name: project.name || '',
          description: project.description || '',
          problem: metadata.problem || '',
          customers: metadata.customers || '',
          targetOutcomes: metadata.targetOutcomes || '',
        });
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchProjectData();
  }, [projectId]);

  // Empathize hook for current step
  const stepId = stepIds[activeStep];
  const {
    data: empathizeData,
    isLoading,
    updateData,
    saveEmpathize,
    loadEmpathize,
  } = useEmpathize(projectId || null, stepId);

  // Load data on mount and when step changes
  useEffect(() => {
    loadEmpathize();
  }, [projectId, stepId]);

  useEffect(() => {
    // Pre-fill checkboxes for step 0
    if (activeStep === 0 && Array.isArray(empathizeData.userResearchMethod)) {
      setCheckedOptions(steps[0].options.map(opt => empathizeData.userResearchMethod.includes(opt)));
      if (empathizeData.userResearchMethod.length > 0) {
        toast({ title: 'Progress restored!', description: 'Your previous selections have been loaded.' });
      }
    } else if (activeStep !== 0 && documentEditorRef.current) {
      const value = getEditorValue();
      documentEditorRef.current.setContents(value);
      if (value && value.length > 0) {
        toast({ title: 'Progress restored!', description: 'Your previous document has been loaded.' });
      }
    }
    // eslint-disable-next-line
  }, [
    activeStep,
    empathizeData.userResearchMethod,
    empathizeData.userResearchPlan,
    empathizeData.userResearchNotes,
    empathizeData.userResearchInsights,
    empathizeData.customerPersona
  ]);

  // Restore handleOptionCheck and handleCheck
  const handleOptionCheck = async (optionIdx: number) => {
    // console.log('Option checkbox changed:', optionIdx);
    // Compute the new checked state
    const newChecked = checkedOptions.map((checked, idx) =>
      idx === optionIdx ? !checked : checked
    );
    setCheckedOptions(newChecked);

    await saveEmpathize();
    const selectedMethods = newChecked
      .map((checked, idx) => checked ? steps[0].options[idx] : null)
      .filter(Boolean);
    updateData({ userResearchMethod: selectedMethods });
    // Save after state is updated
    // console.log('projectId:', projectId);
    // console.log('state.data:', empathizeData);
    await saveEmpathize();
  };

  const handleCheck = async (idx: number) => {
    if (idx === 0 && !checkedOptions.some(Boolean)) {
      return;
    }
    if (idx === activeStep) {
      const newChecked = [...checkedSteps];
      const wasChecked = checkedSteps[idx];
      newChecked[idx] = !checkedSteps[idx]; // toggle
      setCheckedSteps(newChecked);
      if (!wasChecked) {
        // If just checked (was false, now true), save empathize for this step
        if (activeStep === 0) {
          const selectedMethods = checkedOptions
            .map((checked, idx) => checked ? steps[0].options[idx] : null)
            .filter(Boolean);
          updateData({ userResearchMethod: selectedMethods });
        } else if (documentEditorRef.current) {
          const editorContents = documentEditorRef.current.getContents();
          setEditorValue(editorContents);
        }
        await saveEmpathize();
      }
      if (!wasChecked && idx < steps.length - 1) {
        // If just checked (was false, now true), move to next step
        setActiveStep(idx + 1);
      }
    }
    // console.log('state.data:', empathizeData);
  };

  const allChecked = checkedSteps.every(Boolean);
  const isLastStep = activeStep === steps.length - 1;
  const canGoNext = isLastStep ? allChecked : checkedSteps[activeStep];

  // For DocumentEditor ref-based value
  useEffect(() => {
    if (activeStep !== 0 && documentEditorRef.current) {
      // Set the editor content for the current step
      documentEditorRef.current.setContents(getEditorValue());
    }
    // eslint-disable-next-line
  }, [activeStep]);

  // For DocumentEditor controlled value
  const getEditorValue = () => {
    switch (activeStep) {
      case 1:
        return empathizeData.userResearchPlan;
      case 2:
        return empathizeData.userResearchNotes;
      case 3:
        return empathizeData.userResearchInsights;
      case 4:
        return empathizeData.customerPersona;
      default:
        return '';
    }
  };
  const setEditorValue = (val: string) => {
    switch (activeStep) {
      case 1:
        updateData({ userResearchPlan: val });
        break;
      case 2:
        updateData({ userResearchNotes: val });
        break;
      case 3:
        updateData({ userResearchInsights: val });
        break;
      case 4:
        updateData({ customerPersona: val });
        break;
    }
  };

  // Save data on step change
  const handleNext = async () => {
    if (activeStep === 0) {
      // Save all checked options as array
      const selectedMethods = checkedOptions
        .map((checked, idx) => checked ? steps[0].options[idx] : null)
        .filter(Boolean);
      updateData({ userResearchMethod: selectedMethods });
      await saveEmpathize();
    } else {
      // Save DocumentEditor content for the current step
      let field = '';
      switch (activeStep) {
        case 1:
          field = 'userResearchPlan';
          break;
        case 2:
          field = 'userResearchNotes';
          break;
        case 3:
          field = 'userResearchInsights';
          break;
        case 4:
          field = 'customerPersona';
          break;
      }
      if (field && documentEditorRef.current) {
        const editorContents = documentEditorRef.current.getContents();
        // console.log('Saving to DB:', { field, editorContents });
        setEditorValue(editorContents);
        await saveEmpathize();
      }
    }
    if (activeStep === steps.length - 1) {
      changeStep('Define');
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // Add a handler to update empathize when DocumentEditor is saved
  const handleEditorSave = async () => {
    if (activeStep > 0 && documentEditorRef.current) {
      const editorContents = documentEditorRef.current.getContents();
      setEditorValue(editorContents);
      await saveEmpathize();
    }
  };

  // AI content generation for document steps
  const [isGenerating, setIsGenerating] = useState(false);
  const generateAIContent = async (stepIdx: number) => {
    if (isGenerating) return;
    setIsGenerating(true);
    let prompt = '';
    let field = '';
    const context = projectData ? [
      `Project: "${projectData.name}"`,
      projectData.description && `Description: ${projectData.description}`,
      projectData.problem && `Problem: ${projectData.problem}`,
      projectData.customers && `Target customers: ${projectData.customers}`,
      projectData.targetOutcomes && `Target outcomes: ${projectData.targetOutcomes}`,
    ].filter(Boolean).join('. ') : '';
    switch (stepIdx) {
      case 0:
        prompt = `${context}. Recommend the 2-3 best user research methods for this project. Return only the method names as a comma-separated list, matching exactly: User interviews, Surveys, Focused Groups.`;
        field = 'userResearchMethod';
        break;
      case 1:
        prompt = `${context}. Generate a comprehensive user research plan for this project.`;
        field = 'userResearchPlan';
        break;
      case 2:
        prompt = `${context}. Generate detailed user research notes for this project.`;
        field = 'userResearchNotes';
        break;
      case 3:
        prompt = `${context}. Analyze user research data and generate actionable insights for this project.`;
        field = 'userResearchInsights';
        break;
      case 4:
        prompt = `${context}. Create a customer persona based on user research for this project.`;
        field = 'customerPersona';
        break;
      default:
        setIsGenerating(false);
        return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('generate-description', {
        body: { prompt }
      });
      if (error) throw error;
      let generatedText = data.generatedText || '';
      // For step 0, parse and check checkboxes
      if (stepIdx === 0) {
        // Parse comma-separated list into array
        const methods = generatedText.split(',').map(t => t.trim()).filter(Boolean);
        // Only use methods that are in steps[0].options
        const selected = steps[0].options.map(opt => methods.some(m => opt.toLowerCase() === m.toLowerCase()));
        setCheckedOptions(selected);
        updateData({ userResearchMethod: steps[0].options.filter((_, idx) => selected[idx]) });
        await saveEmpathize();
        toast({
          title: 'AI Methods Recommended',
          description: 'AI has recommended user research methods and checked them for you.',
          duration: 4000,
        });
      } else {
        // Convert markdown bold (**text**) to HTML <strong>text</strong>
        generatedText = generatedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        if (documentEditorRef.current) {
          documentEditorRef.current.setContents(generatedText);
        }
        // Update empathizeData for the current field
        updateData({ [field]: generatedText });
        toast({
          title: 'AI Content Generated',
          description: 'AI has generated content for this step and it has been inserted into the editor.',
          duration: 4000,
        });
      }
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate content. Please try again or enter manually.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (showDefine) {
    return <Define />;
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-4 pl-6 pb-11">
      {/* Left: Stepper + Cards */}
      <div className="w-full md:w-1/2 flex flex-col mt-8">
        <h1 className="text-3xl font-bold text-[#23262F] mb-1">Empathize</h1>
        <p className="text-[#565D6D] mb-8 text-[15px]">Begin your innovation journey by deeply understanding your users</p>
        <div className="flex flex-col gap-4">
          {steps.map((step, idx) => (
            <div key={step.title} className="flex flex-row items-stretch">
              {/* Stepper: circle and line */}
              <div className="relative flex flex-col items-center mr-6" style={{ width: 40 }}>
                <div className="flex items-center h-full">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-[1px] text-s ${activeStep === idx ? 'border-[#DADAF2] bg-[#DADAF2]' : 'border-[#D1D5DB] bg-white'}  z-10`}>
                    <span className='text-[#171A1F]'>{idx + 1}</span>
                  </div>
                </div>
                {/* Line below the circle, except for last step */}
                {!(idx === steps.length - 1) && (
                  <div
                    className="absolute left-1/2"
                    style={{
                      top: '50%',
                      transform: 'translateX(-50%)',
                      width: '2px',
                      height: 'calc(100% + 1rem)',
                      background: '#E5E7EB',
                      zIndex: 0,
                    }}
                  />
                )}
              </div>
              {/* Card */}
              <div className="flex-1">
                <StepCard
                  {...step}
                  active={activeStep === idx}
                  checked={checkedSteps[idx]}
                  onCheck={() => handleCheck(idx)}
                  canCheck={activeStep === idx}
                  optionChecked={idx === 0 ? checkedOptions : undefined}
                  onOptionCheck={idx === 0 ? handleOptionCheck : undefined}
                  onAction={step.action && step.action.active ? () => generateAIContent(idx) : undefined}
                  isGenerating={isGenerating && activeStep === idx}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Navigation buttons */}
        <div className="flex justify-end mt-8 gap-2">
          {activeStep > 0 && (
            <button
              className="px-8 py-2 rounded-[3px] bg-[#9095A1] text-white font-medium disabled:opacity-50 w-[120px]"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          <button
            className="px-8 py-2 rounded-[3px] bg-[#393CA0] text-white font-medium disabled:opacity-50 w-[120px]"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            Next
          </button>
        </div>
      </div>
      {/* Right: Document editor */}
      <div className="w-full md:w-1/2 bg-white shadow p-2 h-[100vh] overflow-auto">
        {activeStep !== 0 && (
          <DocumentEditor ref={documentEditorRef} onSave={handleEditorSave} />
        )}
      </div>
    </div>
  );
}
