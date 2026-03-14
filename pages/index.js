import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, Area, AreaChart
} from 'recharts';

// Data
const skillRadarData = [
  { skill: "Python", level: 90 },
  { skill: "SQL", level: 92 },
  { skill: "ML", level: 82 },
  { skill: "Visualization", level: 85 },
  { skill: "Analytics", level: 80 }
];

const revenueData = [
  { day: "Day 1", actual: 118, forecast: 119 },
  { day: "Day 2", actual: 122, forecast: 121 },
  { day: "Day 3", actual: 125, forecast: 124 },
  { day: "Day 4", actual: 129, forecast: 128 },
  { day: "Day 5", actual: 132, forecast: 133 },
  { day: "Day 6", forecast: 135 },
  { day: "Day 7", forecast: 137 },
  { day: "Day 8", forecast: 140 }
];

const churnData = [
  { feature: "Contract Type", importance: 0.86 },
  { feature: "Tenure", importance: 0.78 },
  { feature: "Monthly Charges", importance: 0.74 },
  { feature: "Payment Method", importance: 0.62 },
  { feature: "Support Tickets", importance: 0.58 }
];

const DEMO_URLS = {
  churn: "https://customer-churn-prediction-system-oneq3amaedjugshgt599ip.streamlit.app/",
  retail: "https://sales-intelligence-platform-dovb9bnzxw69tvcorxpqqz.streamlit.app/"
};

const navItems = [
  ["About", "about"],
  ["Platform", "platform"],
  ["Projects", "projects"],
  ["Case Studies", "case-studies"],
  ["Live Demos", "demos"],
  ["Visualizations", "visualizations"],
  ["Skills", "skills"],
  ["GitHub", "github"],
  ["Resume", "resume"],
  ["Contact", "contact"]
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(([_, id]) => document.getElementById(id));
      const scrollPos = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navItems[i][1]);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Head>
        <title>Suhas Dhamapurkar | Data Analyst Portfolio</title>
      </Head>

      <div className="min-h-screen bg-white text-text-primary">
        {/* Navigation */}
        <header className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                SD
              </div>
              <div>
                <p className="font-semibold text-sm text-text-primary">Suhas Dhamapurkar</p>
                <p className="text-xs text-text-secondary">Data Analyst</p>
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === id ? 'text-primary' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="lg:hidden border-t border-border bg-white px-6 py-4">
              <div className="flex flex-col gap-3">
                {navItems.map(([label, id]) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="text-left py-2 text-sm text-text-secondary hover:text-primary"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </nav>
          )}
        </header>

        <main className="pt-16">
          <HeroSection scrollToSection={scrollToSection} />
          <AboutSection />
          <PlatformSection scrollToSection={scrollToSection} />
          <ProjectsSection />
          <CaseStudiesSection />
          <DemosSection />
          <VisualizationsSection />
          <SkillsSection />
          <GitHubSection />
          <ResumeSection />
          <ContactSection />
        </main>

        <footer className="bg-gray-50 border-t border-border py-8">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <p className="text-text-secondary text-sm">© {new Date().getFullYear()} Suhas Dhamapurkar · Data Analyst Portfolio</p>
          </div>
        </footer>
      </div>
    </>
  );
}

// Hero Section
function HeroSection({ scrollToSection }) {
  return (
    <section id="hero" className="py-[100px] bg-gradient-to-br from-white via-gray-50 to-emerald-50/30">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Data Analyst · Analytics Engineer
            </span>
            
            <h1 className="text-[48px] font-bold text-text-primary leading-tight mb-4">
              Suhas Dhamapurkar
            </h1>
            
            <p className="text-[16px] text-text-secondary leading-relaxed mb-6 max-w-lg">
              Transforming raw data into <span className="text-primary font-semibold">actionable business insights</span> using Python, SQL, machine learning, and analytics dashboards.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {["SQL", "Python", "Machine Learning", "Power BI", "Excel", "Tableau"].map((skill) => (
                <span key={skill} className="px-4 py-2 rounded-full bg-white border border-border text-sm text-text-primary hover:border-primary transition-colors">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
              >
                View Projects
              </button>
              <a
                href="https://github.com/Suhas5497"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-border bg-white text-text-primary font-semibold text-sm hover:border-primary hover:text-primary transition-all"
              >
                GitHub
              </a>
              <button
                onClick={() => scrollToSection('resume')}
                className="px-6 py-3 rounded-full border border-border bg-white text-text-primary font-semibold text-sm hover:border-primary hover:text-primary transition-all"
              >
                Download Resume
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="bg-white rounded-2xl border border-border p-6 shadow-xl w-full max-w-md">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                Skills Radar
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillRadarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Radar
                      name="Skills"
                      dataKey="level"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  const cards = [
    {
      title: "Programming",
      items: ["Python", "SQL", "EDA workflows", "Feature engineering"]
    },
    {
      title: "Visualization",
      items: ["Power BI", "Tableau", "Analytics dashboards", "Storytelling"]
    },
    {
      title: "Machine Learning",
      items: ["Supervised models", "Time series forecasting", "Model evaluation"]
    },
    {
      title: "Business Focus",
      items: ["Retail analytics", "Customer churn", "Decision intelligence"]
    }
  ];

  return (
    <section id="about" className="py-[70px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">About</p>
        <h2 className="text-[28px] font-bold text-text-primary mb-8">Data analytics with a product mindset</h2>
        
        <div className="grid lg:grid-cols-2 gap-10">
          <p className="text-[16px] text-text-secondary leading-relaxed">
            I am a data analyst with a background in <span className="text-primary font-semibold">Artificial Intelligence & Machine Learning</span>, 
            focused on building end-to-end analytics workflows including ETL pipelines, statistical modeling, 
            interactive dashboards, and actionable business insights that help teams make confident decisions.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {cards.map((card) => (
              <div key={card.title} className="p-5 rounded-xl border border-border bg-gray-50 hover:border-primary hover:shadow-md transition-all">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">{card.title}</h3>
                <ul className="space-y-1.5">
                  {card.items.map((item) => (
                    <li key={item} className="text-sm text-text-secondary flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Platform Section
function PlatformSection({ scrollToSection }) {
  const steps = ["Data Sources", "ETL Pipeline", "ML Models", "Dashboards", "Insights"];

  return (
    <section id="platform" className="py-[70px] bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Featured Platform</p>
        <h2 className="text-[28px] font-bold text-text-primary mb-8">Resilytics — Retail Decision Intelligence Platform</h2>
        
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <p className="text-[16px] text-text-secondary leading-relaxed mb-6">
              <span className="text-primary font-bold">Resilytics</span> integrates automated ETL pipelines, 
              machine learning forecasting, and analytics dashboards to answer: 
              <span className="italic font-medium text-text-primary"> "What should we do next to improve performance?"</span>
            </p>
            
            <ul className="space-y-3 mb-6">
              {[
                "Automated ETL from transactional systems",
                "Demand forecasting for products and stores",
                "Store-level profitability analytics",
                "Actionable insight tiles"
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-text-secondary">
                  <span className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => scrollToSection('projects')}
              className="px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
            >
              Explore Projects
            </button>
          </div>

          <div className="space-y-4">
            {/* Architecture Diagram */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Architecture</h3>
              <div className="space-y-2">
                {steps.map((step, idx) => (
                  <div key={step}>
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
                      <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-text-primary text-sm">{step}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="flex justify-center py-1">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Video Placeholder */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Product Walkthrough</h3>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-border">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-secondary">Video coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Projects Section
function ProjectsSection() {
  const projects = [
    {
      title: "Customer Churn Prediction System",
      description: "End-to-end churn prediction system with ML models and Streamlit analytics app.",
      tech: ["Python", "Scikit-learn", "Streamlit", "EDA"],
      image: "/assets/churn-model.png",
      problem: "Identify high-risk customers before they churn to reduce revenue loss.",
      approach: "EDA, feature engineering, and classification models with hyperparameter tuning.",
      insight: "Month-to-month contracts show 3× higher churn probability.",
      github: "https://github.com/Suhas5497/customer-churn-prediction-system",
      demo: DEMO_URLS.churn
    },
    {
      title: "Yes Bank Stock Price Forecasting",
      description: "Time series forecasting using LSTM to predict stock prices with confidence bands.",
      tech: ["TensorFlow", "LSTM", "Time Series", "NSE Data"],
      image: "/assets/stock-forecast-chart.png",
      problem: "Forecast short-term stock movement for trading and risk insights.",
      approach: "LSTM models compared against regression baselines, evaluated with MAE/MSE.",
      insight: "LSTM outperformed linear models by 23% in accuracy.",
      github: "https://github.com/Suhas5497/Yes-Bank-Stock-Price-Analysis-Future-Price-Prediction",
      demo: null
    },
    {
      title: "Retail Sales Intelligence Platform",
      description: "Analytics dashboard for multi-store retail performance and KPI tracking.",
      tech: ["Power BI", "DAX", "Sales Analytics"],
      image: "/assets/retail-sales-dashboard.png",
      problem: "Single view of store performance without manual spreadsheet reports.",
      approach: "Power BI model with DAX measures across segments, categories, and time.",
      insight: "Top 20% of stores generate over 60% of total revenue.",
      github: "https://github.com/Suhas5497/sales-intelligence-platform",
      demo: DEMO_URLS.retail
    },
    {
      title: "Amazon Prime Content Analysis",
      description: "Content analytics of 10,000+ titles to understand genre mix and catalog gaps.",
      tech: ["Python", "Pandas", "NLP", "WordCloud"],
      image: "/assets/resilytics-dashboard.png",
      problem: "Data-backed insights into catalog composition for content strategy.",
      approach: "Pandas, visualization, and NLP with WordCloud to cluster themes.",
      insight: "30% underrepresentation in documentary content vs. competitors.",
      github: "https://github.com/Suhas5497/Amazone-Prime-Analysis",
      demo: null
    }
  ];

  return (
    <section id="projects" className="py-[70px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Projects</p>
        <h2 className="text-[28px] font-bold text-text-primary mb-8">Analytics & Machine Learning Projects</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} index={idx + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      className="group rounded-xl border border-border bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-text-primary">
            Project {String(index).padStart(2, '0')}
          </span>
        </div>
        
        {/* Insight Overlay on Hover */}
        <motion.div
          className="absolute inset-0 bg-primary/90 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center text-white">
            <p className="text-xs uppercase tracking-wider mb-2 opacity-80">Key Insight</p>
            <p className="font-semibold">{project.insight}</p>
          </div>
        </motion.div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-text-secondary mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-text-secondary">
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div><span className="font-semibold text-text-primary">Problem:</span> <span className="text-text-secondary">{project.problem}</span></div>
          <div><span className="font-semibold text-text-primary">Approach:</span> <span className="text-text-secondary">{project.approach}</span></div>
        </div>

        {/* Pipeline Diagram */}
        <div className="flex items-center gap-1 text-xs text-text-secondary mb-4 overflow-x-auto pb-2">
          {["Dataset", "Cleaning", "Features", "Model", "Dashboard"].map((step, idx) => (
            <div key={step} className="flex items-center">
              <span className="px-2 py-1 bg-emerald-50 rounded text-primary whitespace-nowrap">{step}</span>
              {idx < 4 && <span className="text-primary mx-1">→</span>}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-secondary hover:text-primary flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-primary text-white px-4 py-1.5 rounded-full font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Launch Demo
            </a>
          ) : (
            <span className="text-sm text-text-secondary/50 px-4 py-1.5 rounded-full bg-gray-100 cursor-not-allowed">
              Demo Coming Soon
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// Case Studies Section
function CaseStudiesSection() {
  const caseStudies = [
    {
      title: "Customer Churn Drivers Analysis",
      problem: "High telecom customer churn affecting revenue.",
      analysis: "Segmented customers using tenure, contract type, and payment methods.",
      insight: "Month-to-month contracts have highest churn risk (42% vs 11% for annual).",
      recommendation: "Introduce long-term contract incentives and loyalty programs."
    },
    {
      title: "Retail Sales Performance Analysis",
      problem: "Need to identify revenue-driving stores for resource allocation.",
      analysis: "Analyzed store revenue trends, category performance, and seasonal patterns.",
      insight: "Top 20% of stores generate over 60% of revenue; underperformers lag in electronics.",
      recommendation: "Focus marketing and inventory optimization on high-performing stores."
    }
  ];

  return (
    <section id="case-studies" className="py-[70px] bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Analytics</p>
        <h2 className="text-[28px] font-bold text-text-primary mb-8">Case Studies</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {caseStudies.map((study, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all">
              <h3 className="text-lg font-bold text-text-primary mb-4">{study.title}</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-primary mb-1">Problem</p>
                  <p className="text-text-secondary">{study.problem}</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">Analysis</p>
                  <p className="text-text-secondary">{study.analysis}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                  <p className="font-semibold text-primary mb-1">Key Insight</p>
                  <p className="text-text-primary font-medium">{study.insight}</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">Recommendation</p>
                  <p className="text-text-secondary">{study.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Demos Section
function DemosSection() {
  const demos = [
    {
      title: "Customer Churn Demo",
      description: "Explore churn risk by segment, filter customers, and observe probability changes.",
      url: DEMO_URLS.churn,
      image: "/assets/churn-model.png"
    },
    {
      title: "Retail Sales Dashboard",
      description: "Drill into store, category, and time to understand revenue and performance.",
      url: DEMO_URLS.retail,
      image: "/assets/retail-sales-dashboard.png"
    }
  ];

  return (
    <section id="demos" className="py-[70px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Interactive</p>
        <h2 className="text-[28px] font-bold text-text-primary mb-8">Live Analytics Demos</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {demos.map((demo, idx) => (
            <div key={idx} className="rounded-xl border border-border overflow-hidden bg-white hover:shadow-lg hover:border-primary/50 transition-all">
              <div className="h-48 overflow-hidden relative group">
                <img src={demo.image} alt={demo.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a
                    href={demo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white rounded-full font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    Open Demo
                  </a>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-text-primary mb-2">{demo.title}</h3>
                <p className="text-sm text-text-secondary mb-4">{demo.description}</p>
                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm bg-primary text-white px-5 py-2.5 rounded-full font-semibold hover:bg-primary-dark transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Launch Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Visualizations Section
function VisualizationsSection() {
  return (
    <section id="visualizations" className="py-[70px] bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Charts</p>
        <h2 className="text-[28px] font-bold text-text-primary mb-8">How I Think in Charts</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Revenue Forecast */}
          <div className="bg-white rounded-xl border border-border p-5 hover:shadow-lg transition-all">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Revenue Forecast</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="actual" stroke="#10b981" fill="url(#colorActual)" strokeWidth={2} />
                  <Line type="monotone" dataKey="forecast" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Churn Drivers */}
          <div className="bg-white rounded-xl border border-border p-5 hover:shadow-lg transition-all">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Churn Drivers</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={churnData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis type="category" dataKey="feature" width={90} tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                  <Bar dataKey="importance" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Radar */}
          <div className="bg-white rounded-xl border border-border p-5 hover:shadow-lg transition-all">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Skill Radar</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillRadarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <PolarRadiusAxis tick={{ fontSize: 9, fill: '#9ca3af' }} />
                  <Radar dataKey="level" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Skills Section
function SkillsSection() {
  const skillBars = [
    { name: "Python, Pandas & NumPy", level: 92 },
    { name: "SQL & Database Management", level: 90 },
    { name: "Machine Learning (Scikit-learn)", level: 85 },
    { name: "Power BI & Tableau", level: 88 },
    { name: "Time Series & Forecasting", level: 82 }
  ];

  return (
    <section id="skills" className="py-[70px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Expertise</p>
        <h2 className="text-[28px] font-bold text-text-primary mb-8">Technical Skills Mapped to Outcomes</h2>
        
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Programming", desc: "Python, SQL, scripting analytics workflows" },
              { title: "Analytics", desc: "EDA, hypothesis testing, experiment analysis" },
              { title: "Visualization", desc: "Power BI, Tableau, Excel dashboards" },
              { title: "Machine Learning", desc: "Regression, classification, clustering, time series" }
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-border bg-gray-50 hover:border-primary hover:shadow-md transition-all">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-bold text-text-primary mb-6">Skill Proficiency</h3>
            <div className="space-y-5">
              {skillBars.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-primary font-medium">{skill.name}</span>
                    <span className="text-primary font-bold">{skill.level}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// GitHub Section
function GitHubSection() {
  const repos = [
    {
      name: "customer-churn-prediction-system",
      description: "End-to-end telecom churn prediction with ML models and Streamlit.",
      language: "Jupyter Notebook",
      url: "https://github.com/Suhas5497/customer-churn-prediction-system"
    },
    {
      name: "sales-intelligence-platform",
      description: "Retail sales intelligence platform with analytics dashboards.",
      language: "Python",
      url: "https://github.com/Suhas5497/sales-intelligence-platform"
    },
    {
      name: "Yes-Bank-Stock-Price-Analysis",
      description: "Stock price analysis and LSTM-based forecasting.",
      language: "Jupyter Notebook",
      url: "https://github.com/Suhas5497/Yes-Bank-Stock-Price-Analysis-Future-Price-Prediction"
    }
  ];

  return (
    <section id="github" className="py-[70px] bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Code</p>
        <h2 className="text-[28px] font-bold text-text-primary mb-8">GitHub Repositories</h2>
        
        <div className="grid md:grid-cols-3 gap-5">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-xl border border-border bg-white hover:border-primary hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="font-bold text-text-primary group-hover:text-primary transition-colors truncate">{repo.name}</span>
              </div>
              <p className="text-sm text-text-secondary mb-3 line-clamp-2">{repo.description}</p>
              <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                {repo.language}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://github.com/Suhas5497"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-white font-semibold text-sm hover:border-primary hover:text-primary transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View All Repositories
          </a>
        </div>
      </div>
    </section>
  );
}

// Resume Section
function ResumeSection() {
  return (
    <section id="resume" className="py-[70px] bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white rounded-2xl border border-border p-8 shadow-lg">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Resume</p>
            <h2 className="text-[28px] font-bold text-text-primary mb-2">Download Resume</h2>
            <p className="text-text-secondary max-w-md">
              Get a PDF version with education, skills, and project highlights for offline review.
            </p>
          </div>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact: ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.open(`mailto:suhasdhamapurkar1710@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <section id="contact" className="py-[70px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Connect</p>
        <h2 className="text-[28px] font-bold text-text-primary mb-8">Let's Talk About Data</h2>
        
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <p className="text-text-secondary mb-6 max-w-md">
              Whether it's building a dashboard, exploring a dataset, or shaping a predictive model, I'd be happy to collaborate.
            </p>
            
            <div className="space-y-4">
              <a href="mailto:suhasdhamapurkar1710@gmail.com" className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wider">Email</p>
                  <p className="font-medium text-text-primary group-hover:text-primary transition-colors">suhasdhamapurkar1710@gmail.com</p>
                </div>
              </a>
              
              <a href="https://linkedin.com/in/suhas-1710d" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wider">LinkedIn</p>
                  <p className="font-medium text-text-primary group-hover:text-primary transition-colors">linkedin.com/in/suhas-1710d</p>
                </div>
              </a>
              
              <a href="https://github.com/Suhas5497" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wider">GitHub</p>
                  <p className="font-medium text-text-primary group-hover:text-primary transition-colors">github.com/Suhas5497</p>
                </div>
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl border border-border p-6">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <label className="block">
                <span className="text-sm font-medium text-text-primary mb-1.5 block">Name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-text-primary mb-1.5 block">Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <label className="block mb-4">
              <span className="text-sm font-medium text-text-primary mb-1.5 block">Message</span>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                placeholder="Tell me about your project or data challenge..."
              />
            </label>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
