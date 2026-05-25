import React from 'react';
import { MarketingSection } from '../components/marketing/MarketingSection';
import { MarketingCard } from '../components/ui/MarketingCard';
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons';
import { SectionEyebrow } from '../components/ui/SectionEyebrow';

const primitives = ['Discovery', 'Licensing', 'Pricing', 'Retrieval receipts', 'Usage logs', 'Provider controls'];

export default function Page() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(175,164,255,0.18),transparent_24%),linear-gradient(180deg,#fcfcff_0%,#f7f7fc_48%,#f3f4fb_100%)] text-[#30386f]">
      <MarketingSection className="space-y-8 pb-20 pt-10 md:pt-14">
        <MarketingCard className="space-y-6 p-8 md:p-10">
          <SectionEyebrow className="mb-0 text-[#6f77c8]">FairFetch for specialist research</SectionEyebrow>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] text-[#25306d] md:text-5xl lg:text-[3.4rem]">
            Specialist research for AI agents to discover, license, and retrieve.
          </h1>
          <p className="max-w-4xl text-sm leading-7 text-[#7980a8] md:text-base">
            FairFetch helps AI agents find and retrieve high-quality external research from independent equity research firms,
            market intelligence groups, pharma analysts, and other specialist knowledge providers with clear pricing,
            permissions, and logs.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <PrimaryButton href="/signup">List research</PrimaryButton>
            <SecondaryButton href="/how-it-works">Explore AI access</SecondaryButton>
          </div>
        </MarketingCard>

        <div className="grid gap-6 md:grid-cols-2">
          <MarketingCard>
            <h2 className="text-xl font-semibold text-[#25306d]">Why agents need FairFetch</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#7580a6]">
              <li>Web search is noisy and SEO-driven.</li>
              <li>Paywalled research is fragmented and hard for agents to procure.</li>
              <li>One-off licensing deals do not scale for long-tail specialist research.</li>
              <li>RAG/inference retrieval creates repeated demand, not just one-time training value.</li>
            </ul>
          </MarketingCard>
          <MarketingCard>
            <h2 className="text-xl font-semibold text-[#25306d]">How it works</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#7580a6]">
              <li>Research providers list content and terms.</li>
              <li>FairFetch makes sources discoverable and agent-readable.</li>
              <li>Agents retrieve licensed research through tokens/API.</li>
              <li>Both sides get logs, pricing, and receipts.</li>
            </ol>
          </MarketingCard>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <MarketingCard>
            <SectionEyebrow className="text-[#6a72d6]">Who it is for</SectionEyebrow>
            <p className="mt-2 text-sm leading-7 text-[#7680a8]"><strong>Research providers:</strong> equity research, market intelligence, pharma analysis, sector specialists.</p>
            <p className="mt-2 text-sm leading-7 text-[#7680a8]"><strong>AI teams:</strong> research copilots, enterprise agents, wealth agents, consulting agents.</p>
          </MarketingCard>
          <MarketingCard>
            <SectionEyebrow className="text-[#6a72d6]">Example query</SectionEyebrow>
            <p className="mt-2 text-sm leading-7 text-[#7680a8]">
              A wealth management agent is asked: “What is the best independent analysis on Indian Energy Exchange?”
              Instead of scraping recent SEO/news articles, it can compare specialist reports, pricing, license terms,
              and retrieve the best source through FairFetch.
            </p>
          </MarketingCard>
        </div>

        <MarketingCard>
          <SectionEyebrow className="text-[#6a72d6]">Marketplace primitives</SectionEyebrow>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {primitives.map((item) => (
              <div key={item} className="rounded-2xl border border-[rgba(126,135,212,0.16)] bg-white px-4 py-3 text-sm font-semibold text-[#2b3470]">{item}</div>
            ))}
          </div>
        </MarketingCard>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Research providers', 'List analyst notes, market reports, and specialist datasets with retrieval permissions and license terms.', '/creators'],
            ['AI teams', 'Find AI-ready specialist research, compare pricing and terms, and retrieve with receipts and logs.', '/ai-teams'],
            ['Directory', 'Explore sources such as IEX sector note, GLP-1 market map, and India power exchange analysis.', '/directory'],
          ].map(([title, body, href]) => (
            <MarketingCard key={title as string} className="flex min-h-[220px] flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#25306d]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#7680a8]">{body}</p>
              </div>
              <div className="pt-4"><PrimaryButton href={href as string}>Learn more</PrimaryButton></div>
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>
    </div>
  );
}
