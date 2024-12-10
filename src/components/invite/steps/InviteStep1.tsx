import { OnboardingData } from "../../onboarding/types";
import { PersonalInfoFields } from "../../onboarding/components/PersonalInfoFields";

interface InviteStep1Props {
  onNext: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
  loading?: boolean;
}

export function InviteStep1({ onNext, data, loading }: InviteStep1Props) {
  return (
    <PersonalInfoFields
      onNext={onNext}
      data={data}
      loading={loading}
      showPassword={true}
    />
  );
}