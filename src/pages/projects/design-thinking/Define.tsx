import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StepCard from "../../../components/projects/StepCard";
import DocumentEditor from "../../../components/projects/DocumentEditor";
import HowMightWe, { HMWQuestion } from "../../../components/projects/HowMightWe";
import { useStepNavigation } from "../../../components/projects/ProjectNavBar";
import { useDefine } from '@/hooks/useDefine';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const steps = [
  {
    title: "Review main insights",
    description: "Analyze the insights gathered during the Empathize phase. Identify key themes and patterns that stand out.",
    options: null,
    duration: "2 hours",
    action: { label: "Analyze", active: true },
  },
  {
    title: "Reframe your design challenge",
    description: "Work with your team to develop new 'How Might We' questions based on your persona and insights",
    options: null,
    duration: "30 mins",
    action: { label: "Generate", active: true },
  },
  {
    title: "Select your new design challenge",
    description: "Collaborate with your team to select the most impactful 'How Might We' questions to carry forward into ideation",
    options: null,
    duration: "15 mins",
    action: { label: "Select", active: false },
  }
];

const stepFields = [
  'mainInsights',
  'howMightWe',
  'selectedChallenge',
];

export default function Define() {
  const { projectId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState(Array(steps.length).fill(false));
  const navigate = useNavigate();
  const { changeStep } = useStepNavigation();
  const documentEditorRef = useRef<any>(null);
  const { toast } = useToast();
  const [howMightWeQuestions, setHowMightWeQuestions] = useState<HMWQuestion[]>([]);
  const [selectedHMWIds, setSelectedHMWIds] = useState<number[]>([]);
  const [projectData, setProjectData] = useState<{
    name: string;
    description?: string;
    problem?: string;
    customers?: string;
    targetOutcomes?: string;
  } | null>(null);

  // useDefine hook
  const {
    data: defineData,
    isLoading,
    updateData,
    saveDefine,
    loadDefine,
  } = useDefine(projectId || null);

  // Load data on mount
  useEffect(() => {
    loadDefine();
    // eslint-disable-next-line
  }, [projectId]);

  // Load project data for AI prompts
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

  // Load howMightWeQuestions from backend if present
  useEffect(() => {
    if (Array.isArray(defineData.howMightWe)) {
      setHowMightWeQuestions(defineData.howMightWe);
    }
  }, [defineData.howMightWe]);

  // Restore editor content on step change
  useEffect(() => {
    if (activeStep === 0 && documentEditorRef.current) {
      documentEditorRef.current.setContents(defineData.mainInsights || '');
    } else if (activeStep === 1 && documentEditorRef.current) {
      documentEditorRef.current.setContents(defineData.howMightWe || '');
    } else if (activeStep === 2 && documentEditorRef.current) {
      documentEditorRef.current.setContents(defineData.selectedChallenge || '');
    }
  }, [activeStep, defineData]);

  // Save on check
  const handleCheck = async (idx: number) => {
    if (idx === activeStep) {
      const newChecked = [...checkedSteps];
      const wasChecked = checkedSteps[idx];
      newChecked[idx] = !checkedSteps[idx]; // toggle
      setCheckedSteps(newChecked);
      if (!wasChecked) {
        // Save Define for this step
        if (documentEditorRef.current) {
          const editorContents = documentEditorRef.current.getContents();
          updateData({ [stepFields[activeStep]]: editorContents });
        }
        await saveDefine(); // Save immediately when checked
      }
      if (!wasChecked && idx < steps.length - 1) {
        setActiveStep(idx + 1);
      }
    }
  };

  const allChecked = checkedSteps.every(Boolean);
  const isLastStep = activeStep === steps.length - 1;
  const canGoNext = isLastStep ? allChecked : checkedSteps[activeStep];

  const handleNext = async () => {
    if (documentEditorRef.current) {
      const editorContents = documentEditorRef.current.getContents();
      updateData({ [stepFields[activeStep]]: editorContents });
      await saveDefine();
    }
    if (isLastStep && allChecked) {
      changeStep("Ideate");
    } else if (checkedSteps[activeStep] && activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // AI content generation
  const [isGenerating, setIsGenerating] = useState(false);
  const generateAIContent = async (stepIdx: number) => {
    if (isGenerating) return;
    setIsGenerating(true);
    let prompt = '';
    let field = '';
    let isHMW = false;
    const context = projectData ? [
      `Project: "${projectData.name}"`,
      projectData.description && `Description: ${projectData.description}`,
      projectData.problem && `Problem: ${projectData.problem}`,
      projectData.customers && `Target customers: ${projectData.customers}`,
      projectData.targetOutcomes && `Target outcomes: ${projectData.targetOutcomes}`,
    ].filter(Boolean).join('. ') : '';
    switch (stepIdx) {
      case 0:
        prompt = `${context}. Analyze the insights gathered during the Empathize phase. Identify key themes and patterns that stand out.`;
        field = 'mainInsights';
        break;
      case 1:
        prompt = `${context}. Generate a list of 5-7 'How Might We' questions based on the persona and insights from the Empathize phase. Return only the questions as a numbered list.`;
        field = 'howMightWe';
        isHMW = true;
        break;
      case 2:
        prompt = `${context}. Collaborate with your team to select the most impactful 'How Might We' questions to carry forward into ideation.`;
        field = 'selectedChallenge';
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
      // Convert markdown bold (**text**) to HTML <strong>text</strong>
      generatedText = generatedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (isHMW) {
        // Parse numbered list into questions
        const lines = generatedText.split(/\n|<br\s*\/?>(?:\n)?/).filter(l => l.trim().length > 0);
        const questions: HMWQuestion[] = lines.map((line, idx) => {
          // Remove leading number and dot
          const text = line.replace(/^\d+\.?\s*/, '').trim();
          return {
            id: idx + 1,
            text,
            stars: 3,
            avatar: '/sample-avatars/john.jpg',
          };
        }).filter(q => q.text.length > 0);
        setHowMightWeQuestions(questions);
        updateData({ [field]: questions }); // Save array to backend
        await saveDefine();
        toast({
          title: 'AI HMW Questions Generated',
          description: 'AI has generated How Might We questions and they are now displayed.',
          duration: 4000,
        });
      } else {
        if (documentEditorRef.current) {
          documentEditorRef.current.setContents(generatedText);
        }
        updateData({ [field]: generatedText });
        await saveDefine();
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

  // When user edits questions in HowMightWe, update backend
  const handleQuestionsChange = (questions: HMWQuestion[]) => {
    setHowMightWeQuestions(questions);
    updateData({ howMightWe: questions });
    saveDefine();
  };

  // When user selects/deselects HMW questions, update selectedChallenge in backend
  const handleQuestionsSelect = (selected: HMWQuestion[]) => {
    setSelectedHMWIds(selected.map(q => q.id));
    updateData({ selectedChallenge: selected });
    saveDefine();
  };

  // When user adds a new HMW question, update only howMightWe array in backend
  const handleAddHMWQuestion = (q: HMWQuestion) => {
    const updatedQuestions = [...howMightWeQuestions, q];
    setHowMightWeQuestions(updatedQuestions);
    updateData({ howMightWe: updatedQuestions });
    saveDefine();
  };

  // DocumentEditor onSave handler
  const handleEditorSave = async () => {
    if (documentEditorRef.current) {
      const editorContents = documentEditorRef.current.getContents();
      updateData({ [stepFields[activeStep]]: editorContents });
      await saveDefine();
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-4 pl-6 pb-11">
      {/* Left: Stepper + Cards */}
      <div className="w-full flex flex-col mt-8">
        <h1 className="text-3xl font-bold text-[#23262F] mb-1">Define</h1>
        <p className="text-[#565D6D] mb-8 text-[15px]">Reframe your design challenge using the insights you gathered</p>
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
      {/* Right: Document editor or HowMightWe */}
      <div className="w-full bg-white shadow h-[100vh] overflow-auto">
        {activeStep === 0 ? (
          <DocumentEditor ref={documentEditorRef} className="p-2" onSave={handleEditorSave} />
        ) : (
          <div className="flex flex-col h-full">
            <HowMightWe
              questions={howMightWeQuestions}
              onQuestionsChange={handleQuestionsChange}
              selectedIds={selectedHMWIds}
              onQuestionsSelect={handleQuestionsSelect}
              onAdd={handleAddHMWQuestion}
            />
          </div>
        )}
      </div>
    </div>
  );
}
