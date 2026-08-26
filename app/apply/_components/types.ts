import { DEFAULT_PHONE_COUNTRY, phoneCountries } from "@/lib/data";

export type FormState = {
  fullName: string;
  email: string;
  phone: string;
  phoneCountry: string;
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
  street?: string;
  city?: string;
  zip?: string;
  passportPhoto?: string;
};

export type Stage = "form" | "submitting" | "paid";

export const DEFAULT_FORM_PHONE_COUNTRY = DEFAULT_PHONE_COUNTRY;

// Combines the selected phone country's dial code with the local number,
// e.g. formatInternationalPhone("Kenya", "712345678") -> "+254 712345678"
export function formatInternationalPhone(phoneCountry: string, phone: string) {
  if (!phone.trim()) return "";
  const dialCode = phoneCountries.find((c) => c.name === phoneCountry)?.dialCode ?? "";
  return [dialCode, phone.trim()].filter(Boolean).join(" ");
}