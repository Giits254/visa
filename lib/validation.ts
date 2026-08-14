export function validatePhone(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Phone number is required.";
  if (!/^[0-9+\-\s]+$/.test(trimmed)) {
    return "Phone number can only contain digits, spaces, + and -.";
  }
  const digitCount = trimmed.replace(/[^0-9]/g, "").length;
  if (digitCount < 7 || digitCount > 15) {
    return "Enter a valid phone number (7–15 digits).";
  }
  return null;
}

export function validateIdNumber(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "ID number is required.";
  if (!/^[0-9]+$/.test(trimmed)) {
    return "ID number must contain digits only.";
  }
  if (trimmed.length < 6 || trimmed.length > 10) {
    return "Invalid ID number.";
  }
  return null;
}
