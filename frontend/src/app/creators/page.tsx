import { PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';

const CreatorsPage = () => {
  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-16">
      <section className="space-y-10 text-white">
        <div className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg lg:p-10">
          <div className="mx-auto max-w-3xl space-y-2">
            <SectionEyebrow className="text-white/70">For creators &amp; publishers</SectionEyebrow>
            <h1 className="text-3xl font-semibold md:text-4xl">FairFetch for creators &amp; publishers</h1>
            <p className="text-base leading-relaxed text-white/80">
              Set rules per path, see which AI crawlers read your work, and turn AI training into income.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex min-h-[320px] flex-col rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 text-white md:p-8">
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
                Set rules per path so /blog/* is open, /drafts/* stay private, and /premium/* is paid only. Decide exactly what AI can read and how fast each crawler can go.
              </p>
            </div>
          </div>

          <div className="flex min-h-[320px] flex-col rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 text-white md:p-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-50">Turn crawlers into paid feeds</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {[ 
                  'Stop AIs reading your work for free.',
                  'Use one rule set to decide what’s open, what’s premium, and what each AI team pays.',
                  'When crawlers use FairFetch, they get a controlled, logged feed instead of scraping around your site.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex min-h-[320px] flex-col rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 text-white md:p-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-50">See who’s reading you</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {[ 
                  'See which crawlers hit which paths, how often, and what they read.',
                  'Use a shared log as the source of truth for audits, payouts, and disputes.',
                  'Give AI teams and publishers the same record of how your work was used.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-4">
          <PrimaryButton href="/signup?role=publisher">Get started as a creator</PrimaryButton>
          <SecondaryButton href="/directory">Browse AI-ready sites</SecondaryButton>
        </div>
      </section>
    </main>
  );
};

export default CreatorsPage;
