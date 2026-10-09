import type { ProjectStatus } from '@/data/projects';

const STYLES: Record<ProjectStatus, { label: string; cls: string; dot: string }> = {
  completed: { label: 'Completed', cls: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300', dot: 'bg-emerald-400' },
  proposed: { label: 'Proposed', cls: 'border-amber-300/30 bg-amber-300/10 text-amber-200', dot: 'bg-amber-300' },
  placeholder: { label: 'Details pending', cls: 'border-white/15 bg-white/5 text-ink-2', dot: 'bg-ink-3' },
};

export default function StatusBadge({ status, className = '' }: { status: ProjectStatus; className?: string }) {
  const s = STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s.cls} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}
