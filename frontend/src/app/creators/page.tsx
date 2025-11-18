import Link from 'next/link';

const CreatorsPage = () => {
  const highlights = [
    'Choose which pages AIs can read and which stay private.',
    'Turn AI reads into paid, logged access using the same rules that control what they can see.',
    'See which AI crawlers actually visit your site and what they read.',
    'Decide page by page which parts of your site are open to AI crawlers.',
    'Protect your site from noisy crawlers with simple speed limits.',
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 space-y-10">
      <section className="space-y-8 text-white">
        <div className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
          <div className="mx-auto max-w-3xl space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">For creators &amp; publishers</p>
            <h1 className="text-3xl font-semibold">FairCrawl for creators &amp; publishers</h1>
            <p className="text-base leading-relaxed text-white/80">
              Decide what AIs can read, keep drafts private, and see every AI crawler that touches your work.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 flex flex-col text-white">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">What you control</h2>
              <p className="text-sm text-white/70">
                Share the parts of your site that help you grow, throttle AI crawlers when traffic spikes, and keep private areas off limits.
              </p>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Visibility</span>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">/blog/*</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Protected</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">/drafts/*</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Speed</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">5 req/sec</span>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-100">
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-6 flex flex-wrap gap-4">
              <Link
                href="/signup?role=publisher"
                className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Get started as a creator
              </Link>
              <Link href="/directory" className="rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                Browse AI-ready sites
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 flex flex-col text-white">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Turn crawlers into paid feeds</h2>
              <p className="text-sm text-white/70">
                Today, AIs read your work for free and you rarely see it. With FairCrawl, the same rules that say what’s open and what’s private also set what they pay. When crawlers hit your site through FairCrawl, those rules apply in real time, so large readers get a controlled, logged feed instead of scraping in the dark.
              </p>
            </div>
            <div className="mt-auto pt-6 flex flex-wrap gap-4">
              <Link
                href="/signup?role=publisher"
                className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Get started as a creator
              </Link>
              <Link href="/directory" className="rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                Browse AI-ready sites
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 flex flex-col text-white">
            <h3 className="text-lg font-semibold text-slate-50">See who’s reading you</h3>
            <p className="mt-3 text-sm text-slate-200">
              FairCrawl gives you a shared log of AI access. You see which crawlers hit which paths, how often, and on what terms. That log underpins payouts, audits, and disputes so you can prove how your work was used.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>Track reads per crawler, path, and time.</li>
              <li>Export logs for billing, analytics, and rights management.</li>
              <li>Give AI teams a single source of truth for usage.</li>
            </ul>

            <div className="mt-auto pt-6 flex flex-wrap gap-4">
              <Link
                href="/signup?role=publisher"
                className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Get started as a creator
              </Link>
              <Link href="/directory" className="rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                Browse AI-ready sites
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CreatorsPage;
