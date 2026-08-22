"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { destinations, PROCESSING_FEE_LABEL, DEFAULT_PHONE_COUNTRY, USD_TO_KES_RATE } from "@/lib/data";
import { validatePhone, validateIdNumber } from "@/lib/validation";

import { FormErrors, FormState, Stage, formatInternationalPhone } from "./_components/types";
import StepIndicator from "./_components/StepIndicator";
import ApplicantDetailsStep from "./_components/ApplicantDetailsStep";
import AddressDocumentsStep from "./_components/AddressDocumentsStep";
import PaymentStep, { PaymentState } from "./_components/PaymentStep";
import ReviewStep from "./_components/ReviewStep";
import FormNavigation from "./_components/FormNavigation";
import SubmittingScreen from "./_components/SubmittingScreen";
import InvoiceReceipt from "./_components/InvoiceReceipt";

const steps = ["Applicant details", "Address & documents", "Payment", "Review & submit"];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? result);
    };
    reader.onerror = () => (reader.error ?? new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<Stage>("form");

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    phoneCountry: DEFAULT_PHONE_COUNTRY,
    idNumber: "",
    nationality: "",
    destination: destinations[0].code,
    state: "",
    travelDate: "",
    purpose: "Hybrid (remote + onsite)",
    street: "",
    city: "",
    zip: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

  // Payment (STK push) state
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const [transactionReceipt, setTransactionReceipt] = useState<string | null>(null);

  // Final submit
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Revoke the object URL when it's replaced or the component unmounts, so we don't leak memory.
  useEffect(() => {
    return () => {
      if (passportPreview) URL.revokeObjectURL(passportPreview);
    };
  }, [passportPreview]);

  const MAX_PHOTO_MB = 5;
  const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png"];

  function handlePhotoFile(file: File | undefined | null) {
    if (!file) return;
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, passportPhoto: "Upload a JPG or PNG file." }));
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, passportPhoto: `File must be under ${MAX_PHOTO_MB}MB.` }));
      return;
    }
    setErrors((prev) => ({ ...prev, passportPhoto: undefined }));
    if (passportPreview) URL.revokeObjectURL(passportPreview);
    setPassportPhoto(file);
    setPassportPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    if (passportPreview) URL.revokeObjectURL(passportPreview);
    setPassportPhoto(null);
    setPassportPreview(null);
    setErrors((prev) => ({ ...prev, passportPhoto: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function clearError(key: keyof FormErrors) {
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const destination = destinations.find((c) => c.code === form.destination)!;
  const isAustralia = destination.code === "AU";
  const paymentConfirmed = paymentState === "paid";

  const [invoiceNumber] = useState(
    () => "INV-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000)
  );
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateStep0() {
    const phoneError = validatePhone(form.phone);
    const idError = validateIdNumber(form.idNumber);
    const photoError = passportPhoto ? undefined : "Upload a passport photo to continue.";
    const fullNameError = form.fullName.trim() ? undefined : "Enter your full name.";
    const emailError = !form.email.trim()
      ? "Enter your email."
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ? undefined
        : "Enter a valid email address.";
    const nationalityError = form.nationality ? undefined : "Select your nationality.";

    if (phoneError || idError || photoError || fullNameError || emailError || nationalityError) {
      setErrors({
        fullName: fullNameError,
        email: emailError,
        phone: phoneError ?? undefined,
        idNumber: idError ?? undefined,
        nationality: nationalityError,
        passportPhoto: photoError,
      });
      return false;
    }
    setErrors({});
    return true;
  }

  function validateStep1() {
    if (isAustralia && !form.state) {
      setErrors((prev) => ({ ...prev, state: "Select a state or territory." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, state: undefined }));
    return true;
  }

  function next() {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !paymentConfirmed) return; // must confirm payment to leave payment step
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function makePayment() {
    setPaymentError(null);
    setPaymentState("initiating");
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phoneCountry: form.phoneCountry,
          phone: form.phone,
          idNumber: form.idNumber,
          nationality: form.nationality,
          destinationCode: form.destination,
          street: form.street,
          city: form.city,
          zip: form.zip,
          state: form.state,
          travelDate: form.travelDate,
          purpose: form.purpose,
        }),
      });
      const data = (await res.json()) as { referenceCode?: string; error?: string };
      if (!res.ok || !data.referenceCode) throw new Error(data.error || "Could not start payment.");
      setReferenceCode(data.referenceCode);
      setPaymentState("awaiting_payment");
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Could not start payment.");
      setPaymentState("failed");
    }
  }

  // Poll for the STK push result while we're waiting on it.
  useEffect(() => {
    if (paymentState !== "awaiting_payment" || !referenceCode) return;
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/payment/status?ref=${encodeURIComponent(referenceCode!)}`);
        const data = (await res.json()) as {
          status?: string;
          transactionReceipt?: string | null;
          responseDescription?: string | null;
        };
        if (cancelled) return;
        if (data.status === "paid" || data.status === "submitted") {
          setTransactionReceipt(data.transactionReceipt ?? null);
          setPaymentState("paid");
        } else if (data.status === "payment_failed") {
          setPaymentError(data.responseDescription || "The payment attempt failed.");
          setPaymentState("failed");
        } else if (data.status === "payment_cancelled") {
          setPaymentState("cancelled");
        }
        // otherwise still awaiting_payment — keep polling
      } catch {
        // network hiccup — try again on the next tick
      }
    }

    poll();
    const interval = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [paymentState, referenceCode]);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (step !== steps.length - 1) return;
    if (!paymentConfirmed || !referenceCode) return;

    setSubmitError(null);
    setStage("submitting");

    try {
      const passportPhotoPayload = passportPhoto
        ? { filename: passportPhoto.name, contentBase64: await fileToBase64(passportPhoto) }
        : null;

      const res = await fetch("/api/application/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceCode, passportPhoto: passportPhotoPayload }),
      });
      const data = (await res.json()) as { transactionReceipt?: string | null; error?: string };
      if (!res.ok) throw new Error(data.error || "Could not submit your application.");
      if (data.transactionReceipt) setTransactionReceipt(data.transactionReceipt);
      setStage("paid");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit your application. Please try again.");
      setStage("form");
    }
  }

  // ---------- PAID / INVOICE ----------
  if (stage === "paid" && referenceCode) {
    return (
      <InvoiceReceipt
        form={form}
        destination={destination}
        isAustralia={isAustralia}
        refNumber={referenceCode}
        invoiceNumber={invoiceNumber}
        today={today}
        transactionReceipt={transactionReceipt}
        processingFeeLabel={PROCESSING_FEE_LABEL}
      />
    );
  }

  // ---------- SUBMITTING ----------
  if (stage === "submitting") {
    return <SubmittingScreen />;
  }

  // ---------- FORM ----------
  return (
    <>
      <Header />
      <main className="bg-sand">
        <section className="border-b border-night/10 bg-night text-sand">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-8 sm:py-16">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
              Application
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Apply for your Freelance Visa
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-sand/70 sm:text-base">
              Pay the processing fee, then submit — your Freelance Visa
              application moves into the queue right after.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
          <StepIndicator steps={steps} currentStep={step} />

          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-2xl border border-night/10 bg-white p-6 shadow-sm sm:p-8"
          >
            {step === 0 && (
              <ApplicantDetailsStep
                form={form}
                errors={errors}
                update={update}
                clearError={clearError}
                passportPhoto={passportPhoto}
                passportPreview={passportPreview}
                fileInputRef={fileInputRef}
                isDraggingPhoto={isDraggingPhoto}
                setIsDraggingPhoto={setIsDraggingPhoto}
                handlePhotoFile={handlePhotoFile}
                removePhoto={removePhoto}
                maxPhotoMb={MAX_PHOTO_MB}
              />
            )}

            {step === 1 && (
              <AddressDocumentsStep
                form={form}
                errors={errors}
                update={update}
                clearError={clearError}
                destination={destination}
                isAustralia={isAustralia}
              />
            )}

            {step === 2 && (
              <PaymentStep
                destination={destination}
                usdToKesRate={USD_TO_KES_RATE}
                phoneDisplay={formatInternationalPhone(form.phoneCountry, form.phone)}
                paymentState={paymentState}
                errorMessage={paymentError}
                onMakePayment={makePayment}
              />
            )}

            {step === 3 && (
              <ReviewStep
                form={form}
                destination={destination}
                isAustralia={isAustralia}
                passportPreview={passportPreview}
                processingFeeLabel={PROCESSING_FEE_LABEL}
                referenceCode={referenceCode}
                submitError={submitError}
                onEditStep={setStep}
              />
            )}

            <FormNavigation
              step={step}
              totalSteps={steps.length}
              paymentConfirmed={paymentConfirmed}
              onBack={back}
              onNext={next}
              onSubmit={submit}
            />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
