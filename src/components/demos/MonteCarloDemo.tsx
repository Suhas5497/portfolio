import { useMemo, useState } from 'react';
import DemoFrame from './DemoFrame';
import { gaussian, seeded } from '@/lib/random';

const PATHS = 2000;
const MONTHS = 12;
const fmt = (v: number) => `₹${v.toFixed(1)}L`;

/**
 * Illustrates the *method* behind Resilytics' risk engine: simulate many
 * revenue paths with volatility and random shocks, then read the downside.
 * Inputs are user-chosen and synthetic — this is not Resilytics output.
 */
export default function MonteCarloDemo() {
  const [base, setBase] = useState(10);
  const [vol, setVol] = useState(12);
  const [shockP, setShockP] = useState(8);
  const [shockSize, setShockSize] = useState(30);

  const sim = useMemo(() => {
    const rng = seeded(42);
    const totals: number[] = [];
    for (let p = 0; p < PATHS; p++) {
      let total = 0;
      for (let m = 0; m < MONTHS; m++) {
        let rev = base * (1 + (vol / 100) * gaussian(rng));
        if (rng() < shockP / 100) rev *= 1 - shockSize / 100;
        total += Math.max(0, rev);
      }
      totals.push(total);
    }
    totals.sort((a, b) => a - b);
    const mean = totals.reduce((s, v) => s + v, 0) / PATHS;
    const p5 = totals[Math.floor(PATHS * 0.05)];
    const p50 = totals[Math.floor(PATHS * 0.5)];
    const p95 = totals[Math.floor(PATHS * 0.95)];
    const plan = base * MONTHS;
    const below = totals.filter((t) => t < plan * 0.9).length / PATHS;
    // histogram
    const bins = 28;
    const lo = totals[0];
    const hi = totals[PATHS - 1];
    const counts = new Array(bins).fill(0);
    for (const t of totals) counts[Math.min(bins - 1, Math.floor(((t - lo) / (hi - lo || 1)) * bins))]++;
    return { mean, p5, p50, p95, varAbs: mean - p5, below, counts, lo, hi, plan };
  }, [base, vol, shockP, shockSize]);

  const maxC = Math.max(...sim.counts);
  const xOf = (v: number) => ((v - sim.lo) / (sim.hi - sim.lo || 1)) * 280;

  const slider = (label: string, value: number, set: (n: number) => void, min: number, max: number, step: number, unit: string) => (
    <label className="text-xs text-ink-2">
      {label}: <strong className="text-ink">{value}{unit}</strong>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} className="mt-2 w-full accent-[rgb(var(--c-primary-light))]" />
    </label>
  );

  return (
    <DemoFrame title="Revenue risk simulator" label="Synthetic inputs · method illustration">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <svg viewBox="0 0 280 150" className="w-full" role="img" aria-label={`Distribution of simulated annual revenue. 5th percentile ${fmt(sim.p5)}, median ${fmt(sim.p50)}.`}>
            {sim.counts.map((c, i) => {
              const bw = 280 / sim.counts.length;
              const h = (c / maxC) * 120;
              const binStart = sim.lo + (i / sim.counts.length) * (sim.hi - sim.lo);
              return <rect key={i} x={i * bw + 0.5} y={130 - h} width={bw - 1} height={h} rx={1.5} fill={binStart < sim.p5 ? 'rgb(244 63 94 / 0.85)' : 'rgb(var(--c-primary) / 0.75)'} />;
            })}
            <line x1={xOf(sim.p5)} x2={xOf(sim.p5)} y1={6} y2={130} stroke="#fb7185" strokeDasharray="3 3" />
            <text x={xOf(sim.p5) + 3} y={14} fontSize="8" fill="#fda4af">P5</text>
            <line x1={xOf(sim.plan)} x2={xOf(sim.plan)} y1={6} y2={130} stroke="rgb(var(--c-tertiary))" strokeDasharray="3 3" />
            <text x={xOf(sim.plan) + 3} y={24} fontSize="8" fill="rgb(var(--c-tertiary))">Plan</text>
            <line x1="0" x2="280" y1="130" y2="130" stroke="rgb(255 255 255 / 0.15)" />
            <text x="0" y="144" fontSize="8" fill="#6b7a90">{fmt(sim.lo)}</text>
            <text x="280" y="144" fontSize="8" fill="#6b7a90" textAnchor="end">{fmt(sim.hi)}</text>
          </svg>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Expected (mean)', fmt(sim.mean)],
              ['5th percentile', fmt(sim.p5)],
              ['VaR-95 (vs mean)', fmt(sim.varAbs)],
              ['P(< 90% of plan)', `${(sim.below * 100).toFixed(1)}%`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                <div className="text-[11px] text-ink-3">{k}</div>
                <div className="mt-1 font-mono text-base font-semibold text-primary-light">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {slider('Monthly revenue', base, setBase, 2, 50, 1, 'L')}
          {slider('Monthly volatility', vol, setVol, 0, 40, 1, '%')}
          {slider('Shock probability / month', shockP, setShockP, 0, 30, 1, '%')}
          {slider('Shock size', shockSize, setShockSize, 0, 80, 5, '%')}
          <p className="text-xs leading-relaxed text-ink-3">
            {PATHS.toLocaleString()} simulated 12-month paths (seeded, reproducible). VaR-95 here is the gap between the mean
            and the 5th-percentile outcome. Resilytics applies this kind of simulation to real tenant data.
          </p>
        </div>
      </div>
    </DemoFrame>
  );
}
