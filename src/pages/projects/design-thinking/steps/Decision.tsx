import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Pause,
  Heart,
  LightbulbIcon,
  RefreshCw,
  Target,
} from 'lucide-react';

interface DecisionProps {
  inNavBar?: boolean;
  onBack?: () => void;
}

export default function Decision({
  inNavBar = false,
  onBack,
}: DecisionProps) {
  usePageTitle('Project Decision | Limitless Lab');
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const navigate = useNavigate();
  const { projectId } = useParams();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(`/projects/${projectId}/test`);
    }
  };

  const handleNext = () => {
    if (!selectedDecision) return;

    if (selectedDecision === 'implement') {
      navigate(`/projects/${projectId}/implement`);
    } else if (selectedDecision === 'empathize') {
      navigate(`/projects/${projectId}/empathize`);
    } else if (selectedDecision === 'idea') {
      navigate(`/projects/${projectId}/ideate`);
    } else if (selectedDecision === 'iterate') {
      navigate(`/projects/${projectId}/prototype`);
    } else if (selectedDecision === 'test') {
      navigate(`/projects/${projectId}/test`);
    } else if (selectedDecision === 'pause') {
      navigate(`/projects`);
    }
  };

  const content = (
    <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center mb-12 mt-8">
        <div className="w-24 h-24 bg-[#393CA0]/10 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#393CA0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12"
          >
            <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
            <path d="M12 12 8 8" />
            <path d="M12 12h.01" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-center mb-4">
          Congratulations! You've completed a design cycle.
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-2xl">
          Based on the results of your user testing, how would you like to
          proceed?
        </p>
      </div>

      {/* Decision options  */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        <Card
          className={`cursor-pointer transition-all p-6 ${
            selectedDecision === 'implement'
              ? 'ring-2 ring-[#393CA0] border-[#393CA0]'
              : 'hover:border-[#393CA0]/50'
          }`}
          onClick={() => setSelectedDecision('implement')}
        >
          <div className="flex flex-col items-center text-center h-full">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Proceed with Implementation
            </h3>
            <p className="text-gray-500 text-sm flex-1">
              Your test results support moving forward with implementing the
              solution.
            </p>
          </div>
        </Card>

        <Card
          className={`cursor-pointer transition-all p-6 ${
            selectedDecision === 'empathize'
              ? 'ring-2 ring-[#393CA0] border-[#393CA0]'
              : 'hover:border-[#393CA0]/50'
          }`}
          onClick={() => setSelectedDecision('empathize')}
        >
          <div className="flex flex-col items-center text-center h-full">
            <div className="bg-pink-100 p-3 rounded-full mb-4">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Revisit Step 1 - Empathize
            </h3>
            <p className="text-gray-500 text-sm flex-1">
              Go back to understanding user needs and gathering more insights.
            </p>
          </div>
        </Card>

        <Card
          className={`cursor-pointer transition-all p-6 ${
            selectedDecision === 'idea'
              ? 'ring-2 ring-[#393CA0] border-[#393CA0]'
              : 'hover:border-[#393CA0]/50'
          }`}
          onClick={() => setSelectedDecision('idea')}
        >
          <div className="flex flex-col items-center text-center h-full">
            <div className="bg-yellow-100 p-3 rounded-full mb-4">
              <LightbulbIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Try Another Idea</h3>
            <p className="text-gray-500 text-sm flex-1">
              Explore different creative solutions for the same problem.
            </p>
          </div>
        </Card>

        <Card
          className={`cursor-pointer transition-all p-6 ${
            selectedDecision === 'iterate'
              ? 'ring-2 ring-[#393CA0] border-[#393CA0]'
              : 'hover:border-[#393CA0]/50'
          }`}
          onClick={() => setSelectedDecision('iterate')}
        >
          <div className="flex flex-col items-center text-center h-full">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <RefreshCw className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Iterate on Prototype</h3>
            <p className="text-gray-500 text-sm flex-1">
              Refine your prototype based on test feedback before
              implementation.
            </p>
          </div>
        </Card>

        <Card
          className={`cursor-pointer transition-all p-6 ${
            selectedDecision === 'test'
              ? 'ring-2 ring-[#393CA0] border-[#393CA0]'
              : 'hover:border-[#393CA0]/50'
          }`}
          onClick={() => setSelectedDecision('test')}
        >
          <div className="flex flex-col items-center text-center h-full">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Conduct More Testing</h3>
            <p className="text-gray-500 text-sm flex-1">
              Gather additional data through further user testing sessions.
            </p>
          </div>
        </Card>

        <Card
          className={`cursor-pointer transition-all p-6 ${
            selectedDecision === 'pause'
              ? 'ring-2 ring-[#393CA0] border-[#393CA0]'
              : 'hover:border-[#393CA0]/50'
          }`}
          onClick={() => setSelectedDecision('pause')}
        >
          <div className="flex flex-col items-center text-center h-full">
            <div className="bg-gray-100 p-3 rounded-full mb-4">
              <Pause className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Pause the Project</h3>
            <p className="text-gray-500 text-sm flex-1">
              Take a break to reflect or gather more resources before
              continuing.
            </p>
          </div>
        </Card>
      </div>

      <div className="flex justify-between mt-12">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedDecision}
          className="bg-[#393CA0] hover:bg-[#393CA0]/90"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return inNavBar ? (
    content
  ) : (
    <div className="bg-[#F9FAFB] min-h-screen">
      <header className="bg-white border-b">
        {/* Header content would go here if needed */}
      </header>
      {content}
    </div>
  );
}
