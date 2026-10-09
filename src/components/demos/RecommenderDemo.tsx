import { useMemo, useState } from 'react';
import DemoFrame from './DemoFrame';
import { seeded } from '@/lib/random';

// Original, fictional catalogue — not affiliated with any streaming or retail brand.
const GENRES = ['Documentary', 'Thriller', 'Comedy', 'Sci-Fi', 'Drama', 'Food'] as const;
type Genre = (typeof GENRES)[number];
const CATALOG: { title: string; genres: Genre[] }[] = [
  { title: 'Signal & Noise', genres: ['Documentary', 'Sci-Fi'] },
  { title: 'The Ledger Room', genres: ['Thriller', 'Drama'] },
  { title: 'Monsoon Kitchens', genres: ['Food', 'Documentary'] },
  { title: 'Orbit Nine', genres: ['Sci-Fi', 'Thriller'] },
  { title: 'Office Hours', genres: ['Comedy'] },
  { title: 'Coastal Lines', genres: ['Drama'] },
  { title: 'Street Spice', genres: ['Food', 'Comedy'] },
  { title: 'Quiet Protocol', genres: ['Thriller'] },
  { title: 'Deep Field', genres: ['Documentary', 'Sci-Fi'] },
  { title: 'Second Draft', genres: ['Comedy', 'Drama'] },
  { title: 'Night Market', genres: ['Food', 'Drama'] },
  { title: 'Parallel Run', genres: ['Sci-Fi', 'Drama'] },
  { title: 'Cold Case Files', genres: ['Documentary', 'Thriller'] },
  { title: 'Stand-Up Station', genres: ['Comedy'] },
  { title: 'Harvest Season', genres: ['Food', 'Documentary'] },
  { title: 'Ghost Network', genres: ['Thriller', 'Sci-Fi'] },
];

/** Synthetic users with genre tastes → binary "liked" interaction matrix. */
function buildMatrix() {
  const rng = seeded(2024);
  const users = 80;
  const m: number[][] = [];
  for (let u = 0; u < users; u++) {
    const taste = Object.fromEntries(GENRES.map((g) => [g, rng() * 2 - 1])) as Record<Genre, number>;
    m.push(CATALOG.map((it) => {
      const s = it.genres.reduce((a, g) => a + taste[g], 0) / it.genres.length + (rng() - 0.5) * 0.6;
      return s > 0.25 ? 1 : 0;
    }));
  }
  return m;
}

function itemSimilarity(m: number[][]) {
  const n = CATALOG.length;
  const sim = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      let dot = 0, ni = 0, nj = 0;
      for (const row of m) {
        dot += row[i] * row[j];
        ni += row[i];
        nj += row[j];
      }
      sim[i][j] = ni && nj ? dot / Math.sqrt(ni * nj) : 0;
    }
  }
  return sim;
}

type Rating = 1 | -1;

export default function RecommenderDemo() {
  const sim = useMemo(() => itemSimilarity(buildMatrix()), []);
  const [ratings, setRatings] = useState<Record<number, Rating>>({ 0: 1, 3: 1 });

  const recs = useMemo(() => {
    const rated = Object.entries(ratings).map(([k, v]) => [+k, v] as const);
    if (!rated.length) return [];
    return CATALOG.map((it, i) => {
      if (ratings[i] !== undefined) return null;
      let score = 0;
      let because = -1;
      let best = -Infinity;
      for (const [j, r] of rated) {
        score += sim[i][j] * r;
        if (r === 1 && sim[i][j] > best) {
          best = sim[i][j];
          because = j;
        }
      }
      return { i, it, score, because };
    })
      .filter((x): x is NonNullable<typeof x> => !!x && x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [ratings, sim]);

  const diversity = new Set(recs.flatMap((r) => r.it.genres)).size;
  const toggle = (i: number, r: Rating) =>
    setRatings((prev) => {
      const next = { ...prev };
      if (next[i] === r) delete next[i];
      else next[i] = r;
      return next;
    });

  return (
    <DemoFrame title="Try the recommender" label="Fictional catalogue · synthetic users">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="mb-3 text-sm text-ink-2">Like or dislike a few titles:</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {CATALOG.map((it, i) => (
              <li key={it.title} className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                <span className="min-w-0">
                  <span className="block truncate text-sm text-ink">{it.title}</span>
                  <span className="block truncate text-[11px] text-ink-3">{it.genres.join(' · ')}</span>
                </span>
                <span className="flex flex-shrink-0 gap-1">
                  <button type="button" aria-pressed={ratings[i] === 1} aria-label={`Like ${it.title}`} onClick={() => toggle(i, 1)}
                    className={`grid h-7 w-7 place-items-center rounded-full text-sm transition-colors ${ratings[i] === 1 ? 'bg-emerald-400 text-bg' : 'bg-white/5 text-ink-3 hover:text-ink'}`}>👍</button>
                  <button type="button" aria-pressed={ratings[i] === -1} aria-label={`Dislike ${it.title}`} onClick={() => toggle(i, -1)}
                    className={`grid h-7 w-7 place-items-center rounded-full text-sm transition-colors ${ratings[i] === -1 ? 'bg-rose-400 text-bg' : 'bg-white/5 text-ink-3 hover:text-ink'}`}>👎</button>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm text-ink-2">Recommended for you</p>
          <ol className="space-y-2" aria-live="polite">
            {recs.length === 0 && <li className="text-sm text-ink-3">Like at least one title to get recommendations.</li>}
            {recs.map((r, k) => (
              <li key={r.it.title} className="rounded-xl border border-primary/25 bg-primary/[0.07] px-3 py-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">{k + 1}. {r.it.title}</span>
                  <span className="font-mono text-[11px] text-primary-light">score {r.score.toFixed(2)}</span>
                </div>
                {r.because >= 0 && <p className="mt-0.5 text-[11px] text-ink-3">Because you liked {CATALOG[r.because].title}</p>}
              </li>
            ))}
          </ol>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
              <div className="text-[11px] text-ink-3">Genre diversity (top 5)</div>
              <div className="mt-1 font-mono text-lg font-semibold text-primary-light">{diversity}/{GENRES.length}</div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
              <div className="text-[11px] text-ink-3">Titles you rated</div>
              <div className="mt-1 font-mono text-lg font-semibold text-primary-light">{Object.keys(ratings).length}</div>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-3">
            Item-based collaborative filtering: cosine similarity between titles across 80 synthetic users. The catalogue and users
            are invented for this demo.
          </p>
        </div>
      </div>
    </DemoFrame>
  );
}
