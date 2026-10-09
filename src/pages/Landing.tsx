import { createRef, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROLE_LIST, ROLES, type RoleConfig } from '@/config/roles';
import { PROFILE } from '@/config/profile';
import { PROJECTS, type RoleKey } from '@/data/projects';
import SiteFooter from '@/components/layout/SiteFooter';
import { ArrowRight, Download, Github, Linkedin, Mail } from '@/components/ui/Icons';
import { useMeta } from '@/hooks/useMeta';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { hasWebGL } from '@/lib/webgl';

const LandingCanvas = lazy(() => import('@/components/three/LandingCanvas'));

const DWELL_MS = 2000;
const LEAVE_GRACE_MS = 140;

const NAV: [string, string][] = [
  ['About', '/hybrid#about'],
  ['Projects', '/hybrid#projects'],
  ['Experience', '/hybrid#experience'],
  ['Education', '/hybrid#education'],
  ['Contact', '/hybrid#contact'],
];

const svg = (d: JSX.Element) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const BRAIN = <path d="M9 4a3 3 0 00-3 3v.5A3 3 0 004 10.5 3 3 0 005 15a3 3 0 003 4h1V4zM15 4a3 3 0 013 3v.5a3 3 0 012 3 3 3 0 01-1 4.5 3 3 0 01-3 4h-1V4z" />;
const FOCUS: [string, JSX.Element][] = [
  ['Analytics & Business Insights', svg(<path d="M4 20V12M10 20V6M16 20v-9M21 20H3" />)],
  ['Machine Learning & AI', svg(BRAIN)],
  ['Computer Vision', svg(<><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" /></>)],
  ['Intelligent Systems', svg(<><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></>)],
  ['Recommendation Systems', svg(<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z" />)],
  ['Real-World Applications', svg(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></>)],
];

const CARD_ICON: Record<RoleKey, JSX.Element> = {
  data: svg(<path d="M5 20V13M10 20V9M15 20v-5M20 20V5" />),
  ai: svg(BRAIN),
  hybrid: svg(<><path d="M12 3l9 4.5-9 4.5-9-4.5z" /><path d="M3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5" /></>),
};

const CARD_TITLE: Record<RoleKey, string> = { data: 'Data Analyst', ai: 'AI/ML Engineer', hybrid: 'Hybrid Data + AI' };

// CSS lean used only when the 3D portrait is unavailable (no WebGL).
const CSS_LEAN: Record<RoleKey | 'none', string> = {
  none: 'none',
  data: 'perspective(900px) rotateY(-10deg) translateX(-2%)',
  ai: 'perspective(900px) rotateX(5deg)',
  hybrid: 'perspective(900px) rotateY(10deg) translateX(2%)',
};

export default function Landing() {
  useMeta(
    'Suhas Dhamapurkar — Explore My World of Intelligence',
    'Data Analyst, AI/ML Engineer and Hybrid Data + AI portfolios of Suhas Dhamapurkar — projects, résumé and contact.',
    '/',
  );
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [webgl] = useState(() => hasWebGL());
  const [active, setActive] = useState<RoleKey | null>(null);
  const [insight, setInsight] = useState<RoleKey | null>(null);
  const [ready3d, setReady3d] = useState(false);
  const [menu, setMenu] = useState(false);

  const portraitAnchor = useRef<HTMLDivElement>(null);
  const cardAnchors = useMemo(() => ({ data: createRef<HTMLDivElement>(), ai: createRef<HTMLDivElement>(), hybrid: createRef<HTMLDivElement>() }), []);
  const cardRefs = useRef<Record<RoleKey, HTMLAnchorElement | null>>({ data: null, ai: null, hybrid: null });
  const leaveTimer = useRef<number>();
  const lastPointer = useRef('mouse');
  // Captured at pointerdown: on touch, focus fires before click, so we need to
  // know whether the card was already selected when the tap began.
  const wasActiveAtDown = useRef(false);
  const onPortraitReady = useCallback(() => setReady3d(true), []);

  useEffect(() => {
    setInsight(null);
    if (!active) return;
    const id = window.setTimeout(() => setInsight(active), DWELL_MS);
    return () => window.clearTimeout(id);
  }, [active]);

  const enter = (role: RoleKey) => {
    window.clearTimeout(leaveTimer.current);
    setActive(role);
  };
  const leave = () => {
    window.clearTimeout(leaveTimer.current);
    // Short grace so moving between cards eases straight to the next one.
    leaveTimer.current = window.setTimeout(() => setActive(null), LEAVE_GRACE_MS);
  };

  const onCardClick = (e: MouseEvent<HTMLAnchorElement>, role: RoleKey) => {
    // Touch: first tap previews, second tap opens.
    if (lastPointer.current === 'touch' && !wasActiveAtDown.current) {
      e.preventDefault();
      enter(role);
    }
  };

  const onCardsKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const order = ROLE_LIST.map((r) => r.key);
    const cur = order.indexOf((document.activeElement as HTMLElement)?.dataset.role as RoleKey);
    let next = cur;
    if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = order.length - 1;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (cur + 1) % order.length;
    else next = (cur - 1 + order.length) % order.length;
    e.preventDefault();
    cardRefs.current[order[next]]?.focus();
  };

  const counts = useMemo(() => {
    const out = {} as Record<RoleKey, { done: number; proposed: number }>;
    ROLE_LIST.forEach((r) => {
      const ps = r.projectOrder.map((id) => PROJECTS.find((p) => p.id === id));
      out[r.key] = { done: ps.filter((p) => p?.status === 'completed').length, proposed: ps.filter((p) => p?.status === 'proposed').length };
    });
    return out;
  }, []);

  const showHtmlPortrait = !webgl || !ready3d;

  return (
    <div className="theme-bg relative min-h-screen overflow-x-hidden" data-theme={active ?? 'neutral'}>
      {webgl && (
        <Suspense fallback={null}>
          <LandingCanvas active={active} portraitAnchor={portraitAnchor} cardAnchors={cardAnchors} onPortraitReady={onPortraitReady} />
        </Suspense>
      )}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_40%,rgba(7,7,12,0.8)_100%)]" aria-hidden="true" />

      <a href="#roles" className="btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50">Skip to portfolio choices</a>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="relative z-20">
        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-current="page">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-primary font-display text-sm font-extrabold text-white shadow-lg shadow-primary/30">S</span>
            <span className="font-display text-base font-semibold">{PROFILE.name}</span>
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            <Link to="/" className="relative text-sm text-ink after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded after:bg-accent">Home</Link>
            {NAV.map(([label, to]) => (
              <Link key={label} to={to} className="text-sm text-ink-2 transition-colors hover:text-ink">{label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href={PROFILE.resumeUrl} target="_blank" rel="noopener" className="btn hidden border border-primary-light/50 bg-primary/15 px-4 py-2 text-xs text-ink shadow-[0_0_24px_rgb(var(--c-primary)/0.35)] hover:bg-primary/25 sm:inline-flex">
              Download Resume <Download />
            </a>
            <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hidden p-1.5 text-ink-2 hover:text-ink md:block"><Linkedin className="h-5 w-5" /></a>
            <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hidden p-1.5 text-ink-2 hover:text-ink md:block"><Github className="h-5 w-5" /></a>
            <a href={`mailto:${PROFILE.links.email}`} aria-label="Email" className="hidden p-1.5 text-ink-2 hover:text-ink md:block"><Mail className="h-5 w-5" /></a>
            <button type="button" className="rounded-lg p-2 text-ink-2 hover:text-ink lg:hidden" aria-expanded={menu} aria-controls="landing-menu" aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu((m) => !m)}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" d={menu ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav id="landing-menu" aria-label="Main (mobile)" className="mx-4 mb-2 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-bg/95 p-2 lg:hidden">
            {NAV.map(([label, to]) => (
              <Link key={label} to={to} className="rounded-lg px-3 py-2.5 text-sm text-ink-2 hover:bg-white/5 hover:text-ink">{label}</Link>
            ))}
            <a href={PROFILE.resumeUrl} target="_blank" rel="noopener" className="col-span-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-primary-light hover:bg-white/5">Download Resume</a>
          </nav>
        )}
      </header>

      <main className="relative z-10">
        {/* ── Hero: text · portrait · focus list ──────────────── */}
        <section aria-labelledby="landing-title" className="mx-auto grid max-w-[1360px] items-center gap-6 px-4 pt-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-4 lg:px-8 lg:pt-2">
          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-2">Hello, I’m</p>
            <h1 id="landing-title" className="mt-3 text-[44px] font-extrabold leading-[1.02] sm:text-6xl xl:text-[68px]">
              <span className="block">Suhas</span>
              <span className="block bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#a855f7] bg-clip-text text-transparent">Dhamapurkar</span>
            </h1>
            <p className="mt-4 font-display text-xl font-semibold sm:text-2xl">Explore My World of Intelligence.</p>
            <p className="mt-3 flex flex-wrap justify-center gap-x-2 text-sm text-ink-2 lg:justify-start">
              {['Data', 'Machine Learning', 'Intelligent Systems', 'Real Impact'].map((t, i) => (
                <span key={t}>{i > 0 && <span className="mr-2 text-ink-3" aria-hidden="true">•</span>}{t}</span>
              ))}
            </p>
            <blockquote className="mx-auto mt-6 max-w-sm text-lg italic leading-snug text-ink-2 lg:mx-0">
              <span className="font-serif text-2xl text-accent" aria-hidden="true">“</span> Turning ideas, data and AI into meaningful solutions. <span className="font-serif text-2xl text-accent" aria-hidden="true">”</span>
            </blockquote>
            <a href="#roles" className="btn mt-7 border border-primary-light/60 bg-gradient-to-r from-primary/40 to-accent/30 px-6 py-3 text-ink shadow-[0_0_30px_rgb(var(--c-primary)/0.45)] hover:shadow-[0_0_44px_rgb(var(--c-primary)/0.65)]">
              Explore My Work <ArrowRight />
            </a>
          </div>

          {/* Portrait anchor — the 3D portrait renders into this box */}
          <div className="relative flex justify-center">
            <div ref={portraitAnchor} className="relative aspect-[960/1207] h-[50vh] min-h-[340px] max-h-[640px] lg:h-[72vh]">
              <picture>
                <source srcSet={`${PROFILE.hero.small} 600w, ${PROFILE.hero.webp} 960w`} sizes="(min-width: 1024px) 520px, 70vw" type="image/webp" />
                <img
                  src={PROFILE.hero.webp}
                  alt={PROFILE.hero.alt}
                  width={PROFILE.hero.width}
                  height={PROFILE.hero.height}
                  {...{ fetchpriority: 'high' }}
                  className="h-full w-full object-contain transition-[opacity,transform] duration-500"
                  style={{ opacity: showHtmlPortrait ? 1 : 0, transform: !webgl ? CSS_LEAN[active ?? 'none'] : undefined }}
                />
              </picture>
              {!webgl && <div className="absolute inset-x-[10%] top-[8%] -z-10 aspect-square rounded-full bg-[radial-gradient(circle,rgb(var(--c-primary)/0.45),transparent_68%)] blur-2xl" aria-hidden="true" />}
              <p
                aria-hidden="true"
                className={`pointer-events-none absolute -right-[42%] top-[4%] hidden -rotate-[14deg] font-script text-[34px] leading-[0.95] text-[#c4b5fd] [text-shadow:0_0_12px_rgb(168_85_247/0.9),0_0_28px_rgb(168_85_247/0.6)] xl:block ${reduced ? '' : 'animate-[neon_6s_ease-in-out_infinite]'}`}
              >
                Analyze<br />&nbsp;Predict<br />&nbsp;&nbsp;Build<br />&nbsp;&nbsp;&nbsp;Impact
              </p>
              <HoloPanel className="-left-[12%] top-[4%] hidden xl:block" tilt="left" kind="code" reduced={reduced} />
              <HoloPanel className="-left-[4%] top-[60%] hidden w-28 xl:block" tilt="left" kind="chart" reduced={reduced} />
            </div>
          </div>

          <div className="relative lg:min-h-[340px] lg:w-[300px] lg:justify-self-end">
            {/* Desktop: the dwell preview takes over this column */}
            {insight && (
              <div className="hidden lg:mt-28 lg:block">
                <InsightPanel role={ROLES[insight]} counts={counts[insight]} reduced={reduced} onOpen={() => navigate(ROLES[insight].path)} onEnter={() => enter(insight)} onLeave={leave} />
              </div>
            )}
            <div className={insight ? 'lg:hidden' : ''}>
            <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3 lg:text-left">What I work on &amp; explore</p>
            <ul className="mx-auto grid max-w-md grid-cols-2 gap-x-4 gap-y-3 lg:mx-0 lg:grid-cols-1 lg:gap-y-5">
              {FOCUS.map(([label, icon]) => (
                <li key={label} className="flex items-center gap-3 text-sm text-ink-2 lg:text-[15px]">
                  <span className="text-accent">{icon}</span>
                  {label}
                </li>
              ))}
            </ul>
            </div>
          </div>
        </section>

        {/* ── Three paths ─────────────────────────────────────── */}
        <section id="roles" aria-label="Choose a portfolio" className="relative mx-auto max-w-[1180px] scroll-mt-6 px-4 pb-14 pt-8 sm:px-6 lg:-mt-36 lg:px-8 lg:pt-0">
          <div className="grid gap-5 md:grid-cols-3" onKeyDown={onCardsKeyDown}>
            {ROLE_LIST.map((r) => {
              const isActive = active === r.key;
              const dimmed = active !== null && !isActive;
              return (
                <div key={r.key} className="relative">
                  <Link
                    to={r.path}
                    ref={(el) => (cardRefs.current[r.key] = el)}
                    data-role={r.key}
                    data-theme={r.theme}
                    aria-describedby={`role-${r.key}-desc`}
                    onPointerDown={(e) => {
                      lastPointer.current = e.pointerType;
                      wasActiveAtDown.current = active === r.key;
                    }}
                    onPointerEnter={(e) => e.pointerType !== 'touch' && enter(r.key)}
                    onPointerLeave={(e) => e.pointerType !== 'touch' && leave()}
                    onFocus={() => enter(r.key)}
                    onBlur={leave}
                    onClick={(e) => onCardClick(e, r.key)}
                    className={`group relative block overflow-hidden rounded-2xl border bg-gradient-to-b from-white/[0.02] via-bg/40 to-bg/85 transition-all duration-300
                      ${isActive ? 'border-primary-light/70 shadow-[0_0_50px_rgb(var(--c-primary)/0.45),inset_0_0_30px_rgb(var(--c-primary)/0.15)] md:-translate-y-1.5' : 'border-primary/35 shadow-[0_0_30px_rgb(var(--c-primary)/0.18)]'}
                      ${dimmed ? 'opacity-45 saturate-50 md:scale-[0.98]' : 'opacity-100'}`}
                  >
                    {/* 3D mini-scene renders into this transparent window */}
                    <div ref={cardAnchors[r.key]} className="relative h-36 sm:h-40" aria-hidden="true">
                      {!webgl && <div className="absolute inset-0 grid place-items-center text-primary-light/70 [&_svg]:h-16 [&_svg]:w-16">{CARD_ICON[r.key]}</div>}
                      <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-light/50 to-transparent" />
                    </div>
                    <div className="flex items-center gap-4 p-5">
                      <span className={`grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl border border-primary-light/40 transition-colors ${isActive ? 'bg-primary text-white' : 'bg-primary/20 text-primary-light'}`}>
                        {CARD_ICON[r.key]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-lg font-bold leading-tight">{CARD_TITLE[r.key]}</span>
                        <span id={`role-${r.key}-desc`} className="mt-1 block text-[13px] leading-snug text-ink-2">
                          {r.headline} {r.headlineAccent}
                        </span>
                      </span>
                      <span className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border transition-all ${isActive ? 'translate-x-0.5 border-primary-light bg-primary-light text-bg' : 'border-white/25 text-ink'}`} aria-hidden="true">
                        <ArrowRight />
                      </span>
                    </div>
                    {isActive && lastPointer.current === 'touch' && <span className="block px-5 pb-4 text-xs font-semibold text-primary-light">Tap again to open →</span>}
                  </Link>
                  {/* Mobile/tablet: preview appears directly under its card */}
                  {insight === r.key && (
                    <div className="mt-3 lg:hidden">
                      <InsightPanel role={r} counts={counts[r.key]} reduced={reduced} onOpen={() => navigate(r.path)} onEnter={() => enter(r.key)} onLeave={leave} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-ink-3">
            Hover or focus to preview · click or press Enter to open ·{' '}
            <a className="underline underline-offset-4 hover:text-ink" href={PROFILE.resumeUrl} target="_blank" rel="noopener">Résumé (PDF)</a>
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function HoloPanel({ className, kind, tilt, reduced }: { className: string; kind: 'code' | 'chart'; tilt: 'left' | 'right'; reduced: boolean }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute w-36 ${className}`} style={{ transform: `perspective(600px) rotateY(${tilt === 'left' ? 18 : -18}deg)` }}>
      <div className={`rounded-lg border border-accent/30 bg-accent/[0.06] p-2.5 shadow-[0_0_24px_rgb(var(--c-accent)/0.2)] backdrop-blur-sm ${reduced ? '' : 'animate-[float_7s_ease-in-out_infinite]'}`}>
        {kind === 'code' ? (
          <div className="space-y-1.5">
            {[70, 45, 85, 55, 65].map((w, i) => (
              <div key={i} className="h-1 rounded bg-accent/50" style={{ width: `${w}%`, marginLeft: i % 2 ? 8 : 0 }} />
            ))}
          </div>
        ) : (
          <div className="flex h-12 items-end gap-1">
            {[40, 65, 50, 80, 60, 95].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-accent/80" style={{ height: `${h}%` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InsightPanel({ role, counts, reduced, onOpen, onEnter, onLeave }: {
  role: RoleConfig; counts: { done: number; proposed: number }; reduced: boolean; onOpen: () => void; onEnter: () => void; onLeave: () => void;
}) {
  return (
    <div
      role="status"
      data-theme={role.theme}
      onPointerEnter={(e) => e.pointerType !== 'touch' && onEnter()}
      onPointerLeave={(e) => e.pointerType !== 'touch' && onLeave()}
      className={`glass relative z-20 rounded-2xl border-primary/50 bg-bg/90 p-4 shadow-2xl ${reduced ? '' : 'animate-[insight_0.45s_ease-out]'}`}
    >
      <p className="eyebrow mb-2 text-[10px]">Preview · {ROLES[role.key].label}</p>
      <ul className="space-y-1.5 text-[13px] leading-snug text-ink-2">
        {role.insight.map((line) => (
          <li key={line} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-light" aria-hidden="true" />{line}</li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-ink-3">{counts.done} completed · {counts.proposed} proposed projects</p>
      <button type="button" onClick={onOpen} className="btn-primary mt-3 w-full py-2 text-xs">Open portfolio <ArrowRight /></button>
    </div>
  );
}
