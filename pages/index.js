import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeCanvas from '@/components/three/ThreeCanvas';
import { buildLandingScene } from '@/components/three/scenes';
import { ROLES } from '@/components/roles';

const OPTIONS = [
  {
    role: ROLES.data,
    title: 'Data Analyst',
    blurb: 'SQL, statistics and Power BI — finding where revenue leaks and which KPIs move the business.',
    tags: ['SQL', 'Power BI', 'Statistics', 'RFM & Cohorts'],
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </svg>
    ),
  },
  {
    role: ROLES.ai,
    title: 'AI / ML Engineer',
    blurb: 'Predictive models, forecasting and simulation — from feature engineering to production.',
    tags: ['XGBoost', 'Time Series', 'Scikit-learn', 'Monte Carlo'],
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <circle cx="5" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" />
        <path d="M7 7l3.5 3.5M7 17l3.5-3.5M13.5 10.5L17 7M13.5 13.5L17 17" />
      </svg>
    ),
  },
  {
    role: ROLES.hybrid,
    title: 'Data × AI Hybrid',
    blurb: 'The full pipeline: analyse the data, model what happens next, ship the decision — like Resilytics.',
    tags: ['End-to-end', 'Pipelines', 'ML', 'Product'],
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M3 20v-6M7 20V9M11 20v-9" />
        <circle cx="17" cy="6" r="2" /><circle cx="21" cy="12" r="1.5" /><circle cx="17" cy="18" r="2" />
        <path d="M11 11l4-4M11 11l4 6M18.5 7.5l1.5 3.5M18.5 16.5l1.5-3" />
      </svg>
    ),
  },
];

export default function Landing() {
  const router = useRouter();
  const shapeRef = useRef('idle');
  const [hover, setHover] = useState(null);
  const [leaving, setLeaving] = useState(null);

  const focusRole = (key) => {
    shapeRef.current = key || 'idle';
    setHover(key);
  };

  const enter = (e, role) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    focusRole(role.key);
    setLeaving(role.key);
    setTimeout(() => router.push(role.path), 650);
  };

  const theme = hover ? ROLES[hover].theme : 'hybrid';

  return (
    <div className="theme-root overflow-hidden" data-theme={theme}>
      <Head>
        <title>Suhas Dhamapurkar | Portfolio</title>
      </Head>

      <ThreeCanvas
        build={(THREE, ctx) => buildLandingScene(THREE, ctx, shapeRef)}
        className="fixed inset-0 z-0"
      />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_70%_50%,transparent_30%,rgba(10,10,15,0.75)_100%)]" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="max-w-[1360px] w-full mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-display font-bold text-xs shadow-lg shadow-primary/30 transition-colors">
              SD
            </div>
            <span className="font-display font-semibold text-sm text-text-primary hidden sm:block">Suhas Dhamapurkar</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://github.com/Suhas5497" target="_blank" rel="noopener noreferrer" className="btn-ghost py-2 px-4 text-xs">GitHub</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary py-2 px-4 text-xs">Resume</a>
          </div>
        </header>

        <main className="flex-1 max-w-[1360px] w-full mx-auto px-6 sm:px-8 pb-10 grid lg:grid-cols-[minmax(0,540px)_1fr] gap-10 items-center">
          <div className="pt-[38vh] sm:pt-[40vh] lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
              <span className="text-xs font-medium text-text-secondary">Available for opportunities</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-4xl sm:text-5xl leading-[1.08] tracking-tight mb-4"
            >
              Choose how you want to <span className="gradient-text">see my work</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="text-text-secondary mb-8"
            >
              Same person, three lenses. Hover a role to reshape the data — click to step inside.
            </motion.p>

            <div className="flex flex-col gap-3" onMouseLeave={() => !leaving && focusRole(null)}>
              {OPTIONS.map(({ role, title, blurb, tags, icon }, i) => {
                const isHover = hover === role.key;
                return (
                  <motion.div
                    key={role.key}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: leaving && leaving !== role.key ? 0.3 : 1, x: 0, scale: leaving === role.key ? 1.02 : 1 }}
                    transition={{ duration: 0.55, delay: leaving ? 0 : 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={role.path}
                      data-theme={role.theme}
                      onMouseEnter={() => !leaving && focusRole(role.key)}
                      onFocus={() => !leaving && focusRole(role.key)}
                      onClick={(e) => enter(e, role)}
                      className={`group flex gap-4 items-start rounded-2xl p-5 glass bg-[rgba(10,10,15,0.6)] transition-all duration-300
                        hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                        ${isHover ? 'border-primary/50 shadow-[0_0_50px_rgb(var(--c-primary)/0.18)]' : ''}`}
                    >
                      <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-primary/15 text-primary-light flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <h2 className="font-display font-bold text-lg text-text-primary">{title}</h2>
                          <svg className="w-5 h-5 text-primary-light flex-shrink-0 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed mb-3">{blurb}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {tags.map((t) => (
                            <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] border border-primary/25 text-primary-light bg-primary/5">{t}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="hidden lg:block" />
        </main>
      </div>

      <AnimatePresence>
        {leaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="fixed inset-0 z-50 bg-bg pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
