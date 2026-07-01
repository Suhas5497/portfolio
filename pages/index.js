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
    image: '/assets/resilytics-dashboard.png',
  },
  {
    id: 'ecommerce',
    featured: false,
    title: 'E-Commerce Business Analytics',
    tagline: 'Imarticus PG Capstone Project',
    description:
      'Analyzed 100,000+ orders across 9 relational tables using advanced SQL and Power BI to surface actionable business insights.',
    problem: 'No consolidated view of customer value, product revenue concentration, or delivery failures.',
    approach:
      'Advanced SQL (CTEs, window functions RANK/LAG/NTILE, stored procedures), RFM segmentation, Pareto analysis, cohort retention, and Power BI drill-through dashboard.',
    outcome:
      'Top 5 categories = 62% of revenue (Pareto); cohort retention table; drill-through report exposing delivery-delay root causes.',
    tech: ['SQL', 'Power BI', 'DAX', 'Python', 'CTEs', 'Window Functions'],
    github: 'https://github.com/Suhas5497/ecommerce-sql-analytics',
    demo: null,
    image: '/assets/churn-model.png',
  },
  {
    id: 'retail',
    featured: false,
    title: 'Retail Sales Intelligence Dashboard',
    tagline: 'Power BI · 4-Page Interactive Report',
    description:
      'Built a 4-page interactive Power BI dashboard analyzing ₹29.4L in sales across 2015–2018 with drill-down, KPI tracking, and risk action plan.',
    problem: 'Regional managers had no visibility into delivery delays, return rate trends, or target gaps.',
    approach:
      'KPI cards, YoY DAX measures, dynamic slicers, decomposition tree, and a dedicated risk action plan page.',
    outcome:
      'Central region = 60% of sales (concentration risk); Standard Class averaged 5-day delays; return rate rose from 5.4% to 6.9%; 88.48% target achievement tracked.',
    tech: ['Power BI', 'DAX', 'Star Schema', 'Excel'],
    github: 'https://github.com/Suhas5497/sales-intelligence-platform',
    demo: 'https://sales-intelligence-platform-dovb9bnzxw69tvcorxpqqz.streamlit.app/',
    image: '/assets/retail-sales-dashboard.png',
  },
  {
    id: 'yesbank',
    featured: false,
    title: 'Yes Bank Stock Price Forecasting',
    tagline: 'Time Series / ML · SARIMA + Random Forest',
    description:
      'Analyzed 15 years of Yes Bank stock data and built ML forecasting models to study volatility around the 2018 fraud case.',
    problem: 'Quantify the risk and price trajectory of a fraud-impacted stock using statistical and ML models.',
    approach:
      'Compared Random Forest, ARIMA, and SARIMA models; statistical analysis of the ~96% price decline from the 2018 peak.',
    outcome:
      'SARIMA forecast: ₹15.80 next month; Random Forest R² = 0.97 (MAE ₹14.96, RMSE ₹23.57).',
    tech: ['Python', 'SARIMA', 'ARIMA', 'Random Forest', 'Pandas', 'Matplotlib'],
    github: 'https://github.com/Suhas5497/Yes-Bank-Stock-Price-Analysis-Future-Price-Prediction',
    demo: null,
    image: '/assets/stock-forecast-chart.png',
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
    label: 'Python & Data Science',
    color: 'primary',
    items: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter Notebook'],
  },
  {
    label: 'Machine Learning',
    color: 'primary',
    items: ['Scikit-learn', 'XGBoost', 'TensorFlow', 'ARIMA', 'SARIMA', 'Random Forest', 'Regression', 'Classification', 'Clustering', 'A/B Testing', 'Cohort Analysis', 'Hypothesis Testing'],
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
    detail: 'Ranked 8th (Top 5%) in the Imarticus Data Science Hackathon, Apr 2026 (150+ participants nationwide)',
  },
  {
    degree: 'B.Tech in Artificial Intelligence & Machine Learning',
    institution: "KIT's College of Engineering, Kolhapur",
    period: '2021 – 2025',
    detail: 'CGPA: 7.45 / 10',
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
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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
      <div className="max-w-6xl mx-auto px-6 w-full">
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
              className="font-display font-bold text-5xl sm:text-6xl lg:text-[68px] leading-[1.05] tracking-tight text-text-primary mb-5"
            >
              <span className="gradient-text">Suhas</span>{' '}
              Dhamapurkar
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="font-display text-lg sm:text-xl text-text-secondary font-medium mb-3"
            >
              Data Analyst &nbsp;·&nbsp; AI-Powered Business Intelligence Builder
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="text-base text-text-muted leading-relaxed mb-10 max-w-lg"
            >
              Turning raw data into board-ready decisions — from ETL pipelines and ML models to production SaaS. Founder of{' '}
              <a href="https://resilytics.in" target="_blank" rel="noopener noreferrer"
                className="text-accent hover:text-accent-dark transition-colors">
                Resilytics
              </a>.
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
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 blur-2xl animate-pulse-slow" />
              {/* Ring border */}
              <div className="absolute inset-2 rounded-full border-2 border-primary/30" />
              {/* Photo container */}
              <div className="absolute inset-4 rounded-full overflow-hidden border-2 border-primary/20 shadow-2xl">
                {photoError ? (
                  <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface flex items-center justify-center">
                    <span className="font-display font-bold text-4xl gradient-text">SD</span>
                  </div>
                ) : (
                  <img
                    src="/assets/profile.jpg"
                    alt="Suhas Dhamapurkar"
                    onError={() => setPhotoError(true)}
                    className="w-full h-full object-cover object-top"
                  />
                )}
              </div>
              {/* Floating stat chips */}
              <div className="absolute -bottom-4 -left-8 glass rounded-xl px-4 py-2.5 shadow-xl">
                <p className="text-xs text-text-muted font-medium">Hackathon Rank</p>
                <p className="text-sm font-display font-bold text-primary-light">Top 5% · #8 of 150+</p>
              </div>
              <div className="absolute -top-2 -right-6 glass rounded-xl px-4 py-2.5 shadow-xl">
                <p className="text-xs text-text-muted font-medium">Resilytics</p>
                <p className="text-sm font-display font-bold text-accent">Live in Production</p>
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
      <div className="max-w-6xl mx-auto px-6">
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
function ProjectsSection() {
  const featured = PROJECTS.find((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-28">
      <div className="max-w-6xl mx-auto px-6">
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

            {/* Video embed */}
            <div className="relative bg-black/40 flex items-center justify-center min-h-[280px] lg:min-h-0">
              <iframe
                src={featured.video}
                className="w-full h-full min-h-[280px]"
                allow="autoplay"
                allowFullScreen
                title="Resilytics Product Walkthrough"
              />
            </div>
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

  return (
    <motion.article
      {...fadeUp(delay)}
      className="glass rounded-2xl overflow-hidden flex flex-col group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-primary/85 flex items-center justify-center p-6 text-center"
            >
              <div className="text-white">
                <p className="text-xs uppercase tracking-widest mb-2 opacity-70">Key Outcome</p>
                <p className="font-semibold text-sm leading-snug">{project.outcome}</p>
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
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary-light transition-colors">
            <GithubIcon className="w-4 h-4" />
            GitHub
          </a>
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
      </div>
    </motion.article>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────
function SkillsSection() {
  return (
    <section id="skills" className="py-28">
      <div className="max-w-6xl mx-auto px-6">
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
      <div className="max-w-6xl mx-auto px-6">
        <motion.p {...fadeUp()} className="section-label">Education</motion.p>
        <motion.h2 {...fadeUp(0.05)} className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-14">
          Academic background
        </motion.h2>

        <div className="relative max-w-2xl">
          {/* Vertical line */}
          <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />

          <div className="space-y-10">
            {EDUCATION.map((edu, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="flex gap-6">
                <div className="flex-shrink-0 w-10 flex justify-center">
                  <div className={`mt-1 ${i === 0 ? 'timeline-dot' : 'timeline-dot-accent'}`} />
                </div>
                <div className="glass rounded-2xl p-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-base text-text-primary leading-snug">
                      {edu.degree}
                    </h3>
                    <span className="glass rounded-full px-3 py-1 text-xs font-medium text-text-secondary whitespace-nowrap">
                      {edu.period}
                    </span>
                  </div>
                  <p className={`text-sm font-semibold mb-2 ${i === 0 ? 'text-primary-light' : 'text-accent'}`}>
                    {edu.institution}
                  </p>
                  <p className="text-sm text-text-secondary">{edu.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function AboutSection() {
  const strengths = [
    {
      icon: '🚀',
      title: 'I ship production work, not just notebooks',
      body: "Resilytics is live at resilytics.in with real tenants, real SQL migrations, and automated release checks — not a demo repo.",
    },
    {
      icon: '🎯',
      title: 'I close the gap between data and decisions',
      body: 'Every project ends with a business recommendation, not just a chart. At Labmentix, churn drivers were adopted by the retention team. At Resilytics, reports go straight to a CFO.',
    },
    {
      icon: '📊',
      title: 'I rank in the top 5% competitively',
      body: '8th of 150+ participants at the Imarticus Data Science Hackathon (Apr 2026) — applying the same pressure-tested analytical approach I bring to every engagement.',
    },
  ];

  return (
    <section id="about" className="py-28">
      <div className="max-w-6xl mx-auto px-6">
        <motion.p {...fadeUp()} className="section-label">About Me</motion.p>
        <motion.h2 {...fadeUp(0.05)} className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-10">
          Builder with a data obsession
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 mb-14">
          <motion.div {...fadeUp(0.1)} className="space-y-5 text-text-secondary leading-relaxed">
            <p>
              I'm a data analyst with a B.Tech in AI & ML who went from building ETL pipelines at a telecom startup
              to designing <a href="https://resilytics.in" target="_blank" rel="noopener noreferrer"
                className="text-accent hover:underline underline-offset-4">Resilytics</a> — a production multi-tenant
              SaaS platform — entirely solo.
            </p>
            <p>
              My path: Built foundations in AI & ML at KIT's College of Engineering (2021–2025), then put theory
              into practice as a Data Analyst Intern at Labmentix, where I shipped an XGBoost churn model and Power BI
              dashboards that replaced four manual weekly reports. While completing my PG Program at Imarticus Learning,
              I designed and deployed every layer of Resilytics myself: data ingestion, DuckDB analytics warehouse,
              Monte Carlo simulation engine, and a React/FastAPI production app with tenant isolation.
            </p>
            <p>
              I think in pipelines and outcomes — not just charts. Whether it's SQL or Altman Z-Scores, the end goal
              is always the same: a decision someone can act on.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.15)}>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h3 className="font-display font-semibold text-sm text-primary-light uppercase tracking-widest mb-5">
                At a glance
              </h3>
              <dl className="space-y-4 text-sm">
                {[
                  ['Location', 'Pune, Maharashtra, India'],
                  ['Open to', 'Full-time / Contract data analyst roles'],
                  ['Stack', 'SQL · Python · Power BI · FastAPI · PostgreSQL'],
                  ['LinkedIn', <a key="li" href="https://linkedin.com/in/suhas-1710d" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">linkedin.com/in/suhas-1710d</a>],
                  ['GitHub', <a key="gh" href="https://github.com/Suhas5497" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">github.com/Suhas5497</a>],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4">
                    <dt className="w-24 flex-shrink-0 text-text-muted font-medium">{label}</dt>
                    <dd className="text-text-secondary">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>

        {/* Why hire me */}
        <motion.h3 {...fadeUp(0.2)} className="font-display font-bold text-xl text-text-primary mb-6">
          Why hire me
        </motion.h3>
        <div className="grid sm:grid-cols-3 gap-5">
          {strengths.map((s, i) => (
            <motion.div key={i} {...fadeUp(0.2 + i * 0.08)} className="glass rounded-2xl p-6">
              <span className="text-2xl mb-4 block">{s.icon}</span>
              <h4 className="font-display font-semibold text-sm text-text-primary mb-2 leading-snug">{s.title}</h4>
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
      <div className="max-w-6xl mx-auto px-6">
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
