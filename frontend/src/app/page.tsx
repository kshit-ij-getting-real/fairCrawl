import Link from 'next/link';

import { MarketingCard } from '../components/ui/MarketingCard';

const heroHighlights = [
  {
    title: 'Control access',
    body:
      'Choose which parts of your site AI can reach. Keep some pages open, mark others as premium (paid), and block anything sensitive. You stay in control.',
  },
  {
    title: 'Track usage',
    body:
      'See what’s happening in real time. FairMarket shows you which AI teams accessed your content, what they looked at, and how often.',
  },
  {
    title: 'Earn from your work',
    body:
      'Turn your best content into a steady income stream. When an AI needs your premium material, it pays the price you set, and you see the earnings inside FairMarket.',
  },
];

const Page = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <section>
        <div className="rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg text-white flex flex-col gap-10 lg:flex-row lg:items-stretch lg:py-10">
          <div className="flex flex-1 flex-col justify-between gap-6 text-white">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Paid AI access, on your terms
              </div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Get paid when AI uses your content</h1>
              <p className="text-lg leading-relaxed text-white/80">
                FairMarket is a marketplace where creators license their paywalled and premium content to AI companies. You choose what AI can see on your site, set your own prices, and get paid whenever your work is used.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-white/70">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Get started
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium text-white/80 hover:text-white">
                See how FairMarket works
              </Link>
            </div>
          </div>

          <div className="flex flex-1 items-stretch">
            <div className="flex h-full w-full flex-col gap-6 rounded-3xl bg-slate-950/70 border border-slate-800/80 p-6 text-white lg:p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Gateway snapshot</h2>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">Live monitor</span>
              </div>
              <p className="text-sm text-white/70">
                Every AI request goes through FairMarket, is checked against your rules, and comes back with a clear “allow”, “paid”, or “block”.
              </p>
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span className="font-semibold">Allowed paths: /blog/*</span>
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200">allowed</span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">AI crawler atlas-research.ai · Allowed at 5 req/sec</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span className="font-semibold">Blocked: /drafts/*</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">blocked</span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">AI crawler unknown · Blocked by publisher rules</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span className="font-semibold">Metered: /premium/*</span>
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-100">metered</span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">AI crawler lumenai · Requests logged for payouts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="grid gap-8 md:grid-cols-2">
          <MarketingCard className="flex h-full flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
                <span>CREATORS</span>
              </div>
              <h2 className="text-xl font-semibold">Create for AI, stay in control</h2>
              <p className="text-sm text-white/70">
                Choose what AI can read, keep the rest private, and charge for the parts that matter. FairMarket turns your paywalled and premium content into a licensed feed for AI teams.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Link
                href="/creators"
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Learn more
              </Link>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
                <span>AI TEAMS</span>
              </div>
              <h2 className="text-xl font-semibold">Source the best data, without guesswork</h2>
              <p className="text-sm text-white/70">
                Use one gateway where every site’s access rules and pricing are clear. Get predictable, licensed access to high-quality content instead of scraping around random blocks.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Link
                href="/ai-teams"
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Learn more
              </Link>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
                <span>VISION</span>
              </div>
              <h2 className="text-xl font-semibold">Our vision: a fair web for AI</h2>
              <p className="text-sm text-white/70">
                AI is becoming the web’s main reader. FairMarket turns that traffic into a transparent marketplace where AI companies pay creators directly for the work that trains their models.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Link
                href="/vision"
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Read the vision
              </Link>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
                <span>DIRECTORY</span>
              </div>
              <h2 className="text-xl font-semibold">Verified AI-ready sites</h2>
              <p className="text-sm text-white/70">
                Browse sites that have verified ownership and published AI access rules through FairMarket. They’re safe defaults when you want high-quality, permissioned training data.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Link
                href="/directory"
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                View directory
              </Link>
            </div>
          </MarketingCard>
        </div>
      </section>
    </div>
  );
};

export default Page;
