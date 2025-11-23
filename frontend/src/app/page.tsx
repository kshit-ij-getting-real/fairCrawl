import React from 'react';
import { MarketingCard } from '../components/ui/MarketingCard';
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons';
import { SectionEyebrow } from '../components/ui/SectionEyebrow';

const heroHighlights = [
  {
    title: 'Control access',
    body:
      'Choose which parts of your site AI can reach. Keep some pages open, mark others as premium, and block anything sensitive.',
  },
  {
    title: 'Track usage',
    body:
      'See who’s reading you in real time. FairFetch logs which AI teams access your content and how often.',
  },
  {
    title: 'Earn from your work',
    body:
      'Set a price on your premium content. When AI teams use it, FairFetch turns those reads into earnings.',
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <section>
        <div className="rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 text-white shadow-lg lg:p-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            <div className="flex flex-1 flex-col justify-between gap-6">
              <div className="space-y-4">
                <SectionEyebrow className="text-white/70">Paid AI access, on your terms</SectionEyebrow>
                <h1 className="text-4xl font-bold leading-tight md:text-5xl">Get paid when AI uses your content</h1>
                <p className="mt-4 max-w-xl text-base text-slate-200">
                  FairFetch is a marketplace where creators license their paywalled and premium content to AI companies.
                  <span className="block">
                    You choose what AI can see on your site, set your own prices, and get paid whenever your work is used.
                  </span>
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {heroHighlights.map((item) => (
                    <div
                      key={item.title}
                      className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-snug"
                    >
                      <h3 className="mb-1 font-semibold text-slate-50">{item.title}</h3>
                      <p className="text-slate-200 text-sm">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <PrimaryButton href="/signup">Get started</PrimaryButton>
                <SecondaryButton href="/how-it-works">See how FairFetch works</SecondaryButton>
              </div>
            </div>

            <div className="flex flex-1 items-stretch">
              <div className="flex h-full w-full flex-col gap-6 rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 text-white lg:p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Gateway snapshot</h2>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
                    Live monitor
                  </span>
                </div>
              <p className="text-sm text-white/70">
                Every AI request goes through FairFetch, is checked against your rules, and comes back with a clear “allow”, “paid”, or “block”.
              </p>
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span className="font-semibold">Allowed paths: /blog/*</span>
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
                      allowed
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">AI crawler atlas-research.ai · Allowed at 5 req/sec</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span className="font-semibold">Blocked: /drafts/*</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      blocked
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">AI crawler unknown · Blocked by publisher rules</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span className="font-semibold">Metered: /premium/*</span>
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100">
                      metered
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">AI crawler lumenai · Requests logged for payouts</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="grid gap-8 md:grid-cols-2">
          <MarketingCard className="flex h-full min-h-[260px] flex-col justify-between">
            <div className="space-y-3">
              <SectionEyebrow className="text-blue-200">For creators &amp; publishers</SectionEyebrow>
              <h2 className="text-xl font-semibold">Create for AI, stay in control</h2>
              <p className="text-sm text-white/70">
                Choose what AI can read, keep the rest private, and charge for the parts that matter. FairFetch turns your paywalled and premium content into a licensed feed for AI teams.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <PrimaryButton href="/creators" className="px-4">
                Learn more
              </PrimaryButton>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full min-h-[260px] flex-col justify-between">
            <div className="space-y-3">
              <SectionEyebrow className="text-blue-200">For AI teams</SectionEyebrow>
              <h2 className="text-xl font-semibold">Source the best data, without guesswork</h2>
              <p className="text-sm text-white/70">
                Use one gateway where every site’s access rules and pricing are clear. Get predictable, licensed access to high-quality content instead of scraping around random blocks.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <PrimaryButton href="/ai-teams" className="px-4">
                Learn more
              </PrimaryButton>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full min-h-[260px] flex-col justify-between">
            <div className="space-y-3">
              <SectionEyebrow className="text-blue-200">Vision</SectionEyebrow>
              <h2 className="text-xl font-semibold">Our vision: a fair web for AI</h2>
              <p className="text-sm text-white/70">
                AI is becoming the web’s main reader. FairFetch turns that traffic into a transparent marketplace where AI companies pay creators directly for the work that trains their models.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <PrimaryButton href="/vision" className="px-4">
                Read the vision
              </PrimaryButton>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full min-h-[260px] flex-col justify-between">
            <div className="space-y-3">
              <SectionEyebrow className="text-blue-200">Directory</SectionEyebrow>
              <h2 className="text-xl font-semibold">Verified AI-ready sites</h2>
              <p className="text-sm text-white/70">
                Browse sites that have verified ownership and published AI access rules through FairFetch. They’re safe defaults when you want high-quality, permissioned training data.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <PrimaryButton href="/directory" className="px-4">
                View directory
              </PrimaryButton>
            </div>
          </MarketingCard>
        </div>
      </section>
    </div>
  );
}
