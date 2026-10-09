import { lazy, Suspense, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { RoleKey } from '@/data/projects';
import { ROLES } from '@/config/roles';
import { PROFILE } from '@/config/profile';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Portrait from '@/components/ui/Portrait';
import { About, Contact, Education, Experience, Projects, ResumeCta, Section, Skills } from '@/components/sections/Sections';
import { ArrowRight, Download, Mail } from '@/components/ui/Icons';
import { SceneFallback } from '@/components/three/SceneCanvas';
import { useMeta } from '@/hooks/useMeta';
import { useReveal } from '@/hooks/useReveal';

const RoleCanvas = lazy(() => import('@/components/three/RoleCanvas'));
const FindingsExplorer = lazy(() => import('@/components/demos/FindingsExplorer'));
const TrainingDemo = lazy(() => import('@/components/demos/TrainingDemo'));
const PipelineGraph = lazy(() => import('@/components/demos/PipelineGraph'));
const MonteCarloDemo = lazy(() => import('@/components/demos/MonteCarloDemo'));

const SHOWCASE: Record<RoleKey, { eyebrow: string; title: string; intro: string }> = {
  data: {
    eyebrow: 'Insights',
    title: 'Results from completed work',
    intro: 'Explore the numbers my analyses actually produced. Sort the grid or jump to the project behind each figure.',
  },
  ai: {
    eyebrow: 'Model lab',
    title: 'Training, live in your browser',
    intro: 'A small interactive demo of how a classifier learns a decision boundary — the same loop, at toy scale, behind my production models.',
  },
  hybrid: {
    eyebrow: 'Decision intelligence',
    title: 'How data becomes action',
    intro: 'The pipeline behind Resilytics, plus an interactive risk simulator showing the Monte Carlo method its engine uses.',
  },
};

export default function RolePage({ role }: { role: RoleKey }) {
  const r = ROLES[role];
  const root = useRef<HTMLDivElement>(null);
  useMeta(`${r.label} — ${PROFILE.name}`, r.metaDescription, r.path);
  useReveal(root, [role]);
  const show = SHOWCASE[role];

  return (
    <div ref={root} data-theme={r.theme} className="theme-bg min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 btn-primary">Skip to content</a>
      <SiteHeader role={r} />

      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden" aria-labelledby="hero-title">
          <div className="grid-overlay pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="page-x relative grid items-center gap-8 pb-10 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pb-16 lg:pt-14">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Portrait eager className="h-14 w-14 rounded-2xl border border-white/15 ring-2 ring-primary/40" />
                <div>
                  <p className="font-display text-sm font-semibold">{PROFILE.name}</p>
                  <p className="text-xs text-primary-light">{r.label}</p>
                </div>
              </div>
              <h1 id="hero-title" className="text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-[56px]">
                {r.headline} <span className="gradient-text block">{r.headlineAccent}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">{r.subhead}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#projects" className="btn-primary">View projects <ArrowRight /></a>
                <a href={PROFILE.resumeUrl} target="_blank" rel="noopener" className="btn-ghost"><Download /> Résumé</a>
                <a href="#contact" className="btn-ghost"><Mail /> Contact</a>
              </div>
              {r.flagship && (
                <p className="mt-6 text-sm text-ink-3">
                  Flagship:{' '}
                  <Link to={`${r.path}/projects/${r.flagship}`} className="font-semibold text-primary-light underline-offset-4 hover:underline">
                    Resilytics — live decision-intelligence platform
                  </Link>
                </p>
              )}
            </div>
            <div className="relative h-[300px] sm:h-[400px] lg:h-[480px]">
              <Suspense fallback={<SceneFallback />}>
                <RoleCanvas role={role} className="absolute inset-0" />
              </Suspense>
            </div>
          </div>
        </section>

        <Section id="showcase" eyebrow={show.eyebrow} title={show.title} intro={show.intro}>
          <Suspense fallback={<div className="glass h-64 animate-pulse rounded-2xl" />}>
            {role === 'data' && <FindingsExplorer />}
            {role === 'ai' && <TrainingDemo />}
            {role === 'hybrid' && (
              <div className="space-y-6">
                <PipelineGraph />
                <MonteCarloDemo />
              </div>
            )}
          </Suspense>
        </Section>

        <About role={r} />
        <Skills role={r} />
        <Projects role={r} />
        <Experience />
        <Education />
        <ResumeCta role={r} />
        <Contact role={r} />
      </main>
      <SiteFooter />
    </div>
  );
}
