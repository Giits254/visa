// The one code applicants use everywhere: as the M-Pesa STK push reference,
// on their invoice, in their confirmation email, and to look themselves up
// later in the "Already applied?" status checker.

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — easy to read back over the phone

function randomSegment(length: number) {
  let out = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function generateReferenceCodeCandidate() {
  const year = new Date().getFullYear();
  return `MV-${year}-${randomSegment(6)}`;
}

/**
 * Generates a reference code and confirms it isn't already in use.
 * Collisions are astronomically unlikely (33^6 space) but the check is
 * cheap, so we just retry a handful of times rather than trust the odds.
 */
export async function generateUniqueReferenceCode(
  isTaken: (code: string) => Promise<boolean>
): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = generateReferenceCodeCandidate();
    if (!(await isTaken(candidate))) return candidate;
  }
  throw new Error("Could not generate a unique reference code — please retry.");
}
