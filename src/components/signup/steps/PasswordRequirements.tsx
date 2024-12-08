import { Circle } from "lucide-react";

interface Requirement {
  text: string;
  met: boolean;
}

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements: Requirement[] = [
    {
      text: "One lowercase character",
      met: /[a-z]/.test(password),
    },
    {
      text: "One uppercase character",
      met: /[A-Z]/.test(password),
    },
    {
      text: "One number",
      met: /\d/.test(password),
    },
    {
      text: "One special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      text: "8 characters minimum",
      met: password.length >= 8,
    },
  ];

  return (
    <div className="mt-4 space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Circle 
              className={`w-2 h-2 ${
                requirement.met 
                  ? "fill-primary-600 stroke-primary-600" 
                  : "fill-gray-300 stroke-gray-300"
              }`} 
            />
            <span 
              className={`text-sm ${
                requirement.met 
                  ? "text-primary-600" 
                  : "text-gray-400"
              }`}
            >
              {requirement.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}