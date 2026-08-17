import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SubmittingScreen() {
  return (
    <>
      <Header />
      <main className="bg-sand">
        <section className="mx-auto max-w-xl px-5 py-24 text-center sm:px-8">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-night/10 border-t-teal" />
          <p className="mt-6 font-display text-lg font-semibold text-night">
            Submitting your Freelance Visa application…
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
