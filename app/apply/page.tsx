"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { destinations, PROCESSING_FEE_LABEL, MPESA_TILL_NUMBER } from "@/lib/data";
import { validatePhone, validateIdNumber } from "@/lib/validation";

import { FormErrors, FormState, Stage } from "./_components/types";
import StepIndicator from "./_components/StepIndicator";
import ApplicantDetailsStep from "./_components/ApplicantDetailsStep";
import AddressDocumentsStep from "./_components/AddressDocumentsStep";
import PaymentStep from "./_components/PaymentStep";
import ReviewStep from "./_components/ReviewStep";
import FormNavigation from "./_components/FormNavigation";
import SubmittingScreen from "./_components/SubmittingScreen";
import InvoiceReceipt from "./_components/InvoiceReceipt";

const steps = ["Applicant details", "Address & documents", "Payment", "Review & submit"];

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<Stage>("form");
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    nationality: "",
    destination: destinations[0].code,
    state: "",
    travelDate: "",
    purpose: "Hybrid (online + onsite)",
    street: "",
    city: "",
    zip: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

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

  const [refNumber] = useState(
    () => "FLV-" + Math.floor(100000 + Math.random() * 900000)
  );
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
    const nationalityError = form.nationality.trim() ? undefined : "Enter your nationality.";

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

  function confirmPayment() {
    setConfirmingPayment(true);
    setTimeout(() => {
      setConfirmingPayment(false);
      setPaymentConfirmed(true);
    }, 1300);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!paymentConfirmed) return;
    setStage("submitting");
    setTimeout(() => setStage("paid"), 1200);
  }

  // ---------- PAID / INVOICE ----------
  if (stage === "paid") {
    return (
      <InvoiceReceipt
        form={form}
        destination={destination}
        isAustralia={isAustralia}
        refNumber={refNumber}
        invoiceNumber={invoiceNumber}
        today={today}
        mpesaTillNumber={MPESA_TILL_NUMBER}
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
            onSubmit={step === steps.length - 1 ? submit : (e) => e.preventDefault()}
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
                mpesaTillNumber={MPESA_TILL_NUMBER}
                paymentConfirmed={paymentConfirmed}
                confirmingPayment={confirmingPayment}
                onConfirmPayment={confirmPayment}
              />
            )}

            {step === 3 && (
              <ReviewStep
                form={form}
                destination={destination}
                isAustralia={isAustralia}
                passportPreview={passportPreview}
                processingFeeLabel={PROCESSING_FEE_LABEL}
                onEditStep={setStep}
              />
            )}

            <FormNavigation
              step={step}
              totalSteps={steps.length}
              paymentConfirmed={paymentConfirmed}
              onBack={back}
              onNext={next}
            />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
