import { WaitlistFormData, FormErrors } from '../types/waitlist';

export const validateEmail = (email: string): string => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePhone = (phone: string): string => {
  if (!phone.trim()) return 'Phone number is required';
  const phoneRegex = /^[+]?[\d\s()-]+$/;
  if (!phoneRegex.test(phone) || phone.length < 10) return 'Please enter a valid phone number';
  return '';
};

export const validateRequired = (value: string, fieldName: string): string => {
  if (!value.trim()) return `${fieldName} is required`;
  return '';
};

export const validateWaitlistForm = (data: WaitlistFormData): FormErrors => {
  const errors: FormErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const nameError = validateRequired(data.fullName, 'Full name');
  if (nameError) errors.fullName = nameError;

  const phoneError = validatePhone(data.phoneNumber);
  if (phoneError) errors.phoneNumber = phoneError;

  const businessError = validateRequired(data.typeOfBusiness, 'Business type');
  if (businessError) errors.typeOfBusiness = businessError;

  if (data.typeOfBusiness === 'Other' && !data.customBusinessTypes.trim()) {
    errors.customBusinessTypes = 'Please specify your business type';
  }

  const countryError = validateRequired(data.country, 'Country');
  if (countryError) errors.country = countryError;

  if (data.country === 'Other' && (!data.customCountry || !data.customCountry.trim())) {
    errors.customCountry = 'Please specify your country';
  }

  const cityError = validateRequired(data.city, 'City');
  if (cityError) errors.city = cityError;

  return errors;
};