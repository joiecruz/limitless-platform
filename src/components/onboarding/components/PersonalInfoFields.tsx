import { OnboardingData } from "../types";
import { NameFields } from "./fields/NameFields";
import { PasswordField } from "./fields/PasswordField";

interface PersonalInfoFieldsProps {
  formData: Pick<OnboardingData, "firstName" | "lastName" | "password">;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInvitedUser?: boolean;
}

export function PersonalInfoFields({ 
  formData, 
  handleInputChange,
  isInvitedUser 
}: PersonalInfoFieldsProps) {
  return (
    <div className="grid gap-6">
      <NameFields
        firstName={formData.firstName}
        lastName={formData.lastName}
        handleInputChange={handleInputChange}
      />

      {isInvitedUser && (
        <PasswordField
          password={formData.password || ""}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  );
}