import { SubpageHero } from '../../components/marketing/SubpageHero';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';
import { MarketingCard } from '../../components/ui/MarketingCard';

const CreatorsPage = () => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="space-y-12 md:space-y-16">
        <SubpageHero
          eyebrow="For creators & publishers"
          title="FairFetch for creators & publishers"
          description="Set rules per path, see which AI clients read your work, and turn AI training into income."
        />

        <div className="grid items-stretch gap-6 md:grid-cols-3">
          <MarketingCard className="flex min-h-[320px] flex-col text-white">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-50">What you control</h3>
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
              <p className="text-sm text-white/70">
                Set rules per path so /blog/* is open, /drafts/* stay private, and /premium/* is paid only. Decide exactly what AI can read and how fast each client can go.
              </p>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full flex-col justify-center text-white">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-50">Turn clients into paid feeds</h3>
              <ul className="space-y-3">
                {[
                  'Stop AIs reading your work for free.',
                  'Use one rule set to decide what’s open, what’s premium, and what each AI team pays.',
                  'When clients use FairFetch, they get a controlled, logged feed instead of requesting around your site.',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-400" />
                    <p className="text-sm text-slate-200">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full flex-col justify-center text-white">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-50">See who’s reading you</h3>
              <ul className="space-y-3">
                {[
                  'See which clients hit which paths, how often, and what they read.',
                  'Use a shared log as the source of truth for audits, payouts, and disputes.',
                  'Give AI teams and publishers the same record of how your work was used.',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-400" />
                    <p className="text-sm text-slate-200">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </MarketingCard>
        </div>

        <div className="flex flex-wrap justify-end gap-4 pt-4">
          <PrimaryButton href="/signup?role=publisher">Get started as a creator</PrimaryButton>
          <SecondaryButton href="/directory">Browse AI-ready sites</SecondaryButton>
        </div>
      </div>
    </main>
  );
};

export default CreatorsPage;
