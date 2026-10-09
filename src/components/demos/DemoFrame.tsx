import type { ReactNode } from 'react';

/** Consistent frame + honesty label for every interactive demo. */
export default function DemoFrame({ title, label, children, id }: { title: string; label: string; children: ReactNode; id?: string }) {
  return (
    <figure id={id} className="glass overflow-hidden rounded-2xl" data-reveal>
      <figcaption className="flex flex-col gap-1 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-display text-base font-semibold">{title}</span>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-200">
          {label}
        </span>
      </figcaption>
      <div className="p-5 sm:p-6">{children}</div>
    </figure>
  );
}
