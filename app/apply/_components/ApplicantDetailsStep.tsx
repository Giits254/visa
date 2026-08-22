import { RefObject } from "react";
import { eligibleApplicantCountries, phoneCountries } from "@/lib/data";
import { FormErrors, FormState } from "./types";

type ApplicantDetailsStepProps = {
  form: FormState;
  errors: FormErrors;
  update: <K extends keyof FormState>(key: K, value: string) => void;
  clearError: (key: keyof FormErrors) => void;
  passportPhoto: File | null;
  passportPreview: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isDraggingPhoto: boolean;
  setIsDraggingPhoto: (dragging: boolean) => void;
  handlePhotoFile: (file: File | undefined | null) => void;
  removePhoto: () => void;
  maxPhotoMb: number;
};

export default function ApplicantDetailsStep({
  form,
  errors,
  update,
  clearError,
  passportPhoto,
  passportPreview,
  fileInputRef,
  isDraggingPhoto,
  setIsDraggingPhoto,
  handlePhotoFile,
  removePhoto,
  maxPhotoMb,
}: ApplicantDetailsStepProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <label className="block">
        <span className="text-sm font-medium text-night">Full name</span>
        <input
          required
          value={form.fullName}
          onChange={(e) => {
            update("fullName", e.target.value);
            clearError("fullName");
          }}
          placeholder="As shown on your ID or passport "
          className={`mt-2 w-full rounded-lg border bg-sand px-4 py-3 text-sm text-ink ${
            errors.fullName ? "border-red-500" : "border-night/25"
          }`}
        />
        {errors.fullName && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.fullName}</p>
        )}
      </label>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-night">Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => {
              update("email", e.target.value);
              clearError("email");
            }}
            placeholder="you@example.com"
            className={`mt-2 w-full rounded-lg border bg-sand px-4 py-3 text-sm text-ink ${
              errors.email ? "border-red-500" : "border-night/25"
            }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email}</p>
          )}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-night">ID number</span>
          <input
            required
            value={form.idNumber}
            onChange={(e) => {
              update("idNumber", e.target.value);
              clearError("idNumber");
            }}
            placeholder="ID no."
            className={`mt-2 w-full rounded-lg border bg-sand px-4 py-3 text-sm text-ink ${
              errors.idNumber ? "border-red-500" : "border-night/25"
            }`}
          />
          {errors.idNumber && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.idNumber}</p>
          )}
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-night">Phone number</span>
        <div className="mt-2 flex gap-2">
          <select
            value={form.phoneCountry}
            onChange={(e) => update("phoneCountry", e.target.value)}
            aria-label="Phone country code"
            className="w-[9.5rem] flex-none rounded-lg border border-night/25 bg-sand px-2 py-3 text-sm text-ink"
          >
            {phoneCountries.map((c) => (
              <option key={c.name} value={c.name}>
                {c.dialCode} {c.name}
              </option>
            ))}
          </select>
          <input
            required
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => {
              update("phone", e.target.value);
              clearError("phone");
            }}
            placeholder="7xx xxx xxx"
            className={`w-full rounded-lg border bg-sand px-4 py-3 text-sm text-ink ${
              errors.phone ? "border-red-500" : "border-night/25"
            }`}
          />
        </div>
        {errors.phone && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.phone}</p>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-night">Nationality</span>
        <select
          required
          value={form.nationality}
          onChange={(e) => {
            update("nationality", e.target.value);
            clearError("nationality");
          }}
          className={`mt-2 w-full rounded-lg border bg-sand px-4 py-3 text-sm text-ink ${
            errors.nationality ? "border-red-500" : "border-night/25"
          }`}
        >
          <option value="">Select your nationality</option>
          {eligibleApplicantCountries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.nationality && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.nationality}</p>
        )}
      </label>

      <div className="block">
        <span className="text-sm font-medium text-night">Passport photo</span>
        <p className="mt-1 text-xs text-ink/60">
          A recent, colour passport photo on a white background. JPG
          or PNG, up to {maxPhotoMb}MB.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handlePhotoFile(e.target.files?.[0])}
          className="hidden"
          id="passport-photo-input"
        />

        {passportPreview ? (
          <div className="mt-3 flex items-center gap-4 rounded-lg border border-night/15 bg-sand p-4">
            <img
              src={passportPreview}
              alt="Passport photo preview"
              className="h-20 w-20 flex-none rounded-md border border-night/10 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-night">
                {passportPhoto?.name}
              </p>
              <p className="text-xs text-ink/60">
                {passportPhoto ? `${(passportPhoto.size / (1024 * 1024)).toFixed(1)}MB` : ""}
              </p>
              <div className="mt-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-teal-dark underline decoration-teal/40 underline-offset-4 hover:text-teal"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="text-xs font-semibold text-ink/60 underline decoration-ink/20 underline-offset-4 hover:text-night"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <label
            htmlFor="passport-photo-input"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingPhoto(true);
            }}
            onDragLeave={() => setIsDraggingPhoto(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingPhoto(false);
              handlePhotoFile(e.dataTransfer.files?.[0]);
            }}
            className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition ${
              isDraggingPhoto
                ? "border-teal bg-teal/5"
                : errors.passportPhoto
                  ? "border-red-400 bg-red-50/40"
                  : "border-night/20 bg-sand hover:border-teal/50"
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal-dark">
              ↑
            </span>
            <span className="text-sm font-medium text-night">
              Click to upload, or drag and drop
            </span>
            <span className="text-xs text-ink/55">JPG or PNG, up to {maxPhotoMb}MB</span>
          </label>
        )}

        {errors.passportPhoto && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.passportPhoto}</p>
        )}
      </div>
    </div>
  );
}
