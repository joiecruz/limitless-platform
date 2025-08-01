import { OnboardingData } from "../types";
import { NameFields } from "./fields/NameFields";
import { RoleField } from "./fields/RoleField";
import { CompanySizeField } from "./fields/CompanySizeField";

interface PersonalInfoFieldsProps {
  formData: Pick<OnboardingData, "firstName" | "lastName" | "role" | "companySize">;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  isInvitedUser?: boolean;
}

export function PersonalInfoFields({
  formData,
  handleInputChange,
  handleSelectChange,
  isInvitedUser
}: PersonalInfoFieldsProps) {
  return (
    <div className="grid gap-4">
      <NameFields
        firstName={formData.firstName}
        lastName={formData.lastName}
        handleInputChange={handleInputChange}
      />

      <RoleField
        role={formData.role}
        handleSelectChange={handleSelectChange}
      />

      <CompanySizeField
        companySize={formData.companySize}
        handleSelectChange={handleSelectChange}
      />
    </div>
  );
}