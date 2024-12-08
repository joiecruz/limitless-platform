import { TextStep } from "./TextStep";
import { SignupData } from "../types";

interface Step1Props {
  formData: SignupData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
}

export const Step1 = ({ formData, handleInputChange, nextStep }: Step1Props) => (
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
        required: true,
        containerClassName: "w-full"
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true,
        containerClassName: "w-full"
      }
    ]}
    values={formData}
    onChange={handleInputChange}
    onNext={nextStep}
    fieldsContainerClassName="flex gap-4 flex-wrap"
  />
);