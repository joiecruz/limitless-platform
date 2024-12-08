import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupData } from "../types";
import { Loader2 } from "lucide-react";

interface TextStepProps {
  title?: string;
  fields: {
    name: keyof SignupData;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    containerClassName?: string;
    error?: string;
  }[];
  values: SignupData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onPrev?: () => void;
  loading?: boolean;
  fieldsContainerClassName?: string;
  isNextDisabled?: boolean;
  customFields?: React.ReactNode[];
}

export function TextStep({ 
  title,
  fields, 
  values, 
  onChange, 
  onNext, 
  onPrev,
  loading,
  fieldsContainerClassName,
  isNextDisabled,
  customFields
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
              className={`mt-1 ${field.error ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {field.error && (
              <p className="text-sm text-red-500 mt-1">{field.error}</p>
            )}
          </div>
        ))}
        {customFields}
      </div>
      <div className="flex gap-2">
        {onPrev && (
          <Button type="button" onClick={onPrev} variant="outline" disabled={loading}>
            Back
          </Button>
        )}
        <Button 
          type="button" 
          onClick={onNext} 
          className="flex-1"
          disabled={loading || isNextDisabled}
          variant={isNextDisabled ? "secondary" : "default"}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
}