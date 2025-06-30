export interface WaitlistFormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  typeOfBusiness: string;
  customBusinessTypes: string;
  country: string;
  customCountry?: string;
  city: string;
  hasRunStoreBefore: boolean;
  wantsTutorialBook: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export type FormStep = 'email' | 'details' | 'success';