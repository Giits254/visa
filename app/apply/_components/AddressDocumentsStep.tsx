import { destinations } from "@/lib/data";
import { FormErrors, FormState } from "./types";

type Destination = (typeof destinations)[number];

type AddressDocumentsStepProps = {
  form: FormState;
  errors: FormErrors;
  update: <K extends keyof FormState>(key: K, value: string) => void;
  clearError: (key: keyof FormErrors) => void;
  destination: Destination;
  isAustralia: boolean;
};

export default function AddressDocumentsStep({
  form,
  errors,
  update,
  clearError,
  destination,
  isAustralia,
}: AddressDocumentsStepProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <label className="block">
        <span className="text-sm font-medium text-night">Street address</span>
        <input
          required
          value={form.street}
          onChange={(e) => update("street", e.target.value)}
          placeholder="House number and street name"
          className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
        />
      </label>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-night">Town / city</span>
          <input
            required
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="e.g. Nairobi"
            className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-night">ZIP / postal code</span>
          <input
            required
            value={form.zip}
            onChange={(e) => update("zip", e.target.value)}
            placeholder="e.g. 00100"
            className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-night">Destination</span>
        <select
          value={form.destination}
          onChange={(e) => {
            update("destination", e.target.value);
            update("state", "");
            clearError("state");
          }}
          className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
        >
          {destinations.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      {isAustralia && (
        <label className="block">
          <span className="text-sm font-medium text-night">State or territory</span>
          <select
            value={form.state}
            onChange={(e) => {
              update("state", e.target.value);
              clearError("state");
            }}
            className={`mt-2 w-full rounded-lg border bg-sand px-4 py-3 text-sm text-ink ${
              errors.state ? "border-red-500" : "border-night/25"
            }`}
          >
            <option value="">Select a state or territory</option>
            {destination.states?.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.state}</p>
          )}
        </label>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-night">
            Intended travel date
          </span>
          <input
            required
            type="date"
            value={form.travelDate}
            onChange={(e) => update("travelDate", e.target.value)}
            className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-night">
            How will you work?
          </span>
          <select
            value={form.purpose}
            onChange={(e) => update("purpose", e.target.value)}
            className="mt-2 w-full rounded-lg border border-night/25 bg-sand px-4 py-3 text-sm text-ink"
          >
            <option>Hybrid (remote + onsite)</option>
            <option>Onsite (in-country)</option>
          </select>
        </label>
      </div>
    </div>
  );
}
