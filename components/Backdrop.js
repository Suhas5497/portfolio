import { useEffect, useRef } from 'react';

// Fixed, low-opacity 2D backdrop behind the whole page.
//   data   → grid + streaming time-series lines
//   ai     → drifting nodes that connect when close (neural "plexus")
//   hybrid → both, lighter
export default function Backdrop({ variant }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const g = canvas.getContext('2d');
    const css = getComputedStyle(canvas);
    const primary = css.getPropertyValue('--c-primary').trim().split(/\s+/).join(',');
    const accent = css.getPropertyValue('--c-accent').trim().split(/\s+/).join(',');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0, raf = 0;

    const showLines = variant !== 'ai';
    const showPlexus = variant !== 'data';
    let nodes = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / (variant === 'hybrid' ? 26000 : 17000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const series = [
      { amp: 40, freq: 0.006, speed: 0.6, y: 0.3, color: primary, a: 0.22 },
      { amp: 55, freq: 0.004, speed: 0.4, y: 0.62, color: accent, a: 0.16 },
      { amp: 30, freq: 0.009, speed: 0.8, y: 0.85, color: primary, a: 0.12 },
    ].slice(0, variant === 'hybrid' ? 1 : 3);

    const draw = (t) => {
      g.clearRect(0, 0, w, h);

      if (showLines) {
        g.strokeStyle = `rgba(${primary},0.035)`;
        g.lineWidth = 1;
        for (let x = 0; x < w; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
        for (let y = 0; y < h; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }

        series.forEach((s) => {
          g.beginPath();
          for (let x = 0; x <= w; x += 8) {
            const k = x * s.freq + t * 0.001 * s.speed;
            const y = s.y * h + Math.sin(k) * s.amp + Math.sin(k * 2.7) * s.amp * 0.35;
            x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
          }
          g.strokeStyle = `rgba(${s.color},${s.a})`;
          g.lineWidth = 1.5;
          g.stroke();
        });
      }

      if (showPlexus) {
        const max = 130;
        for (const n of nodes) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < max) {
              g.strokeStyle = `rgba(${primary},${0.14 * (1 - d / max)})`;
              g.lineWidth = 1;
              g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
            }
          }
          g.fillStyle = `rgba(${accent},0.35)`;
          g.beginPath(); g.arc(a.x, a.y, 1.4, 0, Math.PI * 2); g.fill();
        }
      }
    };

    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (!document.hidden) draw(t);
    };
    if (reduced) draw(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [variant]);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}
