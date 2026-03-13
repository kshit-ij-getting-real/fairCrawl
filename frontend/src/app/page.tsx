import React from 'react';
import { MarketingSection } from '../components/marketing/MarketingSection';
import { MarketingCard } from '../components/ui/MarketingCard';
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons';
import { SectionEyebrow } from '../components/ui/SectionEyebrow';

const heroHighlights = [
  {
    title: 'Control access',
    body:
      'Choose which parts of your site AI can reach. Keep public pages open, protect drafts, and meter premium paths.',
  },
  {
    title: 'Track usage',
    body:
      'See which AI teams accessed your content, which domains they touched, and how request traffic changes over time.',
  },
  {
    title: 'Earn from your work',
    body:
      'Turn licensed AI access into a paid lane with clear pricing, visible logs, and predictable payouts.',
  },
];

const trustedBy = ['OpenAI-ready', 'Anthropic-ready', 'Licensed feeds', 'Publisher rules'];

export default function Page() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(175,164,255,0.18),transparent_24%),linear-gradient(180deg,#fcfcff_0%,#f7f7fc_48%,#f3f4fb_100%)] text-[#30386f]">
      <MarketingSection className="pb-20 pt-10 md:pt-14">
        <section className="relative overflow-hidden rounded-[40px] border border-[rgba(124,131,214,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,248,255,0.92))] px-6 py-6 shadow-[0_34px_90px_rgba(127,119,214,0.16)] backdrop-blur-xl md:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(170,159,255,0.28),transparent_64%)]" />

          <div className="relative overflow-hidden rounded-[28px] border border-[rgba(126,135,212,0.18)] bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(244,242,255,0.96)_48%,rgba(249,246,255,0.94)_100%)] px-6 py-8 shadow-[0_32px_70px_rgba(126,119,213,0.18)] md:px-8 md:py-10">
            <div className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(118,123,238,0.22),transparent_70%)] blur-2xl" />
            <div className="absolute right-0 top-0 h-64 w-72 rounded-bl-[120px] bg-[radial-gradient(circle_at_top_right,rgba(216,106,243,0.2),rgba(115,124,233,0.18)_36%,transparent_72%)]" />
            <div className="absolute left-10 top-0 h-10 w-20 rounded-b-[24px] bg-[rgba(126,135,212,0.14)] blur-[1px]" />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-center">
              <div className="max-w-xl space-y-5">
                <SectionEyebrow className="mb-0 text-[#6f77c8]">FairFetch for creators &amp; publishers</SectionEyebrow>
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(115,124,233,0.18)] bg-[rgba(255,255,255,0.72)] px-3 py-1 text-xs font-semibold tracking-wide text-[#5a63cf] shadow-[0_10px_20px_rgba(126,119,213,0.1)]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#7df0c8]" />
                  Licensed AI access, visible by default
                </div>
                <h1 className="max-w-lg text-4xl font-semibold leading-[1.02] text-[#25306d] md:text-5xl lg:text-[3.6rem]">
                  Turn AI traffic into
                  <span className="bg-gradient-to-r from-[#535dd9] to-[#cf67f3] bg-clip-text text-transparent"> paid access </span>
                  with clear rules.
                </h1>
                <p className="max-w-lg text-sm leading-7 text-[#7980a8] md:text-base">
                  FairFetch gives publishers one control layer for pricing, permissions, and observability, so AI teams can
                  fetch licensed content without guesswork and creators can see exactly what happened.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <PrimaryButton
                    href="/signup"
                    className="shadow-[0_16px_30px_rgba(103,109,240,0.24)]"
                  >
                    Get started
                  </PrimaryButton>
                  <SecondaryButton
                    href="/how-it-works"
                    className="border-[rgba(126,135,212,0.24)] bg-[rgba(255,255,255,0.72)] text-[#5560d8] hover:border-[rgba(126,135,212,0.36)] hover:bg-white"
                  >
                    See how FairFetch works
                  </SecondaryButton>
                </div>
                <div className="grid max-w-md gap-2 pt-5 text-xs text-[#6f769b] sm:grid-cols-2">
                  <div className="rounded-2xl border border-[rgba(126,135,212,0.16)] bg-[rgba(255,255,255,0.62)] px-4 py-3 shadow-[0_12px_24px_rgba(126,119,213,0.08)]">
                    <p className="font-semibold text-[#2b3470]">Publisher controls</p>
                    <p className="mt-1">Allow, meter, or block by path.</p>
                  </div>
                  <div className="rounded-2xl border border-[rgba(126,135,212,0.16)] bg-[rgba(255,255,255,0.62)] px-4 py-3 shadow-[0_12px_24px_rgba(126,119,213,0.08)]">
                    <p className="font-semibold text-[#2b3470]">Shared request logs</p>
                    <p className="mt-1">Audit who accessed what and when.</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[430px] pb-4 pt-6 lg:mx-0">
                <div className="absolute left-6 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28),transparent_68%)] blur-xl" />
                <div className="relative rounded-[30px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,238,255,0.9))] p-4 shadow-[0_28px_60px_rgba(26,13,84,0.28)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f84ab]">Today&apos;s volume</p>
                      <p className="text-4xl font-semibold text-[#262f6a]">542</p>
                    </div>
                    <div className="rounded-2xl bg-[rgba(106,112,239,0.12)] px-4 py-3 text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#6970d4]">Licenses</p>
                      <p className="mt-1 text-xl font-semibold text-[#3f49aa]">14 active</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-[24px] bg-[linear-gradient(135deg,#ffffff,#f4f3ff)] p-4 shadow-[0_16px_32px_rgba(135,128,218,0.14)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#2d376f]">Access mix</p>
                          <p className="mt-1 text-xs text-[#7b82a8]">Last 24 hours across all mapped domains</p>
                        </div>
                        <span className="rounded-full bg-[rgba(87,208,176,0.14)] px-3 py-1 text-xs font-semibold text-[#0f8967]">Healthy</span>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs text-[#7078a0]">
                            <span>Allowed</span>
                            <span>62%</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#eaecfb]">
                            <div className="h-2 w-[62%] rounded-full bg-gradient-to-r from-[#4f58da] to-[#837df5]" />
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs text-[#7078a0]">
                            <span>Metered</span>
                            <span>24%</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#eaecfb]">
                            <div className="h-2 w-[24%] rounded-full bg-gradient-to-r from-[#d56af8] to-[#f59cc8]" />
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs text-[#7078a0]">
                            <span>Blocked</span>
                            <span>14%</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#eaecfb]">
                            <div className="h-2 w-[14%] rounded-full bg-gradient-to-r from-[#8a8fb4] to-[#b7b9ca]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end gap-3">
                      <div className="flex-1 rounded-[24px] bg-[linear-gradient(135deg,#ffffff,#f7f5ff)] p-4 shadow-[0_16px_32px_rgba(135,128,218,0.14)]">
                        <p className="text-sm font-semibold text-[#2d376f]">Top domain</p>
                        <p className="mt-2 text-lg font-semibold text-[#4d57d5]">newsroom.example</p>
                        <p className="mt-1 text-xs text-[#7b82a8]">181 licensed fetches today</p>
                      </div>
                      <div className="w-[160px] rounded-[24px] bg-gradient-to-br from-[#5f67e3] to-[#b064f2] p-4 text-white shadow-[0_18px_36px_rgba(94,98,224,0.24)]">
                        <p className="text-xs uppercase tracking-wide text-white/70">Active AI teams</p>
                        <div className="mt-3 flex -space-x-2">
                          {['OA', 'AN', 'GG', 'AM'].map((label) => (
                            <span
                              key={label}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/60 bg-white/18 text-xs font-semibold"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 text-sm font-semibold">4 mapped clients</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-1 left-4 rounded-2xl border border-white/35 bg-white/[0.82] px-4 py-3 shadow-[0_18px_36px_rgba(124,117,212,0.18)] backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-wide text-[#7c83ab]">Usage growth</p>
                  <p className="mt-1 text-xl font-semibold text-[#2b3470]">+28.5%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-[rgba(126,135,212,0.16)] bg-[rgba(255,255,255,0.68)] px-5 py-4 shadow-[0_16px_30px_rgba(126,120,210,0.1)] backdrop-blur-xl">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a80a6]">Trusted workflow</span>
              {trustedBy.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[rgba(126,135,212,0.14)] bg-white px-3 py-1 text-sm font-medium text-[#4d56c9]"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="text-sm leading-7 text-[#7a80a6] lg:pl-6">
              FairFetch gives one clean surface for identity, pricing, and request logs so publishers and AI teams can work from the same record.
            </p>
          </div>
        </section>

        <div className="grid gap-6 pt-4 md:grid-cols-3">
          {heroHighlights.map((item) => (
            <MarketingCard key={item.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-[#293371]">{item.title}</h3>
              <p className="text-sm leading-7 text-[#7580a6]">{item.body}</p>
            </MarketingCard>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <MarketingCard className="flex min-h-[260px] flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(240,242,255,0.8))]">
            <div className="space-y-3">
              <SectionEyebrow className="text-[#6a72d6]">For creators &amp; publishers</SectionEyebrow>
              <h2 className="text-xl font-semibold text-[#25306d]">Create for AI, stay in control</h2>
              <p className="text-sm leading-7 text-[#7680a8]">
                Choose what AI can read, keep the rest private, and charge for the parts that matter. FairFetch turns premium content into a licensed feed for AI teams.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <PrimaryButton href="/creators" className="px-5">
                Learn more
              </PrimaryButton>
            </div>
          </MarketingCard>

          <MarketingCard className="flex min-h-[260px] flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(247,242,255,0.8))]">
            <div className="space-y-3">
              <SectionEyebrow className="text-[#6a72d6]">For AI teams</SectionEyebrow>
              <h2 className="text-xl font-semibold text-[#25306d]">Source the best data, without guesswork</h2>
              <p className="text-sm leading-7 text-[#7680a8]">
                Use one gateway where every site&apos;s access rules and pricing are clear. Get predictable, licensed access to high-quality content.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <PrimaryButton href="/ai-teams" className="px-5">
                Learn more
              </PrimaryButton>
            </div>
          </MarketingCard>

          <MarketingCard className="flex min-h-[260px] flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(242,245,255,0.8))]">
            <div className="space-y-3">
              <SectionEyebrow className="text-[#6a72d6]">Vision</SectionEyebrow>
              <h2 className="text-xl font-semibold text-[#25306d]">Our vision: a fair web for AI</h2>
              <p className="text-sm leading-7 text-[#7680a8]">
                AI is becoming the web&apos;s main reader. FairFetch turns that traffic into a transparent marketplace where AI companies pay creators directly.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <PrimaryButton href="/vision" className="px-5">
                Read the vision
              </PrimaryButton>
            </div>
          </MarketingCard>

          <MarketingCard className="flex min-h-[260px] flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(247,244,255,0.8))]">
            <div className="space-y-3">
              <SectionEyebrow className="text-[#6a72d6]">Directory</SectionEyebrow>
              <h2 className="text-xl font-semibold text-[#25306d]">Verified AI-ready sites</h2>
              <p className="text-sm leading-7 text-[#7680a8]">
                Browse sites with verified ownership and published AI access rules through FairFetch as strong defaults for permissioned data.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <PrimaryButton href="/directory" className="px-5">
                View directory
              </PrimaryButton>
            </div>
          </MarketingCard>
        </div>
      </MarketingSection>
    </div>
  );
}
