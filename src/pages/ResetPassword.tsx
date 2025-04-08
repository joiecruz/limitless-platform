
import { useNavigate } from 'react-router-dom';
import { AuthLogo } from "@/components/auth/AuthLogo";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { InvalidResetToken } from "@/components/auth/InvalidResetToken";
import { usePasswordReset } from "@/hooks/usePasswordReset";

export default function ResetPassword() {
  const navigate = useNavigate();
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    passwordError,
    validToken,
    handlePasswordReset,
  } = usePasswordReset();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div onClick={() => navigate('/')} className="cursor-pointer">
          <AuthLogo />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Set new password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create a new password for your account
            </p>
          </div>

          {!validToken ? (
            <InvalidResetToken />
          ) : (
            <PasswordResetForm
              password={password}
              confirmPassword={confirmPassword}
              passwordError={passwordError}
              loading={loading}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onSubmit={handlePasswordReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
