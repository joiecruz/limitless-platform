import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface OnboardingOption {
  value: string;
  label: string;
}

const options: OnboardingOption[] = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "school", label: "School" },
];

export function OnboardingModal() {
  const [selectedOption, setSelectedOption] = useState<string>("");

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[600px] p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-center mb-4">
            What would you like to use
          </DialogTitle>
          <DialogTitle className="text-3xl font-semibold text-center">
            Limitless Lab for?
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 mt-12">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedOption(option.value)}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200
                ${selectedOption === option.value 
                  ? 'border-primary bg-primary-50 text-primary' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-lg font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <Button 
            className="w-full"
            disabled={!selectedOption}
            onClick={() => {
              // TODO: Handle selection
              console.log("Selected option:", selectedOption);
            }}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}