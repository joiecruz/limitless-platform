import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { SignupData } from "../types";

interface Step2Props {
  formData: SignupData;
  verificationCode?: string;
  setVerificationCode?: (code: string) => void;
  handleVerification?: () => void;
  handleResendCode?: () => void;
}

export const Step2 = ({ 
  formData, 
  verificationCode = "", 
  setVerificationCode = () => {}, 
  handleVerification = () => {},
  handleResendCode = () => {}
}: Step2Props) => (
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
              <InputOTPSlot key={idx} {...slot} className="w-12 h-12 text-lg" index={idx} />
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