import { TextStep } from "./steps/TextStep";
import { ButtonGridStep } from "./steps/ButtonGridStep";
import { TextareaStep } from "./steps/TextareaStep";
import { SignupData } from "./types";

interface StepProps {
  formData: SignupData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  loading?: boolean;
}

export const Step1 = ({ formData, handleInputChange, nextStep }: StepProps) => (
  <TextStep
    fields={[
      {
        name: "email",
        label: "Work Email",
        type: "email",
        placeholder: "you@company.com",
        required: true
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true
      }
    ]}
    values={formData}
    onChange={handleInputChange}
    onNext={nextStep}
  />
);

export const Step2 = ({ formData, handleInputChange, nextStep, prevStep }: StepProps) => (
  <TextStep
    fields={[
      {
        name: "firstName",
        label: "First Name",
        required: true
      },
      {
        name: "lastName",
        label: "Last Name",
        required: true
      }
    ]}
    values={formData}
    onChange={handleInputChange}
    onNext={nextStep}
    onPrev={prevStep}
  />
);

export const Step3 = ({ formData, handleInputChange, nextStep, prevStep }: StepProps) => (
  <TextStep
    fields={[
      {
        name: "workspaceName",
        label: "Workspace Name",
        placeholder: "Acme Corp",
        required: true
      }
    ]}
    values={formData}
    onChange={handleInputChange}
    onNext={nextStep}
    onPrev={prevStep}
  />
);

export const Step4 = ({ formData, handleSelectChange, nextStep, prevStep }: StepProps) => (
  <ButtonGridStep
    title="What's your role?"
    options={[
      { value: "founder", label: "Founder / C-level" },
      { value: "developer", label: "Developer" },
      { value: "product_manager", label: "Product Manager" },
      { value: "qa", label: "QA / Tester" },
      { value: "business_analyst", label: "Business Analyst" },
      { value: "marketer", label: "Marketer" },
      { value: "project_manager", label: "Project Manager" },
      { value: "sales", label: "Sales" },
      { value: "ux_researcher", label: "UX Researcher" },
      { value: "customer_support", label: "Customer Support" },
      { value: "ui_ux_designer", label: "UI UX Designer" },
      { value: "other", label: "Other..." }
    ]}
    value={formData.role}
    onChange={(value) => handleSelectChange("role", value)}
    onNext={nextStep}
    onPrev={prevStep}
  />
);

export const Step5 = ({ formData, handleSelectChange, nextStep, prevStep }: StepProps) => (
  <ButtonGridStep
    title="How many employees does your company have?"
    options={[
      { value: "1-10", label: "1-10" },
      { value: "11-50", label: "11-50" },
      { value: "51-100", label: "51-100" },
      { value: "101-500", label: "101-500" },
      { value: "501-1000", label: "501-1000" },
      { value: "1001+", label: "1001+" }
    ]}
    value={formData.companySize}
    onChange={(value) => handleSelectChange("companySize", value)}
    onNext={nextStep}
    onPrev={prevStep}
  />
);

export const Step6 = ({ formData, handleSelectChange, nextStep, prevStep }: StepProps) => (
  <ButtonGridStep
    title="How did you hear about us?"
    options={[
      { value: "colleague", label: "Through a colleague / friend" },
      { value: "search", label: "Search engine (Google, Bing...)" },
      { value: "review", label: "A review site / An article" },
      { value: "twitter", label: "Twitter" },
      { value: "linkedin", label: "LinkedIn" },
      { value: "facebook", label: "Facebook" },
      { value: "instagram", label: "Instagram" },
      { value: "tiktok", label: "TikTok" },
      { value: "youtube", label: "YouTube" },
      { value: "other", label: "Other..." }
    ]}
    value={formData.referralSource}
    onChange={(value) => handleSelectChange("referralSource", value)}
    onNext={nextStep}
    onPrev={prevStep}
  />
);

export const Step7 = ({ formData, handleInputChange, prevStep, loading }: StepProps) => (
  <TextareaStep
    title="What do you want to accomplish?"
    label="Tell us about your goals"
    name="goals"
    value={formData.goals}
    onChange={handleInputChange}
    placeholder="Tell us about your goals..."
    onSubmit={() => {}} // Form submission is handled by the parent
    onPrev={prevStep}
    loading={loading}
  />
);