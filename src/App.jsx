import React from "react";
import { motion } from "framer-motion";
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
} from "recharts";
import revenueForecastData from "./data/revenue_forecast.json";
import churnDriversData from "./data/churn_drivers.json";
import skillsRadarData from "./data/skills_radar.json";

const stackBadges = ["SQL", "Python", "Machine Learning", "Power BI", "Excel"];

const DEMO_URLS = {
  churn: "",
  retail: "https://sales-intelligence-platform-dovb9bnzxw69tvcorxpqqz.streamlit.app/",
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
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
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Suhas Dhamapurkar · Data Analyst Portfolio
      </footer>
    </div>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => scrollToId("hero")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-sky-500 to-indigo-500 text-xs font-semibold tracking-wide text-slate-950 shadow-lg shadow-sky-500/40">
            SD
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">
              Suhas Dhamapurkar
            </p>
            <p className="text-[0.65rem] text-slate-500">
              Data Analyst | Analytics Engineer
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-5 text-xs text-slate-300 md:flex">
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
              className="relative transition hover:text-sky-400"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className="border-b border-slate-800/80 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-12 pt-20 md:flex-row md:items-center md:pb-16 md:pt-24">
        <motion.div
          className="flex-1"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
            Data Analyst · Analytics Engineer
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
            Suhas Dhamapurkar
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-400 sm:text-[0.95rem]">
            Transforming raw data into{" "}
            <span className="text-sky-400">actionable business insights</span>{" "}
            through predictive models, retail analytics, and decision
            intelligence dashboards.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {stackBadges.map((badge, i) => (
              <motion.span
                key={badge}
                custom={i}
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[0.7rem] text-slate-300 shadow-sm shadow-slate-950/60"
              >
                {badge}
              </motion.span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => scrollToId("projects")}
              className="rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:brightness-110"
            >
              View Projects
            </button>
            <a
              href="https://github.com/Suhas5497"
              target="_blank"
              rel="noopener"
              className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 shadow-sm shadow-slate-950/50 transition hover:border-sky-500 hover:text-sky-300"
            >
              GitHub
            </a>
            <button
              onClick={() => scrollToId("resume")}
              className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 shadow-sm shadow-slate-950/50 transition hover:border-sky-500 hover:text-sky-300"
            >
              Download Resume
            </button>
            <button
              onClick={() => scrollToId("contact")}
              className="rounded-full border border-transparent px-4 py-2 text-xs font-semibold text-sky-300 transition hover:text-sky-400"
            >
              Contact
            </button>
          </div>
        </motion.div>
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.45, ease: "easeOut" }}
        >
          <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-2xl shadow-sky-900/50">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-slate-200">
                Live Analytics Snapshot
              </span>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[0.65rem] text-emerald-300">
                Simulated data
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-500">
                  Retail revenue forecast
                </p>
                <div className="h-32 rounded-xl border border-slate-800 bg-slate-950/60 p-1.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueForecastData}>
                      <defs>
                        <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        hide
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          border: "1px solid #1f2937",
                          borderRadius: 8,
                          fontSize: "0.7rem",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#4ade80"
                        strokeWidth={1.4}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="url(#lineGradient)"
                        strokeWidth={1.6}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-500">
                  Churn risk drivers
                </p>
                <div className="h-32 rounded-xl border border-slate-800 bg-slate-950/60 p-1.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={churnDriversData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#1e293b"
                      />
                      <XAxis type="number" hide domain={[0, 1]} />
                      <YAxis
                        type="category"
                        dataKey="feature"
                        width={70}
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                      />
                      <Bar
                        dataKey="importance"
                        fill="#38bdf8"
                        radius={[6, 6, 6, 6]}
                        barSize={10}
                      />
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

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="border-b border-slate-800/80 bg-slate-950/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sky-400">
                {eyebrow}
              </p>
            )}
            <h2 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
              {title}
            </h2>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About" title="Data analytics with a product mindset">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
        <p className="max-w-xl text-sm leading-relaxed text-slate-300">
          I am a data analyst with a background in{" "}
          <span className="font-medium text-sky-300">
            Artificial Intelligence & Machine Learning
          </span>
          , focused on converting messy, real-world data into decision-ready
          analytics experiences. I enjoy the full lifecycle: from clean data
          pipelines and statistical modelling to interactive dashboards that
          help business teams act with confidence.
        </p>
        <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
          <AboutCard
            title="Programming"
            items={["Python", "SQL", "EDA workflows", "Feature engineering"]}
          />
          <AboutCard
            title="Visualization"
            items={["Power BI", "Tableau", "Analytics dashboards", "Storytelling"]}
          />
          <AboutCard
            title="Machine Learning"
            items={[
              "Supervised & unsupervised",
              "Time series forecasting",
              "Evaluation & monitoring",
            ]}
          />
          <AboutCard
            title="Business Focus"
            items={["Retail analytics", "Customer churn", "Decision intelligence"]}
          />
        </div>
      </div>
    </Section>
  );
}

function AboutCard({ title, items }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 shadow-sm shadow-slate-950/50">
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </h3>
      <ul className="space-y-0.5 text-[0.8rem] text-slate-300">
        {items.map((item) => (
          <li key={item}>• {item}</li>
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
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
        <div className="space-y-4 text-sm text-slate-300">
          <p>
            <span className="font-semibold text-sky-300">Resilytics</span> is a
            retail decision intelligence platform concept that combines
            automated data pipelines, machine learning, and analytics dashboards
            to answer a single question:{" "}
            <span className="italic">
              “What should we do next to improve performance?”
            </span>
          </p>
          <ul className="grid gap-2 text-[0.9rem] sm:grid-cols-2">
            <li>• Automated ETL from transactional and marketing systems.</li>
            <li>• Demand forecasting for products and stores.</li>
            <li>• Store and segment level profitability analytics.</li>
            <li>• Insight tiles for pricing, discounting, and retention.</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-1 text-xs">
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-slate-200">
              Python + SQL ETL
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-slate-200">
              ML Forecasting
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-slate-200">
              Power BI dashboards
            </span>
          </div>
          <div className="flex flex-wrap gap-3 pt-2 text-xs">
            <button
              onClick={() => scrollToId("projects")}
              className="rounded-full bg-sky-500 px-4 py-2 font-semibold text-slate-950 shadow-md shadow-sky-500/40 transition hover:brightness-110"
            >
              Explore related projects
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
    "Data Sources",
    "ETL (Python + SQL)",
    "ML Models",
    "Analytics Dashboards",
    "Business Insights",
  ];
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 shadow-md shadow-slate-950/70">
      <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
        High-level architecture
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[0.7rem]">
        {nodes.map((node, idx) => (
          <React.Fragment key={node}>
            <div className="flex min-w-[110px] flex-1 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-center text-slate-200">
              {node}
            </div>
            {idx < nodes.length - 1 && (
              <span className="text-sky-400/70">➝</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-3 shadow-md shadow-slate-950/70">
      <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Product walkthrough video
      </p>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
          <p className="max-w-xs text-center">
            Embed your Resilytics platform demo video here
            (e.g. YouTube/Drive link).
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <a
          href="https://github.com/Suhas5497"
          target="_blank"
          rel="noopener"
          className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5 font-semibold text-slate-200 hover:border-sky-500 hover:text-sky-300"
        >
          GitHub Repository
        </a>
        <button className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5 font-semibold text-slate-200 hover:border-sky-500 hover:text-sky-300">
          Project Documentation
        </button>
        <button className="rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1.5 font-semibold text-sky-300 hover:bg-sky-500/20">
          Live Demo
        </button>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Analytics and machine learning projects"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <ProjectCard
          index={1}
          title="Customer Churn Prediction System"
          description="End-to-end churn prediction system powered by machine learning and a Streamlit analytics app for telecom decision-makers."
          tech={["Python", "Scikit-learn", "Streamlit", "EDA", "Feature Importance"]}
          image="/assets/churn-model.png"
          links={{
            github:
              "https://github.com/Suhas5497/customer-churn-prediction-system",
          }}
          details={{
            problem:
              "Identify customers at high risk of churn before they leave and reduce revenue loss.",
            approach:
              "Performed EDA, feature engineering, and trained classification models with hyperparameter tuning and cross-validation.",
            insights:
              "Surfaced key churn drivers and provided a ranked list of high-risk customers through an interactive app.",
          }}
        />
        <ProjectCard
          index={2}
          title="Yes Bank Stock Price Forecasting"
          description="Time series forecasting using LSTM to predict Yes Bank stock prices with visual confidence bands."
          tech={["TensorFlow", "LSTM", "Time Series", "NSE Data"]}
          image="/assets/stock-forecast-chart.png"
          links={{
            github:
              "https://github.com/Suhas5497/Yes-Bank-Stock-Price-Analysis-Future-Price-Prediction",
          }}
          details={{
            problem:
              "Forecast short-term stock movement to support trading and risk insights.",
            approach:
              "Built sequence-based LSTM models, compared against regression baselines, and evaluated using MAE/MSE.",
            insights:
              "Delivered scenario visualizations showing historical vs. predicted prices for better decision support.",
          }}
        />
        <ProjectCard
          index={3}
          title="Retail Sales Intelligence Platform"
          description="Analytics dashboard for multi-store retail performance, tracking KPIs from revenue to product performance."
          tech={["Power BI", "DAX", "Sales Analytics"]}
          image="/assets/retail-sales-dashboard.png"
          links={{
            github:
              "https://github.com/Suhas5497/sales-intelligence-platform",
          }}
          details={{
            problem:
              "Give retail leaders a single view of store performance without manual spreadsheet reports.",
            approach:
              "Built a Power BI model with DAX measures and slicers across segments, categories, and time.",
            insights:
              "Highlighted underperforming stores and products, unlocking targeted actions on assortment and discounting.",
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
            problem:
              "Support content strategy with data-backed insights into catalog composition and user-facing themes.",
            approach:
              "Used Pandas, visualization, and basic NLP with WordCloud to cluster themes and identify underrepresented genres.",
            insights:
              "Revealed imbalances in genre coverage and regional content mix, informing future acquisition focus.",
          }}
        />
      </div>
    </Section>
  );
}

function ProjectCard({ index, title, description, tech, links, details, image }) {
  return (
    <motion.article
      className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-sm shadow-slate-950/60 transition hover:-translate-y-1.5 hover:border-sky-500/70 hover:shadow-xl hover:shadow-slate-950/80"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mb-3 h-32 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70">
        <div
          className="h-full w-full bg-gradient-to-tr from-sky-500/20 via-indigo-500/10 to-fuchsia-500/10"
          style={
            image
              ? {
                  backgroundImage: `url(${image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }
              : {
                  backgroundImage: "url(/assets/placeholder-project.svg)",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }
          }
        />
      </div>
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[0.65rem]">
          Project {index.toString().padStart(2, "0")}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-slate-50 sm:text-base">
        {title}
      </h3>
      <p className="mt-1 text-[0.8rem] leading-relaxed text-slate-300">
        {description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tech.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-800 bg-slate-900/70 px-2 py-0.5 text-[0.7rem] text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
      <dl className="mt-3 space-y-1.5 text-[0.8rem] text-slate-300">
        <div>
          <dt className="font-semibold text-slate-200">Problem</dt>
          <dd>{details.problem}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-200">Approach</dt>
          <dd>{details.approach}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-200">Insights</dt>
          <dd>{details.insights}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-400"
          >
            <span>View on GitHub</span>
            <span aria-hidden>↗</span>
          </a>
        )}
        {links.demo && (
          <a
            href={links.demo}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-400"
          >
            <span>Launch demo</span>
            <span aria-hidden>↗</span>
          </a>
        )}
      </div>
    </motion.article>
  );
}

function InteractiveDemos() {
  return (
    <Section
      id="demos"
      eyebrow="Interactive Demos"
      title="Live analytics experiences"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <DemoCard
          title="Customer Churn Streamlit App"
          description="Explore churn risk by segment, filter customers, and observe how probability changes with contract and tenure."
          github="https://github.com/Suhas5497/customer-churn-prediction-system"
          demoKey="churn"
          previewImage="/assets/churn-model.png"
        />
        <DemoCard
          title="Retail Sales Dashboard"
          description="Drill into store, category, and time to understand revenue, profitability, and product performance."
          github="https://github.com/Suhas5497/sales-intelligence-platform"
          demoKey="retail"
          previewImage="/assets/retail-sales-dashboard.png"
        />
      </div>
    </Section>
  );
}

function DemoCard({ title, description, github, demoKey, previewImage }) {
  const demoUrl = DEMO_URLS[demoKey];
  const isDemoAvailable = Boolean(demoUrl);
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-sm shadow-slate-950/60">
      <div className="mb-3 h-32 overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-tr from-sky-500/20 via-indigo-500/10 to-fuchsia-500/10">
        {isDemoAvailable ? (
          <iframe
            src={demoUrl}
            title={title}
            className="h-full w-full border-0"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-[0.7rem] text-slate-300"
            style={
              previewImage
                ? {
                    backgroundImage: `url(${previewImage})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }
                : undefined
            }
          >
            {!previewImage && <span>Demo preview coming soon</span>}
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-slate-50 sm:text-base">
        {title}
      </h3>
      <p className="mt-1 text-[0.8rem] text-slate-300">{description}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <a
          href={github}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-400"
        >
          <span>GitHub</span>
          <span aria-hidden>↗</span>
        </a>
        {isDemoAvailable ? (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-400"
          >
            <span>Launch demo</span>
            <span aria-hidden>↗</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="Demo coming soon."
            className="inline-flex cursor-not-allowed items-center gap-1 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-slate-500"
          >
            <span>Demo coming soon</span>
          </button>
        )}
      </div>
    </div>
  );
}

function AnalyticsVisuals() {
  return (
    <Section
      id="visuals"
      eyebrow="Analytics Visualizations"
      title="How I think in charts"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Stock price forecast
          </p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueForecastData}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1f2937",
                    borderRadius: 8,
                    fontSize: "0.7rem",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Historical"
                  stroke="#4ade80"
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Forecast"
                  stroke="#38bdf8"
                  strokeWidth={1.7}
                  strokeDasharray="4 3"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Customer churn drivers
          </p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={churnDriversData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="feature"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  domain={[0, 1]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1f2937",
                    borderRadius: 8,
                    fontSize: "0.7rem",
                  }}
                />
                <Bar
                  dataKey="importance"
                  fill="#38bdf8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Skill radar
          </p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsRadarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                />
                <PolarRadiusAxis
                  tick={{ fontSize: 9, fill: "#64748b" }}
                  tickCount={4}
                />
                <Radar
                  dataKey="score"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.4}
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
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Technical skills mapped to outcomes"
    >
      <div className="skills-layout">
        <div className="skills-columns">
          <div className="skills-column">
            <h3>Programming</h3>
            <p>Python, SQL, scripting analytics workflows, and automation.</p>
            <h3>Analytics</h3>
            <p>
              EDA, hypothesis testing, experiment analysis, and business
              performance reviews.
            </p>
          </div>
          <div className="skills-column">
            <h3>Visualization</h3>
            <p>Power BI, Tableau, and Excel dashboards with stakeholder focus.</p>
            <h3>Machine Learning</h3>
            <p>
              Regression, classification, clustering, time series, and NLP with
              libraries like Scikit-learn and TensorFlow.
            </p>
          </div>
        </div>
        <div className="skills-metrics" id="skillBars">
          <h3>Skill Snapshot</h3>
          {[
            ["Python, Pandas & NumPy", 92],
            ["Machine Learning (sklearn)", 88],
            ["Deep Learning (TensorFlow, LSTM)", 84],
            ["NLP (NLTK, TF-IDF, CountVectorizer)", 86],
            ["SQL & BI Dashboards", 90],
          ].map(([label, value]) => (
            <div key={label} className="skill-bar" data-level={value}>
              <div className="skill-bar-header">
                <span className="skill-bar-label">{label}</span>
                <span className="skill-bar-value">{value}%</span>
              </div>
              <div className="skill-bar-track">
                <div className="skill-bar-fill" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function GithubShowcase() {
  const repos = [
    {
      name: "customer-churn-prediction-system",
      description:
        "End-to-end telecom churn prediction with ML models and Streamlit analytics.",
      language: "Jupyter Notebook",
      url: "https://github.com/Suhas5497/customer-churn-prediction-system",
    },
    {
      name: "sales-intelligence-platform",
      description:
        "Retail sales intelligence platform with analytics dashboards and insights.",
      language: "Python",
      url: "https://github.com/Suhas5497/sales-intelligence-platform",
    },
    {
      name: "Yes-Bank-Stock-Price-Analysis-Future-Price-Prediction",
      description: "Yes Bank stock price analysis and LSTM-based forecasting.",
      language: "Jupyter Notebook",
      url: "https://github.com/Suhas5497/Yes-Bank-Stock-Price-Analysis-Future-Price-Prediction",
    },
  ];
  return (
    <Section
      id="github"
      eyebrow="GitHub"
      title="Selected repositories"
    >
      <div className="grid gap-3 md:grid-cols-3">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener"
            className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200 shadow-sm shadow-slate-950/60 transition hover:border-sky-500 hover:text-sky-100"
          >
            <span className="mb-1 font-semibold">{repo.name}</span>
            <span className="mb-2 text-[0.78rem] text-slate-300">
              {repo.description}
            </span>
            <span className="mt-auto text-[0.7rem] text-slate-400">
              {repo.language}
            </span>
          </a>
        ))}
      </div>
      <div className="mt-4 text-xs text-slate-400">
        View all repositories:{" "}
        <a
          href="https://github.com/Suhas5497"
          target="_blank"
          rel="noopener"
          className="text-sky-300 hover:text-sky-400"
        >
          github.com/Suhas5497
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
      title="Download resume"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl text-sm text-slate-300">
          Download a concise PDF version of my resume with education, skills,
          and project highlights for offline review. Hosted alongside this
          portfolio for easy sharing.
        </p>
        <div className="flex flex-wrap gap-3 text-xs">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener"
            className="rounded-full bg-sky-500 px-4 py-2 font-semibold text-slate-950 shadow-md shadow-sky-500/40 hover:brightness-110"
          >
            Download Resume
          </a>
        </div>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let’s talk about data"
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            Whether it’s building a new dashboard, exploring a dataset, or
            shaping a predictive model for your product, I’d be happy to
            collaborate.
          </p>
          <ul className="space-y-1 text-[0.9rem]">
            <li>
              Email:{" "}
              <a
                href="mailto:suhasdhamapurkar1710@gmail.com"
                className="text-sky-300 hover:text-sky-400"
              >
                suhasdhamapurkar1710@gmail.com
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a
                href="https://linkedin.com/in/suhas-1710d"
                target="_blank"
                rel="noopener"
                className="text-sky-300 hover:text-sky-400"
              >
                linkedin.com/in/suhas-1710d
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/Suhas5497"
                target="_blank"
                rel="noopener"
                className="text-sky-300 hover:text-sky-400"
              >
                github.com/Suhas5497
              </a>
            </li>
          </ul>
        </div>
        <form
          className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-sm shadow-slate-950/60"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs text-slate-300">
              Name
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-sky-500"
                placeholder="Your name"
              />
            </label>
            <label className="text-xs text-slate-300">
              Email
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-sky-500"
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label className="block text-xs text-slate-300">
            Message
            <textarea
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-sky-500"
              placeholder="Tell me about your role, data challenge, or idea..."
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-sky-500/40 hover:brightness-110"
          >
            Copy message & open email client
          </button>
          <p className="text-[0.7rem] text-slate-500">
            This form is front-end only. It’s designed to be wired into your
            preferred email or backend service.
          </p>
        </form>
      </div>
    </Section>
  );
}

export default App;

