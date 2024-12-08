export const validateFormData = (firstName: string, lastName: string, role: string, companySize: string) => {
  return firstName !== "" && lastName !== "" && role !== "" && companySize !== "";
};