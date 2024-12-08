import { Check, X } from "lucide-react";

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
      text: "At least 8 characters long",
      met: password.length >= 8,
    },
    {
      text: "Contains at least one uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      text: "Contains at least one lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      text: "Contains at least one number",
      met: /\d/.test(password),
    },
    {
      text: "Contains at least one special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const getStrengthPercentage = () => {
    const metCount = requirements.filter((req) => req.met).length;
    return (metCount / requirements.length) * 100;
  };

  const getStrengthColor = () => {
    const percentage = getStrengthPercentage();
    if (percentage <= 20) return "bg-red-500";
    if (percentage <= 40) return "bg-orange-500";
    if (percentage <= 60) return "bg-yellow-500";
    if (percentage <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${getStrengthPercentage()}%` }}
        />
      </div>
      <div className="space-y-1">
        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-center text-sm space-x-2">
            {requirement.met ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            <span className={requirement.met ? "text-green-700" : "text-red-700"}>
              {requirement.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}