import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupData } from "../types";
import { PasswordRequirements } from "./PasswordRequirements";

interface TextStepProps {
  title?: string;
  fields: {
    name: keyof SignupData;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    containerClassName?: string;
  }[];
  values: SignupData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onPrev?: () => void;
  fieldsContainerClassName?: string;
}

export function TextStep({ 
  title,
  fields, 
  values, 
  onChange, 
  onNext, 
  onPrev,
  fieldsContainerClassName
}: TextStepProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      )}
      <div className={fieldsContainerClassName}>
        {fields.map((field) => (
          <div key={field.name} className={field.containerClassName}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type || "text"}
              required={field.required}
              value={values[field.name]}
              onChange={onChange}
              placeholder={field.placeholder}
              className="mt-1"
            />
            {field.type === "password" && (
              <PasswordRequirements password={values[field.name] as string} />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {onPrev && (
          <Button type="button" onClick={onPrev} variant="outline">
            Back
          </Button>
        )}
        <Button 
          type="button" 
          onClick={onNext} 
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}