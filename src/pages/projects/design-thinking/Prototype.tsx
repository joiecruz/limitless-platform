import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StepCard from "../../../components/projects/StepCard";
import DocumentEditor from "../../../components/projects/DocumentEditor";
import UploadPrototype, { UploadedPrototype } from '../../../components/projects/UploadPrototype';
import Define from "./Define";
import Test from "./Test";
import { useStepNavigation } from "../../../components/projects/ProjectNavBar";
import { usePrototype } from '@/hooks/usePrototype';
import { supabase } from '@/integrations/supabase/client';

const steps = [
  {
    title: "Choose your prototype type",
    description: "Transform your ideas into something tangible using these prototyping techniques. Select up to 3 below.",
    options: null,
    duration: "30 mins",
    action: { label: "Recommend", active: true },
  },
  {
    title: "Work on your prototype",
    description: "Collaborate with your team to select the most impactful 'How Might We' questions to carry forward into ideation",
    options: null,
    duration: "4 hours to 3 days",
    action: { label: "Upload photos", active: true },
  }
];

const actionButtons = [
    { label: 'Sketches', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="2" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Paper Prototypes', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 4h8v8H4z" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Role Playing', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Physical Prototype', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="4" y="4" width="8" height="8" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'High-Fidelity Mockups', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="8" rx="2" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Journey Map', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 8c2-4 10 4 12-4" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Wireframes', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="10" stroke="#393CA0" strokeWidth="1.5"/></svg> },
    { label: 'Others', icon: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#393CA0" strokeWidth="1.5"/><text x="5" y="12" fontSize="7" fill="#393CA0">...</text></svg> },
];

export default function Prototype() {
  const { projectId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [showDefine, setShowDefine] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const navigate = useNavigate();
  const { changeStep, selectedStep } = useStepNavigation();
  const documentEditorRef = useRef<any>(null);
  const [projectData, setProjectData] = useState<{
    name: string;
    description?: string;
    problem?: string;
    customers?: string;
    targetOutcomes?: string;
  } | null>(null);

  // usePrototype hook
  const {
    data: prototypeData,
    isLoading,
    updateData,
    savePrototype,
    loadPrototype,
  } = usePrototype(projectId || null);

  // State for UI, synced with backend data
  const [checkedSteps, setCheckedSteps] = useState(Array(steps.length).fill(false));
  const [selectedActions, setSelectedActions] = useState(Array(actionButtons.length).fill(false));
  const [isUploading, setIsUploading] = useState(false);

  // AI content generation for prototype type recommendations
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generateAIContent = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const context = projectData ? [
        `Project: "${projectData.name}"`,
        projectData.description && `Description: ${projectData.description}`,
        projectData.problem && `Problem: ${projectData.problem}`,
        projectData.customers && `Target customers: ${projectData.customers}`,
        projectData.targetOutcomes && `Target outcomes: ${projectData.targetOutcomes}`,
      ].filter(Boolean).join('. ') : '';
      // Example prompt for prototype type recommendation
      const prompt = `${context}. Recommend 3 prototyping techniques for this project. Return only the names as a comma-separated list.`;
      const { data, error } = await supabase.functions.invoke('generate-description', {
        body: { prompt }
      });
      if (error) throw error;
      let generatedText = data.generatedText || '';
      // Parse comma-separated list into array
      const types = generatedText.split(',').map(t => t.trim()).filter(Boolean);
      // Map to actionButtons labels (if present)
      const selectedLabels = actionButtons
        .map(a => a.label)
        .filter(label => types.some(t => label.toLowerCase().includes(t.toLowerCase())));
      // If none match, just use the first 3
      const finalLabels = selectedLabels.length > 0 ? selectedLabels.slice(0, 3) : actionButtons.slice(0, 3).map(a => a.label);
      // Update UI and backend for selected types
      setSelectedActions(actionButtons.map(a => finalLabels.includes(a.label)));
      updateData({ selectedPrototypeTypes: finalLabels });

      // Generate explanation for document editor
      const notesPrompt = `${context}. Write a short paragraph explaining why these prototyping techniques (${finalLabels.join(', ')}) are recommended for this project.`;
      const { data: notesData, error: notesError } = await supabase.functions.invoke('generate-description', {
        body: { prompt: notesPrompt }
      });
      if (notesError) throw notesError;
      const notesText = notesData.generatedText || '';
      if (documentEditorRef.current) {
        documentEditorRef.current.setContents(notesText);
      }
      updateData({ prototypeNotes: notesText });

      await savePrototype();
    } catch (error) {
      // Optionally show a toast here
    } finally {
      setIsGenerating(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadPrototype();
    // eslint-disable-next-line
  }, [projectId]);

  // Remove auto-check logic from useEffect that syncs selectedActions to checkedSteps
  useEffect(() => {
    if (Array.isArray(prototypeData.selectedPrototypeTypes)) {
      const arr = actionButtons.map(btn => prototypeData.selectedPrototypeTypes.includes(btn.label));
      setSelectedActions(arr);
      // Do not auto-check the step here
    }
  }, [prototypeData.selectedPrototypeTypes]);

  // Sync DocumentEditor with backend data
  useEffect(() => {
    if (activeStep === 0 && documentEditorRef.current) {
      documentEditorRef.current.setContents(prototypeData.prototypeNotes || '');
    }
  }, [activeStep, prototypeData.prototypeNotes]);

  // Handle action select (prototype type)
  const handleActionSelect = (idx: number) => {
    setSelectedActions(prev => {
      const count = prev.filter(Boolean).length;
      const updated = [...prev];
      if (updated[idx]) {
        updated[idx] = false;
      } else if (count < 3) {
        updated[idx] = true;
      }
      // Save selected prototype types to backend (on every click)
      const selectedLabels = actionButtons.filter((_, i) => updated[i]).map(a => a.label);
      updateData({ selectedPrototypeTypes: selectedLabels });
      savePrototype();
      return updated;
    });
  };

  // Handle check (step completion)
  const handleCheck = async (idx: number) => {
    if (idx === 0 && !selectedActions.some(Boolean)) {
      return;
    }
    if (idx === activeStep) {
      const newChecked = [...checkedSteps];
      const wasChecked = checkedSteps[idx];
      newChecked[idx] = !checkedSteps[idx]; // toggle
      setCheckedSteps(newChecked);
      if (!wasChecked) {
        // Save notes for this step
        if (documentEditorRef.current) {
          const editorContents = documentEditorRef.current.getContents();
          updateData({ prototypeNotes: editorContents });
        }
        await savePrototype();
      }
      if (!wasChecked && idx < steps.length - 1) {
        setActiveStep(idx + 1);
      }
    }
  };

  // Handle photo upload for prototypes
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      const filePath = `${userId}/${fileName}`;
      const { data, error } = await supabase.storage.from('prototype-uploads').upload(filePath, file);
      if (error) {
        console.error('Supabase upload error:', error);
        alert(error.message || 'Upload failed');
        return;
      }
      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('prototype-uploads').getPublicUrl(filePath);
      const publicUrl = publicUrlData?.publicUrl || '';
      // Add to uploadedPrototypes in backend
      const newPrototype: UploadedPrototype = {
        id: filePath, // Use the full path as the ID
        name: file.name,
        image: publicUrl,
      };
      const updatedPrototypes = [...(prototypeData.uploadedPrototypes || []), newPrototype];
      updateData({ uploadedPrototypes: updatedPrototypes });
      await savePrototype();
    } catch (err) {
      // Optionally show a toast here
    } finally {
      setIsUploading(false);
    }
  };

  const allChecked = checkedSteps.every(Boolean);
  const isLastStep = activeStep === steps.length - 1;
  const canGoNext = isLastStep ? allChecked : checkedSteps[activeStep];

  const canCheckStep = (idx: number) => {
    if (idx === 0) {
      return selectedActions.some(Boolean);
    }
    return activeStep === idx;
  };

  const handleNext = async () => {
    if (documentEditorRef.current) {
      const editorContents = documentEditorRef.current.getContents();
      updateData({ prototypeNotes: editorContents });
      await savePrototype();
    }
    if (isLastStep && allChecked) {
      changeStep("Test");
    } else if (checkedSteps[activeStep] && activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  if (showDefine) {
    return <Define />;
  }
  if (showTest) {
    return <Test />;
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-4 pl-6 pb-11">
      {/* Left: Stepper + Cards */}
      <div className="w-full md:w-1/2 flex flex-col mt-8">
        <h1 className="text-3xl font-bold text-[#23262F] mb-1">Prototype</h1>
        <p className="text-[#565D6D] mb-8 text-[15px]">Bring your chosen ideas to life</p>
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
                      height: 'calc(70% + 1rem)',
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
                  canCheck={canCheckStep(idx)}
                  actions={idx === 0 ? actionButtons : undefined}
                  actionSelected={idx === 0 ? selectedActions : undefined}
                  onActionSelect={idx === 0 ? handleActionSelect : undefined}
                  onAction={idx === 0 ? generateAIContent : undefined}
                  isGenerating={idx === 0 ? isGenerating : undefined}
                  onUpload={idx === 1 ? handleUpload : undefined}
                  isUploading={idx === 1 ? isUploading : undefined}
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
      {/* Right: Document editor or UploadPrototype */}
      <div className="w-full md:w-1/2 bg-white shadow h-[100vh] overflow-auto">
        {activeStep === 1 ? (
          <UploadPrototype
            uploadedPrototypes={prototypeData.uploadedPrototypes || []}
            onUpload={handleUpload}
            isUploading={isUploading}
          />
        ) : (
          <DocumentEditor ref={documentEditorRef} className="p-2" />
        )}
      </div>
    </div>
  );
}
