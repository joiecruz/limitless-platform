export const validateFormData = (
  firstName: string, 
  lastName: string, 
  role: string, 
  companySize: string,
  password?: string
) => {
  const baseValidation = firstName !== "" && lastName !== "" && role !== "" && companySize !== "";
  
  if (password !== undefined) {
    // Password validation rules
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return baseValidation && hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }
  
  return baseValidation;
};