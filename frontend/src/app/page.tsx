import React from 'react';
import { MarketingSection } from '../components/marketing/MarketingSection';
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
      'Track paid access with clear logs. FairFetch records which AI teams redeem tokens for your content and how often.',
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
      <MarketingSection>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          <MarketingCard className="flex h-full flex-col rounded-[32px] bg-gradient-to-r from-[#05081b] to-[#071539] px-6 py-8 text-white md:px-10 md:py-12 lg:px-12 lg:py-14">
            <div className="max-w-3xl space-y-4 md:space-y-5">
              <SectionEyebrow>FairFetch for creators &amp; publishers</SectionEyebrow>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                Paid AI access, on your terms
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl">
                Get paid when AI uses your content
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
                FairFetch is a marketplace where creators license their paywalled and premium content to AI companies.
                <span className="block">You choose what AI can see on your site, set your own prices, and get paid whenever your work is used.</span>
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <PrimaryButton href="/signup" className="px-4 py-2 text-sm">
                Get started
              </PrimaryButton>
              <SecondaryButton href="/how-it-works" className="px-4 py-2 text-sm">
                See how FairFetch works
              </SecondaryButton>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full flex-col gap-6 text-white lg:self-center">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold">Gateway snapshot</h2>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
                Live monitor
              </span>
            </div>
            <p className="text-sm text-slate-200">
              Every AI request goes through FairFetch, is checked against your rules, and comes back with a clear “allow”, “paid”, or “block”.
            </p>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white">
                  <span className="font-semibold">Allowed paths: /blog/*</span>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
                    allowed
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-300">AI client atlas-research.ai · Allowed at 5 req/sec</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white">
                  <span className="font-semibold">Not listed: /drafts/*</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    not listed
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-300">AI client unknown · Not listed by publisher rules</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white">
                  <span className="font-semibold">Metered: /premium/*</span>
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100">
                    metered
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-300">AI client lumenai · Requests logged for payouts</p>
              </div>
            </div>
          </MarketingCard>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {heroHighlights.map((item) => (
            <MarketingCard key={item.title} className="space-y-3 text-white">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-200">{item.body}</p>
            </MarketingCard>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <MarketingCard className="flex h-full min-h-[260px] flex-col justify-between">
            <div className="space-y-3">
              <SectionEyebrow className="text-blue-200">For creators &amp; publishers</SectionEyebrow>
              <h2 className="text-xl font-semibold">Create for AI, stay in control</h2>
              <p className="text-sm text-white/70">
                Choose what AI can read, keep the rest private, and charge for the parts that matter. FairFetch turns your paywalled and premium content into a licensed feed for AI teams.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
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
                Use one gateway where every site’s access rules and pricing are clear. Get predictable, licensed access to high-quality content instead of requesting around random blocks.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
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
                AI is becoming the web’s main reader. FairFetch turns that traffic into a transparent marketplace where AI companies pay creators directly for licensed access to their work.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
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
                Browse sites with verified ownership and published AI access rules through FairFetch. They are strong defaults when you want permissioned data with clear licensing terms.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <PrimaryButton href="/directory" className="px-4">
                View directory
              </PrimaryButton>
            </div>
          </MarketingCard>
        </div>
      </MarketingSection>
    </div>
  );
}
