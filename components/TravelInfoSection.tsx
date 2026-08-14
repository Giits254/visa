const info = [
  {
    title: "Best time to travel",
    detail:
      "November to March brings the mildest weather across the Gulf, with daytime temperatures around 20–28°C. June to September is very hot (often 40°C+), though indoor attractions and malls stay comfortable.",
  },
  {
    title: "Currency & costs",
    detail:
      "Most Gulf currencies (AED, SAR, QAR) are pegged to the US dollar, so exchange rates are stable. Carry a mix of cash and card — smaller towns outside major cities may prefer cash.",
  },
  {
    title: "Dress & customs",
    detail:
      "Modest dress is expected in public places, particularly during Ramadan. Shoulders and knees covered is a safe default; beachwear stays at beaches and pools.",
  },
  {
    title: "Getting around",
    detail:
      "Dubai, Doha and Riyadh have modern metro or ride-hailing networks. In smaller cities, taxis and car rentals are more reliable than public transport.",
  },
  {
    title: "Connectivity",
    detail:
      "Local SIM cards are inexpensive and available at the airport on arrival. Some VoIP calling apps are restricted in certain countries — check before you rely on them.",
  },
  {
    title: "Health & safety",
    detail:
      "Tap water is generally safe in major UAE and Qatari cities but bottled water is the norm. Gulf countries rank among the safest for travelers, with low rates of petty crime.",
  },
];

export default function TravelInfoSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-dark">
          Beyond the Freelance Visa
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-night sm:text-4xl">
          Living and working in the Gulf
        </h2>
        <p className="mt-4 text-ink/80">
          A Freelance Visa gets you through the border. Here&apos;s what&apos;s
          useful to know once you land and start working.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
        {info.map((item) => (
          <div key={item.title} className="flex gap-4">
            <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-gold" aria-hidden />
            <div>
              <h3 className="font-display text-base font-semibold text-night">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/75">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
