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
    <section className={cn('text-white', className)}>
      <div className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
        <div className="mx-auto max-w-3xl space-y-2">
          <SectionEyebrow className="text-white/70">{eyebrow}</SectionEyebrow>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <div className="space-y-2 text-base leading-relaxed text-white/80">
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>
        </div>
      </div>
    </section>
  );
}
