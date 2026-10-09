import { useCallback, useEffect, useRef, useState } from 'react';
import DemoFrame from './DemoFrame';
import { gaussian, seeded } from '@/lib/random';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Pt { x: number; y: number; label: 0 | 1 }

const W = 360;
const H = 260;
const EPOCHS = 160;

function makeData(seed: number, noise: number): Pt[] {
  const rng = seeded(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < 70; i++) {
    pts.push({ x: -0.8 + gaussian(rng) * noise, y: -0.4 + gaussian(rng) * noise, label: 0 });
    pts.push({ x: 0.7 + gaussian(rng) * noise, y: 0.5 + gaussian(rng) * noise, label: 1 });
  }
  return pts;
}

// Logistic regression with quadratic features so the boundary can bend a little.
const feats = (x: number, y: number) => [1, x, y, x * x, y * y, x * y];
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const predict = (w: number[], x: number, y: number) => sigmoid(feats(x, y).reduce((s, f, i) => s + f * w[i], 0));

function step(w: number[], data: Pt[], lr: number) {
  const g = new Array(w.length).fill(0);
  let loss = 0;
  let correct = 0;
  for (const p of data) {
    const f = feats(p.x, p.y);
    const yhat = sigmoid(f.reduce((s, v, i) => s + v * w[i], 0));
    const err = yhat - p.label;
    f.forEach((v, i) => (g[i] += err * v));
    loss += -(p.label * Math.log(yhat + 1e-9) + (1 - p.label) * Math.log(1 - yhat + 1e-9));
    if ((yhat > 0.5 ? 1 : 0) === p.label) correct++;
  }
  return { w: w.map((v, i) => v - (lr * g[i]) / data.length), loss: loss / data.length, acc: correct / data.length };
}

const toPx = (x: number, y: number): [number, number] => [((x + 2) / 4) * W, H - ((y + 1.6) / 3.2) * H];
const fromPx = (px: number, py: number): [number, number] => [(px / W) * 4 - 2, ((H - py) / H) * 3.2 - 1.6];

export default function TrainingDemo() {
  const reduced = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [seed, setSeed] = useState(7);
  const [noise, setNoise] = useState(0.45);
  const [lr, setLr] = useState(0.8);
  const [data, setData] = useState(() => makeData(7, 0.45));
  const [w, setW] = useState<number[]>(() => new Array(6).fill(0));
  const [history, setHistory] = useState<{ loss: number; acc: number }[]>([]);
  const [running, setRunning] = useState(false);
  const [probe, setProbe] = useState<{ x: number; y: number; p: number } | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    setData(makeData(seed, noise));
    setW(new Array(6).fill(0));
    setHistory([]);
    setRunning(false);
  }, [seed, noise]);

  // Draw decision surface + points
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = W * dpr;
    c.height = H * dpr;
    const g = c.getContext('2d')!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cell = 8;
    for (let px = 0; px < W; px += cell) {
      for (let py = 0; py < H; py += cell) {
        const [x, y] = fromPx(px + cell / 2, py + cell / 2);
        const p = predict(w, x, y);
        const a = Math.abs(p - 0.5) * 0.5;
        g.fillStyle = p > 0.5 ? `rgba(192,132,252,${a})` : `rgba(99,102,241,${a})`;
        g.fillRect(px, py, cell, cell);
      }
    }
    for (const p of data) {
      const [px, py] = toPx(p.x, p.y);
      g.beginPath();
      g.arc(px, py, 3.4, 0, Math.PI * 2);
      g.fillStyle = p.label ? '#f0abfc' : '#a5b4fc';
      g.fill();
      g.strokeStyle = 'rgba(7,7,12,0.8)';
      g.stroke();
    }
    if (probe) {
      const [px, py] = toPx(probe.x, probe.y);
      g.beginPath();
      g.arc(px, py, 6, 0, Math.PI * 2);
      g.strokeStyle = '#fff';
      g.lineWidth = 2;
      g.stroke();
      g.lineWidth = 1;
    }
  }, [w, data, probe]);

  const train = useCallback(() => {
    if (reduced) {
      // No animation: run all epochs at once.
      let cur = w;
      const hist: { loss: number; acc: number }[] = [];
      for (let i = history.length; i < EPOCHS; i++) {
        const r = step(cur, data, lr);
        cur = r.w;
        hist.push({ loss: r.loss, acc: r.acc });
      }
      setW(cur);
      setHistory((h) => [...h, ...hist]);
      return;
    }
    setRunning(true);
  }, [reduced, w, data, lr, history.length]);

  useEffect(() => {
    if (!running) return;
    let cur = w;
    let n = history.length;
    const loop = () => {
      const batch: { loss: number; acc: number }[] = [];
      for (let k = 0; k < 2 && n < EPOCHS; k++, n++) {
        const r = step(cur, data, lr);
        cur = r.w;
        batch.push({ loss: r.loss, acc: r.acc });
      }
      setW(cur);
      setHistory((h) => [...h, ...batch]);
      if (n < EPOCHS) raf.current = requestAnimationFrame(loop);
      else setRunning(false);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const last = history[history.length - 1];
  const maxLoss = Math.max(0.7, ...history.map((h) => h.loss));
  const lossPath = history.map((h, i) => `${i ? 'L' : 'M'}${(i / (EPOCHS - 1)) * 200},${60 - (h.loss / maxLoss) * 56}`).join(' ');

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const [x, y] = fromPx(((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H);
    setProbe({ x, y, p: predict(w, x, y) });
  };

  return (
    <DemoFrame title="Watch a model learn" label="Synthetic data · in-browser demo">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div>
          <canvas
            ref={canvas}
            onPointerMove={onMove}
            onPointerLeave={() => setProbe(null)}
            className="aspect-[36/26] w-full cursor-crosshair rounded-xl border border-white/10 bg-surface"
            role="img"
            aria-label="Scatter plot of two synthetic classes with the model's decision surface"
          />
          <p className="mt-2 h-5 text-xs text-ink-2" aria-live="polite">
            {probe ? <>Prediction at cursor: <strong className="text-ink">P(class B) = {(probe.p * 100).toFixed(1)}%</strong></> : 'Hover the plot to query the model.'}
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ['Epoch', `${history.length}/${EPOCHS}`],
              ['Loss', last ? last.loss.toFixed(3) : '—'],
              ['Train accuracy', last ? `${(last.acc * 100).toFixed(1)}%` : '—'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                <div className="text-[11px] uppercase tracking-wider text-ink-3">{k}</div>
                <div className="mt-1 font-mono text-lg font-semibold text-primary-light">{v}</div>
              </div>
            ))}
          </div>
          <svg viewBox="0 0 200 64" className="h-20 w-full" role="img" aria-label="Training loss curve">
            <path d="M0 62H200" stroke="rgb(255 255 255 / 0.1)" />
            {history.length > 1 && <path d={lossPath} fill="none" stroke="rgb(var(--c-tertiary))" strokeWidth="1.8" />}
          </svg>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-ink-2">
              Learning rate: <strong className="text-ink">{lr.toFixed(2)}</strong>
              <input type="range" min={0.05} max={2} step={0.05} value={lr} onChange={(e) => setLr(+e.target.value)} className="mt-2 w-full accent-[rgb(var(--c-primary-light))]" disabled={running} />
            </label>
            <label className="text-xs text-ink-2">
              Class overlap (noise): <strong className="text-ink">{noise.toFixed(2)}</strong>
              <input type="range" min={0.2} max={0.9} step={0.05} value={noise} onChange={(e) => setNoise(+e.target.value)} className="mt-2 w-full accent-[rgb(var(--c-primary-light))]" disabled={running} />
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={train} disabled={running || history.length >= EPOCHS}>
              {history.length >= EPOCHS ? 'Trained' : running ? 'Training…' : history.length ? 'Continue training' : 'Train model'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => setSeed((s) => s + 1)} disabled={running}>
              New data
            </button>
          </div>
          <p className="text-xs leading-relaxed text-ink-3">
            Logistic regression with quadratic features, trained by gradient descent on 140 generated points. Accuracy shown is on
            this synthetic training set only — it is an illustration, not a project result.
          </p>
        </div>
      </div>
    </DemoFrame>
  );
}
