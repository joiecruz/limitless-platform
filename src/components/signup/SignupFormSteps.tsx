import { TextStep } from "./steps/TextStep";
import { ButtonGridStep } from "./steps/ButtonGridStep";
import { TextareaStep } from "./steps/TextareaStep";
import { SignupData } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

interface StepProps {
  formData: SignupData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  loading?: boolean;
  verificationCode?: string;
  setVerificationCode?: (code: string) => void;
  handleVerification?: () => void;
  handleResendCode?: () => void;
}

export const Step1 = ({ formData, handleInputChange, nextStep }: StepProps) => (
  <TextStep
    fields={[
      {
        name: "firstName",
        label: "First Name",
        required: true,
        containerClassName: "flex-1"
      },
      {
        name: "lastName",
        label: "Last Name",
        required: true,
        containerClassName: "flex-1"
      },
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
    fieldsContainerClassName="flex gap-4 flex-wrap"
  />
);

export const Step2 = ({ 
  formData, 
  verificationCode = "", 
  setVerificationCode = () => {}, 
  handleVerification = () => {},
  handleResendCode = () => {}
}: StepProps) => (
  <div className="space-y-6">
    <div className="space-y-2 text-center">
      <h2 className="text-3xl font-bold tracking-tight">Verify your account</h2>
      <img 
        src="/lovable-uploads/37e245fb-5fd3-44f3-b31a-e507313f2db8.png" 
        alt="Verification" 
        className="mx-auto w-32 h-32 my-6"
      />
      <p className="text-2xl font-semibold">We just emailed you.</p>
      <p className="text-gray-500">
        Please enter the code we emailed you.
      </p>
      <p className="text-gray-900 font-medium mt-4">{formData.email}</p>
    </div>

    <div className="space-y-4">
      <InputOTP
        value={verificationCode}
        onChange={(value) => setVerificationCode(value)}
        maxLength={6}
        render={({ slots }) => (
          <InputOTPGroup className="gap-2 flex justify-center">
            {slots.map((slot, idx) => (
              <InputOTPSlot key={idx} {...slot} className="w-12 h-12 text-lg" />
            ))}
          </InputOTPGroup>
        )}
      />

      <Button 
        onClick={handleVerification}
        className="w-full"
        size="lg"
      >
        Verify
      </Button>

      <div className="text-center space-x-1 text-sm">
        <button 
          onClick={handleResendCode}
          className="text-primary hover:underline"
        >
          Resend code
        </button>
        <span>or</span>
        <button 
          onClick={() => {}}
          className="text-primary hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);

export const Step3 = ({ formData, handleSelectChange, nextStep, prevStep }: StepProps) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>What best describes you?</Label>
      <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="founder">Founder / C-level</SelectItem>
          <SelectItem value="developer">Developer</SelectItem>
          <SelectItem value="product_manager">Product Manager</SelectItem>
          <SelectItem value="qa">QA / Tester</SelectItem>
          <SelectItem value="business_analyst">Business Analyst</SelectItem>
          <SelectItem value="marketer">Marketer</SelectItem>
          <SelectItem value="project_manager">Project Manager</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="ux_researcher">UX Researcher</SelectItem>
          <SelectItem value="customer_support">Customer Support</SelectItem>
          <SelectItem value="ui_ux_designer">UI UX Designer</SelectItem>
          <SelectItem value="other">Other...</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex gap-2">
      <Button type="button" onClick={prevStep} variant="outline">
        Back
      </Button>
      <Button type="button" onClick={nextStep} className="flex-1">
        Continue
      </Button>
    </div>
  </div>
);

export const Step4 = ({ formData, handleSelectChange, nextStep, prevStep }: StepProps) => (
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

export const Step5 = ({ formData, handleSelectChange, nextStep, prevStep }: StepProps) => (
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

export const Step6 = ({ formData, handleInputChange, prevStep, loading }: StepProps) => (
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
