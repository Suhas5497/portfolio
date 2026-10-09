import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROLES } from '@/config/roles';

// Every number below is a reported result from Suhas's résumé / completed
// projects. Nothing is simulated here.
interface Metric {
  metric: string;
  value: number;
  display: string;
  unit: '%' | 'count' | 'hours' | '₹' | 'ratio';
  project: string;
  projectId?: string;
}

const METRICS: Metric[] = [
  { metric: 'Sales share of Central region', value: 60, display: '60%', unit: '%', project: 'Retail Sales Intelligence', projectId: 'retail' },
  { metric: 'Orders on Standard Class with ~5-day delays', value: 60, display: '60%', unit: '%', project: 'Retail Sales Intelligence', projectId: 'retail' },
  { metric: 'Return rate (start of period)', value: 5.4, display: '5.4%', unit: '%', project: 'Retail Sales Intelligence', projectId: 'retail' },
  { metric: 'Return rate (end of period)', value: 6.9, display: '6.9%', unit: '%', project: 'Retail Sales Intelligence', projectId: 'retail' },
  { metric: 'Sales-target achievement', value: 88.48, display: '88.48%', unit: '%', project: 'Retail Sales Intelligence', projectId: 'retail' },
  { metric: 'Revenue from top 5 categories', value: 62, display: '62%', unit: '%', project: 'E-Commerce Business Analytics', projectId: 'ecommerce' },
  { metric: 'Weekly ETL processing time reduced', value: 35, display: '35%', unit: '%', project: 'Labmentix internship' },
  { metric: 'Manual Excel reports replaced', value: 4, display: '4', unit: 'count', project: 'Labmentix internship' },
  { metric: 'Analyst hours saved per week', value: 6, display: '~6 h', unit: 'hours', project: 'Labmentix internship' },
  { metric: 'Churn model test accuracy', value: 85, display: '85%', unit: '%', project: 'Customer Churn Prediction', projectId: 'churn' },
  { metric: 'Yes Bank decline from pre-2018 peak', value: 96, display: '~96%', unit: '%', project: 'Yes Bank Forecasting', projectId: 'yesbank' },
];

function ShareBar({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="text-ink-2">{label}</span>
        <span className="font-display text-lg font-bold text-primary-light">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]" role="img" aria-label={`${label}: ${value}%`}>
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1.5 text-xs text-ink-3">{note}</p>
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  const r = 52;
  const c = Math.PI * r;
  return (
    <svg viewBox="0 0 140 84" className="w-full max-w-[220px]" role="img" aria-label={`Target achievement ${value}%`}>
      <path d="M18 74a52 52 0 01104 0" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="12" strokeLinecap="round" />
      <path d="M18 74a52 52 0 01104 0" fill="none" stroke="rgb(var(--c-accent))" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} />
      <text x="70" y="66" textAnchor="middle" className="fill-ink font-display" fontSize="20" fontWeight="700">{value}%</text>
      <text x="70" y="82" textAnchor="middle" className="fill-ink-3" fontSize="8">of ₹5.4L target</text>
    </svg>
  );
}

function ReturnTrend() {
  const [hover, setHover] = useState<number | null>(null);
  const pts = [
    { label: 'Start', v: 5.4 },
    { label: 'End', v: 6.9 },
  ];
  const max = 8;
  return (
    <div className="flex h-36 items-end gap-6" role="img" aria-label="Return rate rose from 5.4% to 6.9%">
      {pts.map((p, i) => (
        <button
          key={p.label}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(i)}
          onBlur={() => setHover(null)}
          className="relative flex h-full flex-1 flex-col items-center justify-end"
          aria-label={`${p.label} of period: ${p.v}%`}
        >
          <span className={`mb-1 text-sm font-bold transition-colors ${hover === i ? 'text-ink' : 'text-primary-light'}`}>{p.v}%</span>
          <span className={`w-full max-w-[56px] rounded-t-lg transition-all ${i ? 'bg-accent' : 'bg-primary/70'} ${hover === i ? 'opacity-100' : 'opacity-80'}`} style={{ height: `${(p.v / max) * 100}%` }} />
          <span className="mt-2 text-xs text-ink-3">{p.label}</span>
        </button>
      ))}
    </div>
  );
}

type SortKey = 'metric' | 'value' | 'project';

export default function FindingsExplorer() {
  const role = ROLES.data;
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'project', dir: 1 });
  const rows = useMemo(
    () =>
      [...METRICS].sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        return (typeof av === 'number' ? (av as number) - (bv as number) : String(av).localeCompare(String(bv))) * sort.dir;
      }),
    [sort],
  );
  const header = (key: SortKey, label: string, cls = '') => (
    <th scope="col" className={`px-3 py-2 font-semibold ${cls}`} aria-sort={sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="inline-flex items-center gap-1 hover:text-ink" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }))}>
        {label}
        <span aria-hidden="true" className="text-[10px]">{sort.key === key ? (sort.dir === 1 ? '▲' : '▼') : '↕'}</span>
      </button>
    </th>
  );

  return (
    <figure className="glass overflow-hidden rounded-2xl" data-reveal>
      <figcaption className="flex flex-col gap-1 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-display text-base font-semibold">Findings explorer</span>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
          Reported results from completed work
        </span>
      </figcaption>
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-3">
        <div className="space-y-5">
          <ShareBar label="Central region share of sales" value={60} note="Retail dashboard → concentration risk" />
          <ShareBar label="Top 5 categories share of revenue" value={62} note="E-commerce capstone → Pareto" />
        </div>
        <div>
          <p className="mb-3 text-sm text-ink-2">Return rate trend (Retail)</p>
          <ReturnTrend />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="mb-2 self-start text-sm text-ink-2">Target achievement (Retail)</p>
          <Gauge value={88.48} />
        </div>
      </div>
      <div className="overflow-x-auto border-t border-white/[0.06]">
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="sr-only">Sortable table of reported project results</caption>
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-ink-3">
            <tr>
              {header('metric', 'Metric')}
              {header('value', 'Value', 'text-right')}
              {header('project', 'Source')}
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.metric} className="border-t border-white/[0.04] hover:bg-white/[0.03]">
                <td className="px-3 py-2.5 text-ink-2">{m.metric}</td>
                <td className="px-3 py-2.5 text-right font-mono font-semibold text-primary-light">{m.display}</td>
                <td className="px-3 py-2.5 text-ink-3">
                  {m.projectId ? (
                    <Link className="underline-offset-4 hover:text-ink hover:underline" to={`${role.path}/projects/${m.projectId}`}>{m.project}</Link>
                  ) : (
                    <a className="underline-offset-4 hover:text-ink hover:underline" href="#experience">{m.project}</a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
