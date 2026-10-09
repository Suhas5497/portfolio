import { useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Connected decision graph: how data becomes a prediction and then an action.
// Describes the architecture of the completed Resilytics platform (see its case study).
const NODES = [
  { id: 'sources', x: 40, y: 70, label: 'Raw data', stage: 'data', text: 'Tenant uploads of structured business / transaction data.' },
  { id: 'validate', x: 150, y: 40, label: 'Validate', stage: 'data', text: 'Schema validation rejects malformed or incomplete uploads before they reach analysis.' },
  { id: 'canonical', x: 150, y: 110, label: 'Canonicalise', stage: 'data', text: 'Canonical transformation maps every tenant’s data into one consistent model.' },
  { id: 'warehouse', x: 265, y: 75, label: 'Warehouse', stage: 'data', text: 'DuckDB analytics warehouse with tenant isolation enforced at the SQL layer.' },
  { id: 'analytics', x: 380, y: 35, label: 'Analytics', stage: 'model', text: 'SQL/Python layer: HHI concentration and the modified Altman Z-Score.' },
  { id: 'simulate', x: 380, y: 115, label: 'Simulate', stage: 'model', text: 'Monte Carlo simulation and shock testing; VaR-95 downside exposure.' },
  { id: 'decide', x: 495, y: 75, label: 'Decide', stage: 'action', text: 'Findings ranked into explainable strategic actions.' },
  { id: 'report', x: 600, y: 75, label: 'Report', stage: 'action', text: 'Board-ready executive report for founders and finance leads.' },
] as const;
const EDGES: [string, string][] = [
  ['sources', 'validate'], ['sources', 'canonical'], ['validate', 'warehouse'], ['canonical', 'warehouse'],
  ['warehouse', 'analytics'], ['warehouse', 'simulate'], ['analytics', 'decide'], ['simulate', 'decide'], ['decide', 'report'],
];
const COLOR: Record<string, string> = { data: 'rgb(var(--c-primary))', model: 'rgb(var(--c-accent))', action: 'rgb(var(--c-tertiary))' };

export default function PipelineGraph() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string>('simulate');
  const node = NODES.find((n) => n.id === active)!;
  const pos = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <figure className="glass overflow-hidden rounded-2xl" data-reveal>
      <figcaption className="flex flex-col gap-1 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-display text-base font-semibold">Data → Prediction → Action</span>
        <span className="flex gap-3 text-[11px] text-ink-3">
          {(['data', 'model', 'action'] as const).map((s) => (
            <span key={s} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: COLOR[s] }} />{s === 'model' ? 'Prediction' : s[0].toUpperCase() + s.slice(1)}</span>
          ))}
        </span>
      </figcaption>
      <div className="overflow-x-auto px-3 pt-4">
        <svg viewBox="0 0 640 150" className="min-w-[560px]" role="group" aria-label="Resilytics pipeline graph">
          <defs>
            <style>{`.flow{stroke-dasharray:4 6;animation:${reduced ? 'none' : 'dash 1.4s linear infinite'}}@keyframes dash{to{stroke-dashoffset:-20}}`}</style>
          </defs>
          {EDGES.map(([a, b]) => {
            const A = pos[a];
            const B = pos[b];
            const on = a === active || b === active;
            return (
              <path key={a + b} d={`M${A.x + 26},${A.y} C${(A.x + B.x) / 2},${A.y} ${(A.x + B.x) / 2},${B.y} ${B.x - 26},${B.y}`}
                fill="none" stroke={on ? COLOR[B.stage] : 'rgb(255 255 255 / 0.18)'} strokeWidth={on ? 2 : 1.2} className="flow" />
            );
          })}
          {NODES.map((n) => {
            const on = n.id === active;
            return (
              <g key={n.id} transform={`translate(${n.x},${n.y})`} role="button" tabIndex={0} aria-pressed={on} aria-label={`${n.label}: ${n.text}`}
                onMouseEnter={() => setActive(n.id)} onFocus={() => setActive(n.id)} onClick={() => setActive(n.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActive(n.id)} className="cursor-pointer outline-none">
                <rect x={-34} y={-15} width={68} height={30} rx={15} fill={on ? COLOR[n.stage] : 'rgb(14 14 24)'} stroke={COLOR[n.stage]} strokeWidth={on ? 2 : 1.2} />
                <text textAnchor="middle" y={4} fontSize="11" fontWeight="600" fill={on ? '#07070c' : '#e2e8f0'}>{n.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="border-t border-white/[0.06] px-5 py-4 text-sm text-ink-2" aria-live="polite">
        <strong className="text-ink">{node.label}.</strong> {node.text}
      </p>
    </figure>
  );
}
