export type FormState = {
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  nationality: string;
  destination: string;
  state: string;
  travelDate: string;
  purpose: string;
  street: string;
  city: string;
  zip: string;
};

export type FormErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  nationality?: string;
  state?: string;
  passportPhoto?: string;
};

export type Stage = "form" | "submitting" | "paid";
