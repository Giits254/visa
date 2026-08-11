import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cancellationPolicy, PROCESSING_FEE_USD } from "@/lib/data";

export default function CancellationPolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-sand">
        <section className="border-b border-night/10 bg-night text-sand">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-8 sm:py-16">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
              Legal
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Cancellation Policy
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-sand/65 sm:text-base">
              How cancellations and refunds work for the ${PROCESSING_FEE_USD}{" "}
              Freelance Visa Processing Fee.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="space-y-8">
            {cancellationPolicy.map((item, i) => (
              <div key={item.title} className="flex gap-5">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-gold/40 font-mono text-xs font-medium text-gold-dark">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-night">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/65">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-night/10 bg-white/50 p-6 text-xs leading-relaxed text-ink/55 sm:p-8">
            This policy applies to the Freelance Visa Processing Fee only,
            not to third-party costs (courier, notarisation, translation)
            that may be incurred separately. This is a draft policy for
            review — final wording should be checked against local consumer
            protection requirements before publishing.
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
