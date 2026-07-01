import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

// ── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

// ── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  ['Home', 'home'],
  ['Experience', 'experience'],
  ['Projects', 'projects'],
  ['Skills', 'skills'],
  ['Education', 'education'],
  ['About', 'about'],
  ['Contact', 'contact'],
];

// ── Data ─────────────────────────────────────────────────────────────────────
const EXPERIENCE = [
  {
    role: 'Founder & Sole Engineer',
    company: 'Resilytics',
    url: 'https://resilytics.in',
    period: 'Aug 2025 – Present',
    type: 'accent',
    bullets: [
      'Designed and built a multi-tenant decision-intelligence SaaS solo — structured data ingestion, schema validation, canonical transformation, analytics warehouse, risk/simulation engine, and executive reporting with tenant isolation enforced at the SQL layer.',
      'Implemented Monte Carlo simulation and shock-testing engine with HHI market concentration, Basel III VaR-95, and modified Altman Z-Score — turning raw SMB transaction data into board-ready risk reports.',
      'Owned full-stack architecture and production deployment: FastAPI, PostgreSQL, Redis, async RQ workers, DuckDB warehouse; React/TypeScript/Vite frontend — database migrations, automated release checks, and demo-environment tooling.',
    ],
  },
  {
    role: 'Data Analyst Intern',
    company: 'Labmentix Pvt. Ltd.',
    url: null,
    period: 'Feb 2025 – May 2025',
    type: 'primary',
    bullets: [
      'Engineered automated ETL pipelines using Python and SQL, reducing weekly data processing time by 35%.',
      'Built and productionized an XGBoost churn prediction model on 7,000+ telecom customer records achieving 85% test accuracy; surfaced top 3 churn drivers adopted by the retention team.',
      'Designed Power BI dashboards with DAX measures tracking revenue KPIs and profitability trends, replacing 4 recurring manual Excel reports and saving ~6 hours of analyst time per week.',
    ],
  },
];

const PROJECTS = [
  {
    id: 'resilytics',
    featured: true,
    title: 'Resilytics',
    tagline: 'Production B2B Decision-Intelligence SaaS',
    description:
      'Multi-tenant platform that turns raw SMB transaction data into board-ready risk verdicts, downside forecasts, and ranked strategic actions — built and deployed entirely solo.',
    problem: 'SMB founders and CFOs lack real-time business-health signals without a BI team.',
    approach:
      'Full-stack SaaS with Monte Carlo simulation, VaR-95, Altman Z-Score, and HHI concentration risk on top of a DuckDB analytics warehouse.',
    outcome: 'Live at resilytics.in — complete pipeline from raw upload to PDF executive report.',
    tech: ['FastAPI', 'PostgreSQL', 'DuckDB', 'Redis', 'React', 'TypeScript', 'Python'],
    github: 'https://github.com/Suhas5497/Resilytics',
    demo: 'https://resilytics.in',
    video: 'https://drive.google.com/file/d/1xa5auWjSEbmHqArwoHLRRlr1A08TEjMh/preview',
    image: '/assets/resylytics.png',
  },
  {
    id: 'ecommerce',
    featured: false,
    title: 'E-Commerce Business Analytics',
    tagline: 'Imarticus PG Capstone · SQL & Power BI',
    description:
      'Dissected 100,000+ orders across 9 relational tables to surface revenue concentration, customer value tiers, and delivery-failure root causes.',
    problem: 'No single view of customer lifetime value, category revenue mix, or the delivery delays bleeding margins.',
    approach:
      'Advanced SQL — CTEs, window functions (RANK, LAG, NTILE), stored procedures — then RFM segmentation, Pareto analysis, cohort retention, and a Power BI drill-through dashboard.',
    outcome:
      'Top 5 categories drove 62% of revenue (Pareto); full cohort retention matrix built; drill-through dashboard pinpointed delivery-delay root causes by carrier and region.',
    tech: ['SQL', 'Power BI', 'DAX', 'Python', 'CTEs', 'Window Functions', 'RFM Analysis'],
    github: 'https://github.com/Suhas5497/ecommerce-sql-analytics',
    demo: null,
    images: [
      '/assets/E-Commerce Business Analytics/ecom-1.png',
      '/assets/E-Commerce Business Analytics/ecom-2.png',
      '/assets/E-Commerce Business Analytics/ecom-3.png',
      '/assets/E-Commerce Business Analytics/ecom-4.png',
      '/assets/E-Commerce Business Analytics/ecom-5.png',
    ],
    image: '/assets/ecom-cover.png',
  },
  {
    id: 'retail',
    featured: false,
    title: 'Retail Sales Intelligence Dashboard',
    tagline: 'Power BI · 4-Page Executive Dashboard',
    description:
      'Four-page interactive Power BI report dissecting ₹29.4L in sales (2015–2018) — returns & delivery, P&L, target tracking, and a ranked risk action plan.',
    problem: 'Regional managers were blind to delivery delays, return-rate creep, and target shortfalls until the end of the quarter.',
    approach:
      'Star-schema data model, KPI cards, YoY DAX measures, dynamic slicers, and a decomposition tree for root-cause drill-down.',
    outcome:
      'Central region concentration risk flagged (60% of revenue); Standard Class delays averaging 5 days exposed; return rate trend (5.4% → 6.9%) isolated by category; 88.48% target achievement tracked live.',
    tech: ['Power BI', 'DAX', 'Star Schema', 'Excel'],
    github: 'https://github.com/Suhas5497/sales-intelligence-platform',
    demo: 'https://sales-intelligence-platform-dovb9bnzxw69tvcorxpqqz.streamlit.app/',
    images: [
      '/assets/Retail Sales Intelligence Dashboard/page1_returns_delivery.png',
      '/assets/Retail Sales Intelligence Dashboard/page2_sales_profit.png',
      '/assets/Retail Sales Intelligence Dashboard/page3_target_achievement.png',
      '/assets/Retail Sales Intelligence Dashboard/page4_key_risk.png',
    ],
    image: '/assets/retail-sales-dashboard.png',
  },
  {
    id: 'yesbank',
    featured: false,
    title: 'Yes Bank Stock Price Forecasting',
    tagline: 'Time Series · SARIMA + Random Forest',
    description:
      'Fifteen years of Yes Bank data stress-tested against the 2018 fraud crisis — with SARIMA, ARIMA, and Random Forest models benchmarked head-to-head.',
    problem: 'Quantify the risk signature of a fraud-impacted stock and produce a defensible price forecast for risk-aware investors.',
    approach:
      'Statistical decomposition of the ~96% price collapse from the 2018 peak; three forecasting models compared on MAE, RMSE, and directional accuracy.',
    outcome:
      'SARIMA outperformed all baselines — next-month forecast ₹15.80; Random Forest R² = 0.97 (MAE ₹14.96, RMSE ₹23.57) on intra-month price features.',
    tech: ['Python', 'SARIMA', 'ARIMA', 'Random Forest', 'Pandas', 'Matplotlib', 'Statsmodels'],
    github: 'https://github.com/Suhas5497/Yes-Bank-Stock-Price-Analysis-Future-Price-Prediction',
    demo: null,
    image: '/assets/yesbank-forecast.png',
  },
  {
    id: 'churn',
    featured: false,
    title: 'Customer Churn Prediction System',
    tagline: 'XGBoost · Streamlit · ETL Pipeline',
    description:
      'End-to-end churn prediction system on 7,000+ telecom records with ML model, feature analysis, and interactive Streamlit demo.',
    problem: 'Identify high-risk telecom customers before churn to reduce revenue loss.',
    approach:
      'EDA, feature engineering, XGBoost classification with hyperparameter tuning; surfaced top churn drivers.',
    outcome:
      '85% test accuracy; month-to-month contracts show 3× higher churn probability; top 3 drivers adopted by retention team.',
    tech: ['Python', 'XGBoost', 'Scikit-learn', 'Pandas', 'Streamlit'],
    github: 'https://github.com/Suhas5497/customer-churn-prediction-system',
    demo: 'https://customer-churn-prediction-system-oneq3amaedjugshgt599ip.streamlit.app/',
    image: '/assets/churn-model.png',
  },
];

const SKILLS = [
  {
    label: 'Data Analysis & BI',
    color: 'primary',
    items: ['SQL', 'Power BI', 'DAX', 'Excel', 'Tableau', 'Star Schema', 'Drill-Through', 'RLS'],
  },
  {
    label: 'Statistics',
    color: 'primary',
    items: ['Statistical Analysis', 'Hypothesis Testing', 'A/B Testing', 'Cohort Analysis', 'Descriptive Statistics', 'Probability Distributions'],
  },
  {
    label: 'Python & Data Science',
    color: 'primary',
    items: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter Notebook'],
  },
  {
    label: 'Machine Learning',
    color: 'primary',
    items: ['Scikit-learn', 'XGBoost', 'TensorFlow', 'ARIMA', 'SARIMA', 'Random Forest', 'Regression', 'Classification', 'Clustering'],
  },
  {
    label: 'Data Engineering',
    color: 'accent',
    items: ['ETL Pipelines', 'Data Cleaning', 'Data Validation', 'PostgreSQL', 'DuckDB', 'FastAPI', 'Redis'],
  },
  {
    label: 'Cloud & Tools',
    color: 'accent',
    items: ['AWS', 'Git', 'GitHub', 'Railway', 'Vercel', 'VS Code', 'React', 'TypeScript'],
  },
];

const EDUCATION = [
  {
    degree: 'Post Graduate Program in Data Science & Analytics',
    institution: 'Imarticus Learning',
    period: 'Aug 2025 – May 2026',
    detail: 'Ranked 8th of 150+ participants (Top 5%) — Imarticus Data Science Hackathon, Apr 2026',
    color: 'primary',
  },
  {
    degree: 'B.Tech in Artificial Intelligence & Machine Learning',
    institution: "KIT's College of Engineering, Kolhapur",
    period: '2021 – 2025',
    detail: 'CGPA: 7.45 / 10',
    color: 'accent',
  },
  {
    degree: 'Class XII · PCM (Science)',
    institution: 'Jawahar Navodaya Vidyalaya, Ratnagiri',
    period: '2019 – 2021',
    detail: 'CBSE Board · 82% · Secured 2nd Rank at Regional Level in Mathematics Exhibition — Navodaya Vidyalaya Samiti (Class XI)',
    color: 'primary',
  },
  {
    degree: 'Class X',
    institution: 'Jawahar Navodaya Vidyalaya, Ratnagiri',
    period: '2017 – 2019',
    detail: 'CBSE Board · 80%',
    color: 'accent',
  },
];

// ── Root component ────────────────────────────────────────────────────────────
export default function Home() {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      const pos = window.scrollY + 120;
      let current = 'home';
      NAV.forEach(([, id]) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= pos) current = id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const goto = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <Head>
        <title>Suhas Dhamapurkar | Data Analyst</title>
      </Head>

      {/* ── Nav ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.85)] backdrop-blur-xl">
        <div className="max-w-[1360px] mx-auto px-8 h-16 flex items-center justify-between">
          <button onClick={() => goto('home')} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-display font-bold text-xs shadow-lg shadow-primary/30">
              SD
            </div>
            <span className="font-display font-semibold text-sm text-text-primary hidden sm:block">
              Suhas Dhamapurkar
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map(([label, id]) => (
              <button
                key={id}
                onClick={() => goto(id)}
                className={`nav-link ${active === id ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="hidden sm:flex btn-primary py-2 px-5 text-xs">
              Resume
            </a>
            <button
              className="lg:hidden p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.97)] px-6 py-4"
            >
              <div className="flex flex-col gap-1">
                {NAV.map(([label, id]) => (
                  <button
                    key={id}
                    onClick={() => goto(id)}
                    className={`text-left py-3 px-3 rounded-lg text-sm transition-colors ${
                      active === id ? 'text-primary-light bg-primary/10' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                  className="mt-2 btn-primary justify-center">
                  Download Resume
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10">
        <HeroSection goto={goto} />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <AboutSection />
        <ContactSection />
      </main>

      <footer className="relative z-10 border-t border-[rgba(255,255,255,0.06)] py-8 text-center">
        <p className="text-text-muted text-sm">
          © {new Date().getFullYear()} Suhas Dhamapurkar &nbsp;·&nbsp; Built with Next.js &amp; Framer Motion
        </p>
      </footer>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection({ goto }) {
  const [photoError, setPhotoError] = useState(false);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center pt-24 pb-16">
      <div className="max-w-[1360px] mx-auto px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
              <span className="text-xs font-medium text-text-secondary">Available for opportunities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-[68px] leading-[1.05] tracking-tight mb-5"
            >
              <span className="gradient-text">Suhas Dhamapurkar</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="font-display text-lg sm:text-xl text-text-secondary font-medium mb-3 tracking-wide"
            >
              Data Analyst &nbsp;·&nbsp; BI Engineer &nbsp;·&nbsp; Founder of Resilytics
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="text-base text-text-muted leading-relaxed mb-10 max-w-lg"
            >
              I transform raw, messy data into decisions executives can act on — through precision SQL, production ML models,
              and dashboards that replace entire reporting workflows. Currently building{' '}
              <a href="https://resilytics.in" target="_blank" rel="noopener noreferrer"
                className="text-accent hover:underline underline-offset-4 transition-colors font-medium">
                Resilytics
              </a>
              {' '}— a production B2B analytics SaaS — entirely solo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="flex flex-wrap gap-3"
            >
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </a>
              <button onClick={() => goto('projects')} className="btn-ghost">
                View Projects
              </button>
              <a href="https://github.com/Suhas5497" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </motion.div>
          </div>

          {/* Right: Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 sm:w-[360px] sm:h-[360px]">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 via-accent/25 to-primary/15 blur-3xl animate-pulse-slow" />
              {/* Decorative ring */}
              <div className="absolute inset-1 rounded-full border border-primary/25" />
              {/* Inner accent ring */}
              <div className="absolute inset-3 rounded-full border border-accent/15" />
              {/* Photo */}
              <div className="absolute inset-5 rounded-full overflow-hidden border-2 border-primary/30 shadow-[0_0_60px_rgba(139,92,246,0.25)]">
                {photoError ? (
                  <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface flex items-center justify-center">
                    <span className="font-display font-bold text-5xl gradient-text">SD</span>
                  </div>
                ) : (
                  <img
                    src="/assets/profile.jpg"
                    alt="Suhas Dhamapurkar"
                    onError={() => setPhotoError(true)}
                    className="w-full h-full object-cover object-[center_15%]"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stat strip */}
        <div className="mt-20 grid sm:grid-cols-3 gap-4">
          {[
            { value: '35%', label: 'ETL processing time reduced at Labmentix', color: 'primary' },
            { value: '85%', label: 'XGBoost churn model accuracy on 7K+ records', color: 'primary' },
            { value: '6 hrs', label: 'Weekly analyst time saved via Power BI dashboards', color: 'accent' },
          ].map(({ value, label, color }, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.5 + i * 0.1)}
              className="glass rounded-2xl px-6 py-5"
            >
              <p className={`font-display font-bold text-3xl mb-1 ${color === 'accent' ? 'text-accent' : 'text-primary-light'}`}>
                {value}
              </p>
              <p className="text-sm text-text-muted leading-snug">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Experience ────────────────────────────────────────────────────────────────
function ExperienceSection() {
  return (
    <section id="experience" className="py-28">
      <div className="max-w-[1360px] mx-auto px-8">
        <motion.p {...fadeUp()} className="section-label">Experience</motion.p>
        <motion.h2 {...fadeUp(0.05)} className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-14">
          Where I've built things
        </motion.h2>

        <div className="space-y-6">
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              className={`glass rounded-2xl p-7 sm:p-8 border-l-2 ${
                exp.type === 'accent' ? 'border-l-accent' : 'border-l-primary'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-display font-bold text-xl text-text-primary">{exp.role}</h3>
                  <p className={`font-semibold text-sm mt-0.5 ${exp.type === 'accent' ? 'text-accent' : 'text-primary-light'}`}>
                    {exp.url ? (
                      <a href={exp.url} target="_blank" rel="noopener noreferrer"
                        className="hover:underline underline-offset-4">
                        {exp.company} ↗
                      </a>
                    ) : exp.company}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>
                </div>
                <span className="glass rounded-full px-4 py-1.5 text-xs font-medium text-text-secondary whitespace-nowrap">
                  {exp.period}
                </span>
              </div>
              <ul className="space-y-2.5">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                    <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${exp.type === 'accent' ? 'bg-accent' : 'bg-primary'}`} />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
function FeaturedVideo({ featured }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative bg-black/40 flex items-center justify-center min-h-[280px] lg:min-h-0 cursor-pointer overflow-hidden"
      onClick={() => !playing && setPlaying(true)}>
      {playing ? (
        <iframe
          src={featured.video}
          className="w-full h-full min-h-[280px] absolute inset-0"
          allow="autoplay"
          allowFullScreen
          title="Resilytics Product Walkthrough"
        />
      ) : (
        <>
          <img
            src={featured.image}
            alt="Resilytics Dashboard"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex flex-col items-center gap-3 group-hover:scale-105 transition-transform">
            <div className="w-16 h-16 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-accent/40 hover:bg-accent transition-colors">
              <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-white/80 text-xs font-semibold tracking-wider uppercase">Watch Product Walkthrough</p>
          </div>
        </>
      )}
    </div>
  );
}

function ProjectsSection() {
  const featured = PROJECTS.find((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-28">
      <div className="max-w-[1360px] mx-auto px-8">
        <motion.p {...fadeUp()} className="section-label">Projects</motion.p>
        <motion.h2 {...fadeUp(0.05)} className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-14">
          Analytics & engineering work
        </motion.h2>

        {/* Featured: Resilytics */}
        <motion.div {...fadeUp(0.1)} className="glass-accent rounded-2xl overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/25 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
                  <span className="text-xs font-semibold text-accent">Featured · Live in Production</span>
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-text-primary mb-2">
                  {featured.title}
                </h3>
                <p className="text-accent text-sm font-semibold mb-4">{featured.tagline}</p>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">{featured.description}</p>

                <div className="space-y-3 text-sm mb-6">
                  <div>
                    <span className="font-semibold text-text-primary">Problem: </span>
                    <span className="text-text-secondary">{featured.problem}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary">Approach: </span>
                    <span className="text-text-secondary">{featured.approach}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary">Outcome: </span>
                    <span className="text-text-secondary">{featured.outcome}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {featured.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-xs border border-accent/20 text-accent/80 bg-accent/5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <a href={featured.demo} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white font-semibold text-sm
                    shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Site
                </a>
                <a href={featured.github} target="_blank" rel="noopener noreferrer" className="btn-ghost py-2.5">
                  <GithubIcon />
                  GitHub
                </a>
              </div>
            </div>

            {/* Click-to-play video */}
            <FeaturedVideo featured={featured} />
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {rest.map((project, i) => (
            <ProjectCard key={project.id} project={project} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, delay }) {
  const [hovered, setHovered] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const dashboardImages = project.images || [];

  return (
    <>
      <motion.article
        {...fadeUp(delay)}
        className="glass rounded-2xl overflow-hidden flex flex-col group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative h-48 overflow-hidden bg-surface">
          <img
            src={project.image}
            alt={`${project.title} – cover`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />

          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 bg-[#0a0a0f]/82 backdrop-blur-sm flex items-end p-5"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-text-muted mb-1.5 font-semibold">Key Outcome</p>
                  <p className="text-sm text-text-primary leading-snug font-medium">{project.outcome}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-display font-bold text-base text-text-primary mb-1 group-hover:text-primary-light transition-colors">
            {project.title}
          </h3>
          <p className="text-xs text-primary-light font-semibold mb-3">{project.tagline}</p>
          <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">{project.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech.map((t) => (
              <span key={t} className="skill-pill text-xs">{t}</span>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary-light transition-colors">
                <GithubIcon className="w-4 h-4" />
                GitHub
              </a>
            )}
            {project.demo ? (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark transition-colors ml-auto">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Demo
              </a>
            ) : (
              <span className="text-xs text-text-muted/50 ml-auto py-1">Demo coming soon</span>
            )}
          </div>

          {/* Expandable dashboard gallery */}
          {dashboardImages.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
              <button
                onClick={() => setDashboardOpen((o) => !o)}
                className="w-full flex items-center justify-between text-xs font-semibold text-primary-light hover:text-primary transition-colors py-1"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View Dashboards ({dashboardImages.length})
                </span>
                <svg className={`w-3.5 h-3.5 transition-transform ${dashboardOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {dashboardOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2 pt-3">
                      {dashboardImages.map((img, i) => (
                        <button key={i} onClick={() => setLightboxIdx(i)}
                          className="relative h-24 overflow-hidden rounded-lg bg-surface border border-[rgba(255,255,255,0.07)] hover:border-primary/40 transition-colors group/thumb">
                          <img src={img} alt={`Dashboard ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105" />
                          <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors flex items-center justify-center">
                            <svg className="w-5 h-5 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                              fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.article>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={dashboardImages[lightboxIdx]} alt={`Dashboard ${lightboxIdx + 1}`}
                className="w-full h-auto rounded-xl shadow-2xl" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => setLightboxIdx(null)}
                  className="w-9 h-9 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  ✕
                </button>
              </div>
              {dashboardImages.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none px-3">
                  <button
                    className="pointer-events-auto w-10 h-10 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-white text-lg hover:bg-white/10 transition-colors"
                    onClick={() => setLightboxIdx((i) => (i - 1 + dashboardImages.length) % dashboardImages.length)}>
                    ‹
                  </button>
                  <button
                    className="pointer-events-auto w-10 h-10 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-white text-lg hover:bg-white/10 transition-colors"
                    onClick={() => setLightboxIdx((i) => (i + 1) % dashboardImages.length)}>
                    ›
                  </button>
                </div>
              )}
              <p className="text-center text-white/50 text-sm mt-3">
                {lightboxIdx + 1} / {dashboardImages.length} — click outside to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────
function SkillsSection() {
  return (
    <section id="skills" className="py-28">
      <div className="max-w-[1360px] mx-auto px-8">
        <motion.p {...fadeUp()} className="section-label">Skills</motion.p>
        <motion.h2 {...fadeUp(0.05)} className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
          Technical expertise
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="text-text-secondary mb-14 max-w-xl">
          Tools and techniques I use to take data from raw to decision-ready.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILLS.map((group, i) => (
            <motion.div key={group.label} {...fadeUp(i * 0.07)} className="glass rounded-2xl p-6">
              <h3 className={`font-display font-semibold text-sm mb-4 ${group.color === 'accent' ? 'text-accent' : 'text-primary-light'}`}>
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="skill-pill">{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div {...fadeUp(0.4)} className="mt-6 glass rounded-2xl p-6">
          <h3 className="font-display font-semibold text-sm text-primary-light mb-4">Certifications & Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {[
              '8th Rank — Imarticus Data Science Hackathon (Top 5%, 150+ participants)',
              'Data Analysis with Python — Forage',
              'AWS Cloud Fundamentals (hands-on; Cloud Practitioner cert in progress)',
            ].map((cert) => (
              <span key={cert} className="skill-pill">{cert}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────
function EducationSection() {
  return (
    <section id="education" className="py-28">
      <div className="max-w-[1360px] mx-auto px-8">
        <motion.p {...fadeUp()} className="section-label">Education</motion.p>
        <motion.h2 {...fadeUp(0.05)} className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-14">
          Academic background
        </motion.h2>

        <div className="grid sm:grid-cols-2 gap-5">
          {EDUCATION.map((edu, i) => (
            <motion.div key={i} {...fadeUp(i * 0.08)} className="glass rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${edu.color === 'primary' ? 'bg-primary shadow-[0_0_8px_rgba(139,92,246,0.7)]' : 'bg-accent shadow-[0_0_8px_rgba(6,182,212,0.7)]'}`} />
                <span className="glass rounded-full px-3 py-1 text-xs font-medium text-text-secondary whitespace-nowrap ml-auto">
                  {edu.period}
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-text-primary leading-snug mb-1">
                  {edu.degree}
                </h3>
                <p className={`text-sm font-semibold mb-2 ${edu.color === 'primary' ? 'text-primary-light' : 'text-accent'}`}>
                  {edu.institution}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">{edu.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function AboutSection() {
  const highlights = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: 'primary',
      label: 'Regional Math Champion',
      value: '2nd Rank',
      sub: 'NVS Mathematics Exhibition · Regional Level · Class XI',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'accent',
      label: 'Production SaaS',
      value: 'Resilytics',
      sub: 'Live B2B platform · FastAPI + DuckDB + React',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'primary',
      label: 'National Hackathon',
      value: 'Top 5%',
      sub: 'Ranked 8th of 150+ · Imarticus Data Science Hackathon',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'accent',
      label: 'Analytics Impact',
      value: '35% faster',
      sub: 'ETL cycle reduction · Labmentix · 2025',
    },
  ];

  const strengths = [
    {
      label: 'Production-grade output',
      body: 'Resilytics is live at resilytics.in — real tenants, real SQL migrations, automated release checks. Not a Jupyter demo; a deployed system.',
    },
    {
      label: 'Data to decision, not data to chart',
      body: 'Every deliverable closes with a ranked recommendation. At Labmentix, churn drivers were handed off to the retention team and acted on the next sprint.',
    },
    {
      label: 'Competitive-grade analytical depth',
      body: 'Ranked 8th of 150+ analysts nationwide at the Imarticus Data Science Hackathon — the same rigour I bring to every client engagement.',
    },
  ];

  return (
    <section id="about" className="py-28">
      <div className="max-w-[1360px] mx-auto px-8">
        <motion.p {...fadeUp()} className="section-label">About Me</motion.p>
        <motion.h2 {...fadeUp(0.05)} className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-12">
          From data foundations to production systems
        </motion.h2>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 mb-16 items-start">
          {/* Left: narrative */}
          <motion.div {...fadeUp(0.1)} className="space-y-5 text-text-secondary leading-relaxed text-[15px]">
            <p>
              My analytical instincts were forged at{' '}
              <span className="text-text-primary font-semibold">Jawahar Navodaya Vidyalaya, Ratnagiri</span> — a
              CBSE residential school of national merit. In Class XI, competing across schools from the entire
              region, I secured{' '}
              <span className="text-primary-light font-semibold">2nd Rank at Regional Level</span>{' '}
              in the Navodaya Vidyalaya Samiti Mathematics Exhibition. That early experience of turning rigorous
              mathematical reasoning into recognised results has defined how I approach every analytical problem
              since.
            </p>
            <p>
              Through a B.Tech in AI &amp; ML and a PG Program in Data Science &amp; Analytics at{' '}
              <span className="text-text-primary font-semibold">Imarticus Learning</span>, I built systems — not
              just notebooks. At the Imarticus Data Science Hackathon in April 2026, competing against 150+
              analysts, I placed{' '}
              <span className="text-primary-light font-semibold">8th nationally (Top 5%)</span>.
            </p>
            <p>
              At <span className="text-text-primary font-semibold">Labmentix Pvt. Ltd.</span>, I compressed
              weekly ETL cycles by 35%, productionized an XGBoost churn model that surfaced the top three
              retention levers, and eliminated four recurring manual Power BI reports consuming six analyst-hours
              per week.
            </p>
            <p>
              While studying, I designed and shipped every layer of{' '}
              <a href="https://resilytics.in" target="_blank" rel="noopener noreferrer"
                className="text-accent hover:underline underline-offset-4 font-semibold">Resilytics</a>{' '}
              solo — multi-tenant data ingestion, DuckDB analytics warehouse, Monte Carlo simulation engine, Basel
              III VaR-95 risk scoring, and a React/FastAPI production app with full tenant isolation. Raw CSV
              upload to board-ready PDF executive report.
            </p>
            <p className="border-l-2 border-primary/40 pl-4 py-1 text-text-primary font-medium italic">
              I think in pipelines and outcomes. Whether it&apos;s SQL or Altman Z-Scores, the end goal is always
              the same: a decision someone can act on.
            </p>
          </motion.div>

          {/* Right: achievement cards 2x2 grid */}
          <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 gap-3">
            {highlights.map((h, i) => (
              <motion.div key={i} {...fadeUp(0.15 + i * 0.07)}
                className={`glass rounded-xl p-4 flex flex-col gap-2.5 border transition-colors ${
                  h.color === 'accent'
                    ? 'border-accent/15 hover:border-accent/35'
                    : 'border-primary/15 hover:border-primary/35'
                }`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  h.color === 'accent' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary-light'
                }`}>
                  {h.icon}
                </div>
                <div>
                  <p className={`font-display font-bold text-lg leading-tight ${
                    h.color === 'accent' ? 'text-accent' : 'text-primary-light'
                  }`}>
                    {h.value}
                  </p>
                  <p className="text-text-primary text-xs font-semibold mt-0.5 mb-1">{h.label}</p>
                  <p className="text-text-muted text-[11px] leading-snug">{h.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Why work with me */}
        <motion.h3 {...fadeUp(0.2)} className="font-display font-bold text-xl text-text-primary mb-6">
          Why hire me
        </motion.h3>
        <div className="grid sm:grid-cols-3 gap-5">
          {strengths.map((s, i) => (
            <motion.div key={i} {...fadeUp(0.2 + i * 0.08)} className="glass rounded-2xl p-6">
              <div className="w-8 h-0.5 bg-primary mb-5 rounded-full" />
              <h4 className="font-display font-semibold text-sm text-primary-light mb-3 leading-snug">{s.label}</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const sub = encodeURIComponent(`Portfolio Contact: ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.open(`mailto:suhasdhamapurkar1710@gmail.com?subject=${sub}&body=${body}`);
  };

  const contactLinks = [
    {
      label: 'Email',
      value: 'suhasdhamapurkar1710@gmail.com',
      href: 'mailto:suhasdhamapurkar1710@gmail.com',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Phone',
      value: '+91 8767306302',
      href: 'tel:+918767306302',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/suhas-1710d',
      href: 'https://linkedin.com/in/suhas-1710d',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      label: 'GitHub',
      value: 'github.com/Suhas5497',
      href: 'https://github.com/Suhas5497',
      icon: <GithubIcon className="w-5 h-5" />,
    },
  ];

  return (
    <section id="contact" className="py-28">
      <div className="max-w-[1360px] mx-auto px-8">
        <motion.p {...fadeUp()} className="section-label">Contact</motion.p>
        <motion.h2 {...fadeUp(0.05)} className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
          Let's work together
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="text-text-secondary mb-14 max-w-lg">
          Whether it's building a dashboard, designing a pipeline, or shaping a predictive model — reach out.
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Links */}
          <motion.div {...fadeUp(0.1)} className="space-y-3">
            {contactLinks.map(({ label, value, href, icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="glass flex items-center gap-4 p-4 rounded-xl group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-light
                  group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                    {value}
                  </p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            {...fadeUp(0.15)}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-7 sm:p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2">Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(255,255,255,0.08)]
                    text-text-primary text-sm placeholder:text-text-muted
                    focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(255,255,255,0.08)]
                    text-text-primary text-sm placeholder:text-text-muted
                    focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                />
              </label>
            </div>
            <label className="block">
              <span className="block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2">Message</span>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project or data challenge..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[rgba(255,255,255,0.08)]
                  text-text-primary text-sm placeholder:text-text-muted resize-none
                  focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
              />
            </label>
            <button type="submit" className="btn-primary w-full justify-center">
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

// ── Icon helper ───────────────────────────────────────────────────────────────
function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
