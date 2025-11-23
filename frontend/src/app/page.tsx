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
    <div className="min-h-screen bg-[#020617] text-slate-50">
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 lg:px-0 lg:py-16">
        <section className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-r from-[#05081b] to-[#071539] border border-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] sm:text-sm">
            FairFetch for creators &amp; publishers
          </div>

          <div className="rounded-3xl bg-gradient-to-r from-[#05081b] to-[#071539] border border-white/5 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] md:p-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
              <div className="space-y-6">
                <div className="space-y-3">
                  <SectionEyebrow className="text-sky-200">Paid AI access, on your terms</SectionEyebrow>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[40px]">Get paid when AI uses your content</h1>
                  <p className="max-w-xl text-sm leading-relaxed text-slate-200/90">
                    FairFetch is a marketplace where creators license their paywalled and premium content to AI companies.
                    <span className="block">
                      You choose what AI can see on your site, set your own prices, and get paid whenever your work is used.
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <PrimaryButton href="/signup">Get started</PrimaryButton>
                  <SecondaryButton href="/how-it-works">See how FairFetch works</SecondaryButton>
                </div>
              </div>

              <MarketingCard className="flex h-full flex-col gap-6 text-white">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold">Gateway snapshot</h2>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
                    Live monitor
                  </span>
                </div>
                <p className="text-sm text-slate-200">
                  Every AI request goes through FairFetch, is checked against your rules, and comes back with a clear “allow”,
                  “paid”, or “block”.
                </p>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-sm text-white">
                      <span className="font-semibold">Allowed paths: /blog/*</span>
                      <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
                        allowed
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">AI crawler atlas-research.ai · Allowed at 5 req/sec</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-sm text-white">
                      <span className="font-semibold">Blocked: /drafts/*</span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        blocked
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">AI crawler unknown · Blocked by publisher rules</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-sm text-white">
                      <span className="font-semibold">Metered: /premium/*</span>
                      <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100">
                        metered
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">AI crawler lumenai · Requests logged for payouts</p>
                  </div>
                </div>
              </MarketingCard>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {heroHighlights.map((item) => (
                <MarketingCard key={item.title} className="flex h-full flex-col">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-slate-200">{item.body}</p>
                  </div>
                </MarketingCard>
              ))}
            </div>
          </div>
        </section>

        <section>
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
    </div>
  );
}
