import { ReactNode } from 'react';

import { cn } from '../../lib/cn';
import { SectionEyebrow } from '../ui/SectionEyebrow';

type SubpageHeroProps = {
  eyebrow: string;
  title: string;
  description: string | ReactNode;
  className?: string;
};

export function SubpageHero({ eyebrow, title, description, className }: SubpageHeroProps) {
  return (
    <section className={cn(className)}>
      <div className="relative overflow-hidden rounded-[32px] border border-[rgba(126,135,212,0.16)] bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(244,242,255,0.96)_48%,rgba(249,246,255,0.94)_100%)] p-8 shadow-[0_28px_70px_rgba(126,119,213,0.16)]">
        <div className="pointer-events-none absolute -left-8 top-6 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(118,123,238,0.18),transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-56 rounded-bl-[96px] bg-[radial-gradient(circle_at_top_right,rgba(216,106,243,0.16),rgba(115,124,233,0.14)_36%,transparent_72%)]" />
        <div className="mx-auto max-w-3xl space-y-2">
          <SectionEyebrow className="text-[#6b73bf]">{eyebrow}</SectionEyebrow>
          <h1 className="text-3xl font-semibold text-[#25306d] md:text-4xl">{title}</h1>
          <div className="space-y-2 text-base leading-relaxed text-[#7880aa]">
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>
        </div>
      </div>
    </section>
  );
}
