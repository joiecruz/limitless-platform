import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StepCard from "../../../components/projects/StepCard";
import DocumentEditor from "../../../components/projects/DocumentEditor"; 
import Define from "./Define";
import { useTest } from '@/hooks/useTest';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Decision from "./steps/Decision";

const steps = [
  {
    title: "Select your user testing method",
    description: "Choose the best method to test your prototype and idea and gather feedback from people",
    options: null,
    duration: null,
    action: { label: "Recommend", active: true },
  },
  {
    title: "Create a user test plan",
    description: "Develop a comprehensive plan to guide your research efforts effectively",
    options: null,
    duration: "4 hours",
    action: { label: "Generate", active: true },
  },
  {
    title: "Conduct actual user testing",
    description: "Execute your research plan to collect valuable data from your users",
    options: null,
    duration: "1 - 2 weeks",
    action: { label: "Generate", active: true },
  },
  {
    title: "Generate insights from your user test",
    description: "Analyze the test results to uncover actionable insights",
    options: null,
    duration: "2 hours",
    action: { label: "Analyze", active: true },
  },
];

const dropdownOptions = ['Interview', 'Survey', 'Usability Test', 'A/B Test', 'Focus Group'];
const stepFields = [
  'userTestingMethod',
  'userTestPlan',
  'userTestNotes',
  'userTestInsights',
];

export default function Test() {
  const { projectId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState(Array(steps.length).fill(false));
  const [showDefine, setShowDefine] = useState(false);
  const [checkedOptions, setCheckedOptions] = useState([false, false, false, false, false]);
  const [dropdownSelected, setDropdownSelected] = useState<string[]>([]);
  const navigate = useNavigate();
  const documentEditorRef = useRef<any>(null);
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const [projectData, setProjectData] = useState<{
    name: string;
    description?: string;
    problem?: string;
    customers?: string;
    targetOutcomes?: string;
  } | null>(null);

  // useTest hook
  const {
    data: testData,
    isLoading,
    updateData,
    saveTest,
    loadTest,
  } = useTest(projectId || null);

  // Load data on mount
  useEffect(() => {
    loadTest();
    // eslint-disable-next-line
  }, [projectId]);

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

  // Restore editor content on step change
  useEffect(() => {
    if (activeStep === 0) {
      setDropdownSelected(testData.userTestingMethod || []);
    } else if (documentEditorRef.current) {
      let value = '';
      switch (activeStep) {
        case 1:
          value = testData.userTestPlan;
          break;
        case 2:
          value = testData.userTestNotes;
          break;
        case 3:
          value = testData.userTestInsights;
          break;
        default:
          value = '';
      }
      documentEditorRef.current.setContents(value || '');
    }
  }, [activeStep, testData]);

  // Save on check
  const handleCheck = async (idx: number) => {
    if (idx === activeStep) {
      const newChecked = [...checkedSteps];
      const wasChecked = checkedSteps[idx];
      newChecked[idx] = !checkedSteps[idx]; // toggle
      setCheckedSteps(newChecked);
      if (!wasChecked) {
        // Save Test for this step
        if (activeStep === 0) {
          updateData({ userTestingMethod: dropdownSelected });
        } else if (documentEditorRef.current) {
          const editorContents = documentEditorRef.current.getContents();
          updateData({ [stepFields[activeStep]]: editorContents });
        }
        await saveTest(); // Save immediately when checked
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
    if (activeStep === 0) {
      updateData({ userTestingMethod: dropdownSelected });
      await saveTest();
    } else if (documentEditorRef.current) {
      const editorContents = documentEditorRef.current.getContents();
      updateData({ [stepFields[activeStep]]: editorContents });
      await saveTest();
    }
    if (isLastStep && allChecked) {
      // Show the Decision component
      setShowDecision(true);
    } else if (checkedSteps[activeStep] && activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const canCheckStep = (idx: number) => {
    if (idx === 0) {
      return dropdownSelected.length > 0 && activeStep === 0;
    }
    return activeStep === idx;
  };

  // Dropdown handler
  const handleDropdownSelect = (selected: string[]) => {
    setDropdownSelected(selected);
    updateData({ userTestingMethod: selected });
    saveTest();
  };

  const generateAIContent = async (stepIdx: number) => {
    if (isGenerating) return;
    setIsGenerating(true);
    let prompt = '';
    let field = '';
    let isDropdown = false;
    const context = projectData ? [
      `Project: "${projectData.name}"`,
      projectData.description && `Description: ${projectData.description}`,
      projectData.problem && `Problem: ${projectData.problem}`,
      projectData.customers && `Target customers: ${projectData.customers}`,
      projectData.targetOutcomes && `Target outcomes: ${projectData.targetOutcomes}`,
    ].filter(Boolean).join('. ') : '';
    switch (stepIdx) {
      case 0:
        prompt = `${context}. Recommend 2-3 user testing methods for this project. Return only the method names as a comma-separated list.`;
        field = 'userTestingMethod';
        isDropdown = true;
        break;
      case 1:
        prompt = `${context}. Generate a comprehensive user test plan for this project.`;
        field = 'userTestPlan';
        break;
      case 2:
        prompt = `${context}. Generate detailed user test notes for this project.`;
        field = 'userTestNotes';
        break;
      case 3:
        prompt = `${context}. Analyze user test data and generate actionable insights for this project.`;
        field = 'userTestInsights';
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
      if (isDropdown) {
        // Parse comma-separated list into array
        const methods = generatedText.split(',').map(t => t.trim()).filter(Boolean);
        // Only use methods that are in dropdownOptions
        const selected = dropdownOptions.filter(opt => methods.some(m => opt.toLowerCase().includes(m.toLowerCase())));
        const finalSelected = selected.length > 0 ? selected.slice(0, 3) : dropdownOptions.slice(0, 2);
        setDropdownSelected(finalSelected);
        updateData({ userTestingMethod: finalSelected });
        await saveTest();
        toast({
          title: 'AI Methods Recommended',
          description: 'AI has recommended user testing methods and selected them in the dropdown.',
          duration: 4000,
        });
      } else {
        if (documentEditorRef.current) {
          documentEditorRef.current.setContents(generatedText);
        }
        updateData({ [field]: generatedText });
        await saveTest();
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
  if (showDecision) {
    return <Decision />;
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-4 pl-6 pb-11">
      {/* Left: Stepper + Cards */}
      <div className="w-full md:w-1/2 flex flex-col mt-8">
        <h1 className="text-3xl font-bold text-[#23262F] mb-1">Test</h1>
        <p className="text-[#565D6D] mb-8 text-[15px]">Validate your ideas and prototype by talking to real people</p>
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
                  action={{
                    ...step.action,
                    label: idx === 0 && isGenerating && activeStep === 0 ? 'Recommending...' : step.action.label,
                  }}
                  active={activeStep === idx}
                  checked={checkedSteps[idx]}
                  onCheck={() => handleCheck(idx)}
                  canCheck={canCheckStep(idx)}
                  optionChecked={idx === 0 ? checkedOptions : undefined}
                  dropdownOptions={idx === 0 ? dropdownOptions : undefined}
                  dropdownSelected={idx === 0 ? dropdownSelected : undefined}
                  onDropdownSelect={idx === 0 ? handleDropdownSelect : undefined}
                  onAction={step.action && (step.action.active || idx === 0) ? () => generateAIContent(idx) : undefined}
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
          <DocumentEditor ref={documentEditorRef} />
        )}
      </div>
    </div>
  );
}
