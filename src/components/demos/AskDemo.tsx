import { useMemo, useState, type FormEvent } from 'react';
import DemoFrame from './DemoFrame';

// Small, fictional sample dataset — monthly revenue (₹ lakh) by customer and region.
const SAMPLE = [
  { customer: 'Asha Traders', region: 'West', rev: [4.2, 4.0, 4.5, 4.8, 5.1, 4.9] },
  { customer: 'Kiran Foods', region: 'South', rev: [2.1, 2.3, 2.0, 2.4, 2.2, 2.5] },
  { customer: 'Neel Retail', region: 'West', rev: [1.2, 1.1, 1.3, 1.0, 1.2, 1.1] },
  { customer: 'Orbit Labs', region: 'North', rev: [0.8, 0.9, 1.1, 1.0, 1.3, 1.4] },
  { customer: 'Sagar Exports', region: 'South', rev: [0.6, 0.5, 0.7, 0.6, 0.5, 0.6] },
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

type Intent =
  | { intent: 'total_revenue'; params: { period: 'all' | 'last_month' } }
  | { intent: 'top_customers'; params: { n: number } }
  | { intent: 'revenue_by_region'; params: Record<string, never> }
  | { intent: 'concentration_hhi'; params: Record<string, never> }
  | { intent: 'growth'; params: { from: string; to: string } }
  | { intent: 'unsupported'; params: { reason: string } };

/**
 * Stand-in for the LLM intent layer: maps text to a whitelisted intent.
 * In the proposed product an LLM fills this same JSON schema — it never computes numbers.
 */
function interpret(q: string): Intent {
  const s = q.toLowerCase();
  if (/(hhi|concentrat|depend)/.test(s)) return { intent: 'concentration_hhi', params: {} };
  if (/region/.test(s)) return { intent: 'revenue_by_region', params: {} };
  const top = s.match(/top\s*(\d+)?/);
  if (top || /biggest|largest customer/.test(s)) return { intent: 'top_customers', params: { n: Math.min(5, Math.max(1, Number(top?.[1] ?? 3))) } };
  if (/grow|growth|change|trend/.test(s)) return { intent: 'growth', params: { from: 'Jan', to: 'Jun' } };
  if (/last month|june|latest/.test(s)) return { intent: 'total_revenue', params: { period: 'last_month' } };
  if (/revenue|sales|total/.test(s)) return { intent: 'total_revenue', params: { period: 'all' } };
  return { intent: 'unsupported', params: { reason: 'No whitelisted intent matched' } };
}

const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
const L = (v: number) => `₹${v.toFixed(2)}L`;

/** Deterministic calculation layer — the only place numbers are produced. */
function calculate(i: Intent): { answer: string; formula: string; rows?: [string, string][] } {
  switch (i.intent) {
    case 'total_revenue': {
      const v = i.params.period === 'last_month' ? sum(SAMPLE.map((c) => c.rev[5])) : sum(SAMPLE.map((c) => sum(c.rev)));
      return { answer: `Total revenue ${i.params.period === 'last_month' ? 'in Jun' : 'Jan–Jun'}: ${L(v)}`, formula: i.params.period === 'last_month' ? 'Σ customers rev[Jun]' : 'Σ customers Σ months rev' };
    }
    case 'top_customers': {
      const ranked = SAMPLE.map((c) => [c.customer, sum(c.rev)] as const).sort((a, b) => b[1] - a[1]).slice(0, i.params.n);
      return { answer: `Top ${i.params.n} customers by Jan–Jun revenue`, formula: 'sort(Σ months rev) desc, limit n', rows: ranked.map(([n, v]) => [n, L(v)]) };
    }
    case 'revenue_by_region': {
      const by: Record<string, number> = {};
      SAMPLE.forEach((c) => (by[c.region] = (by[c.region] ?? 0) + sum(c.rev)));
      return { answer: 'Revenue by region, Jan–Jun', formula: 'group by region, Σ rev', rows: Object.entries(by).sort((a, b) => b[1] - a[1]).map(([r, v]) => [r, L(v)]) };
    }
    case 'concentration_hhi': {
      const totals = SAMPLE.map((c) => sum(c.rev));
      const T = sum(totals);
      const hhi = sum(totals.map((t) => (100 * t / T) ** 2));
      const band = hhi > 2500 ? 'highly concentrated' : hhi > 1500 ? 'moderately concentrated' : 'unconcentrated';
      return { answer: `Customer HHI = ${hhi.toFixed(0)} (${band})`, formula: 'HHI = Σ (customer share %)²' };
    }
    case 'growth': {
      const a = sum(SAMPLE.map((c) => c.rev[0]));
      const b = sum(SAMPLE.map((c) => c.rev[5]));
      return { answer: `Monthly revenue changed ${(((b - a) / a) * 100).toFixed(1)}% from Jan (${L(a)}) to Jun (${L(b)})`, formula: '(rev[Jun] − rev[Jan]) / rev[Jan]' };
    }
    default:
      return { answer: 'I can’t answer that safely. Try revenue, top customers, regions, growth or concentration.', formula: 'refused — no calculation run' };
  }
}

const SUGGESTIONS = ['What was total revenue last month?', 'Who are my top 3 customers?', 'How concentrated is my customer base?', 'Revenue by region', 'How has revenue grown?'];

export default function AskDemo() {
  const [q, setQ] = useState(SUGGESTIONS[2]);
  const [asked, setAsked] = useState(SUGGESTIONS[2]);
  const intent = useMemo(() => interpret(asked), [asked]);
  const valid = intent.intent !== 'unsupported';
  const result = useMemo(() => calculate(intent), [intent]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setAsked(q.trim() || SUGGESTIONS[0]);
  };

  return (
    <DemoFrame title="Ask Resilytics — concept demo" label="Proposed feature · rule-based stand-in for the LLM · sample data">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="ask-q" className="sr-only">Ask a business question</label>
        <input id="ask-q" value={q} onChange={(e) => setQ(e.target.value)} maxLength={140}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-primary-light/60" />
        <button type="submit" className="btn-primary">Ask</button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => { setQ(s); setAsked(s); }} className="pill hover:text-ink">{s}</button>
        ))}
      </div>

      <ol className="mt-6 grid gap-4 lg:grid-cols-3" aria-live="polite">
        <li className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">1 · Intent (language layer)</p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[12px] text-primary-light">{JSON.stringify(intent, null, 2)}</pre>
        </li>
        <li className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">2 · Validation</p>
          <p className={`mt-2 text-sm ${valid ? 'text-emerald-300' : 'text-rose-300'}`}>{valid ? '✓ Intent is whitelisted; parameters match the schema.' : '✗ Rejected — nothing is calculated.'}</p>
          <p className="mt-2 text-[12px] text-ink-3">Formula: <code className="font-mono text-ink-2">{result.formula}</code></p>
        </li>
        <li className="rounded-xl border border-primary/30 bg-primary/[0.07] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">3 · Deterministic answer</p>
          <p className="mt-2 text-sm font-semibold text-ink">{result.answer}</p>
          {result.rows && (
            <table className="mt-2 w-full text-[12px]">
              <tbody>
                {result.rows.map(([k, v]) => (
                  <tr key={k} className="border-t border-white/[0.06]"><td className="py-1 text-ink-2">{k}</td><td className="py-1 text-right font-mono text-primary-light">{v}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </li>
      </ol>
      <details className="mt-4 text-xs text-ink-3">
        <summary className="cursor-pointer text-ink-2">View the sample data</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead><tr><th className="py-1">Customer</th><th>Region</th>{MONTHS.map((m) => <th key={m} className="text-right">{m}</th>)}</tr></thead>
            <tbody>{SAMPLE.map((c) => (
              <tr key={c.customer} className="border-t border-white/[0.06]"><td className="py-1">{c.customer}</td><td>{c.region}</td>{c.rev.map((v, i) => <td key={i} className="text-right font-mono">{v.toFixed(1)}</td>)}</tr>
            ))}</tbody>
          </table>
        </div>
      </details>
    </DemoFrame>
  );
}
