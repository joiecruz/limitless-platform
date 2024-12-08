import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { SignupData } from "../types";

interface Step2Props {
  formData: SignupData;
  verificationCode?: string;
  setVerificationCode?: (code: string) => void;
  handleVerification?: () => void;
  handleResendCode?: () => void;
  handleLogout?: () => void;
}

export const Step2 = ({ 
  formData, 
  verificationCode = "", 
  setVerificationCode = () => {}, 
  handleVerification = () => {},
  handleResendCode = () => {},
  handleLogout = () => {}
}: Step2Props) => (
  <div className="space-y-6">
    <div className="space-y-2 text-center">
      <h2 className="text-4xl font-bold tracking-tight">Verify your account</h2>
      <img 
        src="/lovable-uploads/440455ea-f8d0-4e60-bfc4-0c17bd3b1323.png" 
        alt="Verification" 
        className="mx-auto w-48 h-48 my-8"
      />
      <p className="text-3xl font-medium">We just emailed you.</p>
      <p className="text-gray-500 text-lg mt-2">
        Please enter the code we emailed you.
      </p>
      <p className="text-gray-900 font-medium mt-4 text-lg">{formData.email}</p>
    </div>

    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-gray-700 font-medium">Confirmation code</p>
        <InputOTP
          value={verificationCode}
          onChange={(value) => setVerificationCode(value)}
          maxLength={6}
          render={({ slots }) => (
            <InputOTPGroup className="gap-2 flex justify-center">
              {slots.map((slot, idx) => (
                <InputOTPSlot key={idx} {...slot} index={idx} className="w-14 h-14 text-lg" />
              ))}
            </InputOTPGroup>
          )}
        />
      </div>

      <Button 
        onClick={handleVerification}
        className="w-full h-12 text-lg font-medium bg-[#6366F1] hover:bg-[#5558E3]"
        size="lg"
      >
        Verify
      </Button>

      <div className="text-center space-x-1 text-base">
        <button 
          onClick={handleResendCode}
          className="text-[#6366F1] hover:underline font-medium"
        >
          Resend code
        </button>
        <span>or</span>
        <button 
          onClick={handleLogout}
          className="text-[#6366F1] hover:underline font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);