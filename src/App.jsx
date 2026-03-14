import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import revenueForecastData from "./data/revenue_forecast.json";
import churnDriversData from "./data/churn_drivers.json";
import skillsRadarData from "./data/skills_radar.json";

const stackBadges = ["SQL", "Python", "Machine Learning", "Power BI", "Excel", "Tableau"];

const DEMO_URLS = {
  churn: "https://customer-churn-demo.streamlit.app",
  retail: "https://retail-sales-dashboard.streamlit.app",
};

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const badgeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.4 + i * 0.05 },
  }),
};

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800">
      <Header />
      <main className="pt-16">
        <Hero />
        <About />
        <FeaturedPlatform />
        <Projects />
        <InteractiveDemos />
        <AnalyticsVisuals />
        <Skills />
        <GithubShowcase />
        <ResumeSection />
        <Contact />
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-6xl px-4">
          <p>© {new Date().getFullYear()} Suhas Dhamapurkar · Data Analyst Portfolio</p>
          <p className="mt-1 text-xs text-slate-400">Built with passion for data-driven insights</p>
        </div>
      </footer>
    </div>
  );
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => scrollToId("hero")}
          data-testid="header-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-sm font-bold tracking-wide text-white shadow-lg shadow-emerald-500/30">
            SD
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Suhas Dhamapurkar
            </p>
            <p className="text-xs text-slate-500">
              Data Analyst | Analytics Engineer
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          {[
            ["About", "about"],
            ["Platform", "platform"],
            ["Projects", "projects"],
            ["Visuals", "visuals"],
            ["Skills", "skills"],
            ["GitHub", "github"],
            ["Contact", "contact"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollToId(id)}
              data-testid={`nav-${id}`}
              className="relative font-medium transition-colors hover:text-emerald-600"
            >
              {label}
            </button>
          ))}
        </nav>
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-toggle"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <div className="flex flex-col px-4 py-3 space-y-2">
              {[
                ["About", "about"],
                ["Platform", "platform"],
                ["Projects", "projects"],
                ["Visuals", "visuals"],
                ["Skills", "skills"],
                ["GitHub", "github"],
                ["Contact", "contact"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => { scrollToId(id); setMobileMenuOpen(false); }}
                  className="text-left py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className="border-b border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-24 md:flex-row md:items-center md:pb-20 md:pt-28">
        <motion.div
          className="flex-1"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Data Analyst · Analytics Engineer
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Suhas Dhamapurkar
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600 leading-relaxed">
            Transforming raw data into{" "}
            <span className="font-semibold text-emerald-600">actionable business insights</span>{" "}
            through predictive models, retail analytics, and decision
            intelligence dashboards.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {stackBadges.map((badge, i) => (
              <motion.span
                key={badge}
                custom={i}
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-sm text-slate-700 shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                {badge}
              </motion.span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => scrollToId("projects")}
              data-testid="view-projects-btn"
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              View Projects
            </button>
            <a
              href="https://github.com/Suhas5497"
              target="_blank"
              rel="noopener"
              data-testid="github-hero-btn"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-400 hover:text-emerald-600 hover:shadow-md"
            >
              GitHub
            </a>
            <button
              onClick={() => scrollToId("resume")}
              data-testid="resume-hero-btn"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-400 hover:text-emerald-600 hover:shadow-md"
            >
              Download Resume
            </button>
          </div>
        </motion.div>
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.45, ease: "easeOut" }}
        >
          <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50">
            <div className="absolute -top-3 -right-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Live Preview
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-slate-800">
                Analytics Snapshot
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-600">
                Simulated data
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Revenue Forecast
                </p>
                <div className="h-36 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueForecastData}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" hide />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          fontSize: "0.75rem",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#areaGradient)"
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#0d9488"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Churn Risk Drivers
                </p>
                <div className="h-36 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={churnDriversData} layout="vertical">
                      <XAxis type="number" hide domain={[0, 1]} />
                      <YAxis
                        type="category"
                        dataKey="feature"
                        width={75}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Bar
                        dataKey="importance"
                        fill="url(#barGradient)"
                        radius={[0, 8, 8, 0]}
                        barSize={12}
                      />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Section({ id, eyebrow, title, children, className = "" }) {
  return (
    <section id={id} className={`border-b border-slate-200/80 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-8">
          {eyebrow && (
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-600">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About" title="Data analytics with a product mindset" className="bg-white">
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-lg leading-relaxed text-slate-600">
            I am a data analyst with a background in{" "}
            <span className="font-semibold text-emerald-600">
              Artificial Intelligence & Machine Learning
            </span>
            , focused on converting messy, real-world data into decision-ready
            analytics experiences. I enjoy the full lifecycle: from clean data
            pipelines and statistical modelling to interactive dashboards that
            help business teams act with confidence.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AboutCard
            title="Programming"
            items={["Python", "SQL", "EDA workflows", "Feature engineering"]}
            icon="code"
          />
          <AboutCard
            title="Visualization"
            items={["Power BI", "Tableau", "Analytics dashboards", "Storytelling"]}
            icon="chart"
          />
          <AboutCard
            title="Machine Learning"
            items={[
              "Supervised & unsupervised",
              "Time series forecasting",
              "Evaluation & monitoring",
            ]}
            icon="brain"
          />
          <AboutCard
            title="Business Focus"
            items={["Retail analytics", "Customer churn", "Decision intelligence"]}
            icon="briefcase"
          />
        </div>
      </div>
    </Section>
  );
}

function AboutCard({ title, items, icon }) {
  const icons = {
    code: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    chart: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    brain: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    briefcase: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition-all hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1">
      <div className="mb-3 flex items-center gap-2 text-emerald-600">
        {icons[icon]}
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          {title}
        </h3>
      </div>
      <ul className="space-y-1.5 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeaturedPlatform() {
  return (
    <Section
      id="platform"
      eyebrow="Featured Analytics Platform"
      title="Resilytics — Retail Decision Intelligence Platform"
      className="bg-gradient-to-br from-slate-50 to-emerald-50/30"
    >
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <p className="text-lg text-slate-600 leading-relaxed">
            <span className="font-bold text-emerald-600">Resilytics</span> is a
            retail decision intelligence platform concept that combines
            automated data pipelines, machine learning, and analytics dashboards
            to answer a single question:{" "}
            <span className="italic font-medium text-slate-700">
              "What should we do next to improve performance?"
            </span>
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Automated ETL from transactional and marketing systems",
              "Demand forecasting for products and stores",
              "Store and segment level profitability analytics",
              "Insight tiles for pricing, discounting, and retention",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-600">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 pt-2">
            {["Python + SQL ETL", "ML Forecasting", "Power BI Dashboards"].map((tag) => (
              <span key={tag} className="rounded-full bg-white border border-emerald-200 px-4 py-1.5 text-sm font-medium text-emerald-700 shadow-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={() => scrollToId("projects")}
              data-testid="explore-projects-btn"
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore Related Projects
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <ArchitectureDiagram />
          <VideoPlaceholder />
        </div>
      </div>
    </Section>
  );
}

function ArchitectureDiagram() {
  const nodes = [
    { name: "Data Sources", icon: "database" },
    { name: "ETL Pipeline", icon: "cog" },
    { name: "ML Models", icon: "brain" },
    { name: "Dashboards", icon: "chart" },
    { name: "Insights", icon: "lightbulb" },
  ];
  
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
      <p className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
        High-Level Architecture
      </p>
      <div className="flex flex-col gap-2">
        {nodes.map((node, idx) => (
          <React.Fragment key={node.name}>
            <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <span className="text-xs font-bold">{idx + 1}</span>
              </div>
              <span className="font-medium text-slate-700">{node.name}</span>
            </div>
            {idx < nodes.length - 1 && (
              <div className="flex justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
      <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
        Product Walkthrough
      </p>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">
            Platform demo video coming soon
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href="https://github.com/Suhas5497"
          target="_blank"
          rel="noopener"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-600 transition-all"
        >
          GitHub Repository
        </a>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Analytics and Machine Learning Projects"
      className="bg-white"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <ProjectCard
          index={1}
          title="Customer Churn Prediction System"
          description="End-to-end churn prediction system powered by machine learning and a Streamlit analytics app for telecom decision-makers."
          tech={["Python", "Scikit-learn", "Streamlit", "EDA", "Feature Importance"]}
          image="/assets/churn-model.png"
          links={{
            github: "https://github.com/Suhas5497/customer-churn-prediction-system",
            demo: DEMO_URLS.churn,
          }}
          details={{
            problem: "Identify customers at high risk of churn before they leave and reduce revenue loss.",
            approach: "Performed EDA, feature engineering, and trained classification models with hyperparameter tuning and cross-validation.",
            insights: "Surfaced key churn drivers and provided a ranked list of high-risk customers through an interactive app.",
          }}
        />
        <ProjectCard
          index={2}
          title="Yes Bank Stock Price Forecasting"
          description="Time series forecasting using LSTM to predict Yes Bank stock prices with visual confidence bands."
          tech={["TensorFlow", "LSTM", "Time Series", "NSE Data"]}
          image="/assets/stock-forecast-chart.png"
          links={{
            github: "https://github.com/Suhas5497/Yes-Bank-Stock-Price-Analysis-Future-Price-Prediction",
          }}
          details={{
            problem: "Forecast short-term stock movement to support trading and risk insights.",
            approach: "Built sequence-based LSTM models, compared against regression baselines, and evaluated using MAE/MSE.",
            insights: "Delivered scenario visualizations showing historical vs. predicted prices for better decision support.",
          }}
        />
        <ProjectCard
          index={3}
          title="Retail Sales Intelligence Platform"
          description="Analytics dashboard for multi-store retail performance, tracking KPIs from revenue to product performance."
          tech={["Power BI", "DAX", "Sales Analytics"]}
          image="/assets/retail-sales-dashboard.png"
          links={{
            github: "https://github.com/Suhas5497/sales-intelligence-platform",
            demo: DEMO_URLS.retail,
          }}
          details={{
            problem: "Give retail leaders a single view of store performance without manual spreadsheet reports.",
            approach: "Built a Power BI model with DAX measures and slicers across segments, categories, and time.",
            insights: "Highlighted underperforming stores and products, unlocking targeted actions on assortment and discounting.",
          }}
        />
        <ProjectCard
          index={4}
          title="Amazon Prime Content Analysis"
          description="Content analytics of 10,000+ titles to understand genre mix, release trends, and catalog gaps."
          tech={["Python", "Pandas", "NLP", "WordCloud"]}
          image="/assets/resilytics-dashboard.png"
          links={{
            github: "https://github.com/Suhas5497/Amazone-Prime-Analysis",
          }}
          details={{
            problem: "Support content strategy with data-backed insights into catalog composition and user-facing themes.",
            approach: "Used Pandas, visualization, and basic NLP with WordCloud to cluster themes and identify underrepresented genres.",
            insights: "Revealed imbalances in genre coverage and regional content mix, informing future acquisition focus.",
          }}
        />
      </div>
    </Section>
  );
}

function ProjectCard({ index, title, description, tech, links, details, image }) {
  return (
    <motion.article
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-200 hover:-translate-y-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      data-testid={`project-card-${index}`}
    >
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100"
        >
          <span className="text-emerald-600 font-medium">Project {index}</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            Project {index.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tech.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="font-semibold text-slate-800">Problem</dt>
            <dd className="text-slate-600">{details.problem}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">Approach</dt>
            <dd className="text-slate-600">{details.approach}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">Insights</dt>
            <dd className="text-slate-600">{details.insights}</dd>
          </div>
        </dl>
        <div className="mt-auto pt-4 flex flex-wrap gap-3 border-t border-slate-100">
          {links.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener"
              data-testid={`github-link-${index}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          )}
          {links.demo ? (
            <a
              href={links.demo}
              target="_blank"
              rel="noopener"
              data-testid={`demo-link-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Launch Demo
            </a>
          ) : (
            <span
              title="Demo coming soon"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Demo Coming Soon
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function InteractiveDemos() {
  const [activeDemo, setActiveDemo] = useState(null);
  
  return (
    <Section
      id="demos"
      eyebrow="Interactive Demos"
      title="Live Analytics Experiences"
      className="bg-gradient-to-br from-slate-50 to-emerald-50/30"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <DemoCard
          title="Customer Churn Streamlit App"
          description="Explore churn risk by segment, filter customers, and observe how probability changes with contract and tenure."
          github="https://github.com/Suhas5497/customer-churn-prediction-system"
          demoKey="churn"
          previewImage="/assets/churn-model.png"
          onPreview={() => setActiveDemo("churn")}
        />
        <DemoCard
          title="Retail Sales Dashboard"
          description="Drill into store, category, and time to understand revenue, profitability, and product performance."
          github="https://github.com/Suhas5497/sales-intelligence-platform"
          demoKey="retail"
          previewImage="/assets/retail-sales-dashboard.png"
          onPreview={() => setActiveDemo("retail")}
        />
      </div>
      
      <AnimatePresence>
        {activeDemo && (
          <DemoModal 
            demoKey={activeDemo} 
            onClose={() => setActiveDemo(null)} 
          />
        )}
      </AnimatePresence>
    </Section>
  );
}

function DemoCard({ title, description, github, demoKey, previewImage, onPreview }) {
  const demoUrl = DEMO_URLS[demoKey];
  const isDemoAvailable = Boolean(demoUrl);
  
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
        {previewImage && (
          <img 
            src={previewImage} 
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
        {isDemoAvailable && (
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={onPreview}
              data-testid={`preview-${demoKey}-btn`}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-lg hover:bg-emerald-50 transition-colors"
            >
              Preview in Modal
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-auto pt-4 flex flex-wrap gap-3">
          <a
            href={github}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          {isDemoAvailable ? (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener"
              data-testid={`launch-${demoKey}-btn`}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Launch Demo
            </a>
          ) : (
            <span
              title="Demo coming soon"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              Demo Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function DemoModal({ demoKey, onClose }) {
  const demoUrl = DEMO_URLS[demoKey];
  const titles = {
    churn: "Customer Churn Prediction App",
    retail: "Retail Sales Dashboard",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">{titles[demoKey]}</h3>
          <div className="flex items-center gap-3">
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
            >
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              data-testid="close-modal-btn"
              className="rounded-full p-2 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="aspect-video w-full bg-slate-100">
          <iframe
            src={demoUrl}
            title={titles[demoKey]}
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnalyticsVisuals() {
  return (
    <Section
      id="visuals"
      eyebrow="Analytics Visualizations"
      title="How I Think in Charts"
      className="bg-white"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm hover:shadow-lg transition-all">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
            Revenue Forecast
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueForecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    fontSize: "0.75rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Historical"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Forecast"
                  stroke="#0d9488"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#0d9488", strokeWidth: 0, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm hover:shadow-lg transition-all">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
            Customer Churn Drivers
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={churnDriversData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="feature"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  domain={[0, 1]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    fontSize: "0.75rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="importance"
                  fill="url(#chartBarGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="chartBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm hover:shadow-lg transition-all">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
            Skill Radar
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsRadarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <PolarRadiusAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickCount={4}
                />
                <Radar
                  dataKey="score"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Skills() {
  const skillBars = [
    { label: "Python, Pandas & NumPy", value: 92 },
    { label: "Machine Learning (sklearn)", value: 88 },
    { label: "Deep Learning (TensorFlow, LSTM)", value: 84 },
    { label: "NLP (NLTK, TF-IDF, CountVectorizer)", value: 86 },
    { label: "SQL & BI Dashboards", value: 90 },
  ];

  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Technical Skills Mapped to Outcomes"
      className="bg-gradient-to-br from-slate-50 to-emerald-50/30"
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="grid gap-5 sm:grid-cols-2">
          <SkillCategory
            title="Programming"
            description="Python, SQL, scripting analytics workflows, and automation."
          />
          <SkillCategory
            title="Analytics"
            description="EDA, hypothesis testing, experiment analysis, and business performance reviews."
          />
          <SkillCategory
            title="Visualization"
            description="Power BI, Tableau, and Excel dashboards with stakeholder focus."
          />
          <SkillCategory
            title="Machine Learning"
            description="Regression, classification, clustering, time series, and NLP with libraries like Scikit-learn and TensorFlow."
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h3 className="mb-5 text-lg font-bold text-slate-800">Skill Proficiency</h3>
          <div className="space-y-5">
            {skillBars.map((skill) => (
              <div key={skill.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{skill.label}</span>
                  <span className="font-bold text-emerald-600">{skill.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function SkillCategory({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all">
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-600">
        {title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function GithubShowcase() {
  const repos = [
    {
      name: "customer-churn-prediction-system",
      description: "End-to-end telecom churn prediction with ML models and Streamlit analytics.",
      language: "Jupyter Notebook",
      url: "https://github.com/Suhas5497/customer-churn-prediction-system",
    },
    {
      name: "sales-intelligence-platform",
      description: "Retail sales intelligence platform with analytics dashboards and insights.",
      language: "Python",
      url: "https://github.com/Suhas5497/sales-intelligence-platform",
    },
    {
      name: "Yes-Bank-Stock-Price-Analysis",
      description: "Yes Bank stock price analysis and LSTM-based forecasting.",
      language: "Jupyter Notebook",
      url: "https://github.com/Suhas5497/Yes-Bank-Stock-Price-Analysis-Future-Price-Prediction",
    },
  ];
  
  return (
    <Section
      id="github"
      eyebrow="GitHub"
      title="Selected Repositories"
      className="bg-white"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener"
            data-testid={`repo-${repo.name}`}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition-all hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1"
          >
            <div className="mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors truncate">
                {repo.name}
              </span>
            </div>
            <p className="mb-3 text-sm text-slate-600 line-clamp-2">
              {repo.description}
            </p>
            <div className="mt-auto flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                {repo.language}
              </span>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a
          href="https://github.com/Suhas5497"
          target="_blank"
          rel="noopener"
          data-testid="view-all-repos-btn"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-600 hover:shadow-md transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          View All Repositories on GitHub
        </a>
      </div>
    </Section>
  );
}

function ResumeSection() {
  return (
    <Section
      id="resume"
      eyebrow="Resume"
      title="Download Resume"
      className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between rounded-2xl border border-emerald-200 bg-white p-8 shadow-lg">
        <div>
          <p className="max-w-xl text-lg text-slate-600 leading-relaxed">
            Download a concise PDF version of my resume with education, skills,
            and project highlights for offline review.
          </p>
        </div>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener"
          data-testid="download-resume-btn"
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Resume
        </a>
      </div>
    </Section>
  );
}

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact: ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.open(`mailto:suhasdhamapurkar1710@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's Talk About Data"
      className="bg-white"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          <p className="text-lg text-slate-600 leading-relaxed">
            Whether it's building a new dashboard, exploring a dataset, or
            shaping a predictive model for your product, I'd be happy to
            collaborate.
          </p>
          <div className="space-y-4">
            <ContactItem
              icon="email"
              label="Email"
              value="suhasdhamapurkar1710@gmail.com"
              href="mailto:suhasdhamapurkar1710@gmail.com"
            />
            <ContactItem
              icon="linkedin"
              label="LinkedIn"
              value="linkedin.com/in/suhas-1710d"
              href="https://linkedin.com/in/suhas-1710d"
            />
            <ContactItem
              icon="github"
              label="GitHub"
              value="github.com/Suhas5497"
              href="https://github.com/Suhas5497"
            />
          </div>
        </div>
        <form
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="contact-name-input"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="contact-email-input"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Message</span>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              data-testid="contact-message-input"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
              placeholder="Tell me about your role, data challenge, or idea..."
            />
          </label>
          <button
            type="submit"
            data-testid="contact-submit-btn"
            className="mt-5 w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Send Message via Email
          </button>
        </form>
      </div>
    </Section>
  );
}

function ContactItem({ icon, label, value, href }) {
  const icons = {
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  };

  return (
    <a
      href={href}
      target={icon !== "email" ? "_blank" : undefined}
      rel={icon !== "email" ? "noopener" : undefined}
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
        {icons[icon]}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-700 group-hover:text-emerald-600 transition-colors">{value}</p>
      </div>
    </a>
  );
}

export default App;
