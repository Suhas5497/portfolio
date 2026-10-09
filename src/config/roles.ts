import type { RoleKey } from '@/data/projects';

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface RoleConfig {
  key: RoleKey;
  path: string;
  theme: RoleKey;
  label: string;
  short: string;
  headline: string;
  headlineAccent: string;
  subhead: string;
  metaDescription: string;
  cardBlurb: string;
  cardTags: string[];
  insight: string[];
  about: string[];
  projectOrder: string[];
  flagship?: string;
  skills: SkillGroup[];
  cta: { title: string; body: string };
  /** Hex colours used by WebGL scenes (CSS uses the theme tokens instead). */
  palette: { primary: string; accent: string; tertiary: string };
}

export const ROLES: Record<RoleKey, RoleConfig> = {
  data: {
    key: 'data',
    path: '/data-analyst',
    theme: 'data',
    label: 'Data Analyst',
    short: 'Data',
    headline: 'Turning Data',
    headlineAccent: 'Into Decisions.',
    subhead:
      'SQL, Python and Power BI work that finds where revenue leaks, which KPIs move, and what to do next — delivered as dashboards and recommendations people act on.',
    metaDescription:
      'Suhas Dhamapurkar — Data Analyst: SQL, Python, Power BI, Tableau, ETL, EDA and statistical analysis turned into business decisions.',
    cardBlurb: 'SQL, statistics and BI dashboards that turn raw data into decisions.',
    cardTags: ['SQL', 'Power BI', 'Python', 'EDA'],
    insight: [
      'Retail dashboard flagged 60% sales concentration in one region',
      '35% faster weekly ETL at Labmentix',
      'Top 5 categories = 62% of revenue (e-commerce capstone)',
    ],
    about: [
      'I’m a data analyst who cares about the decision at the end of the chart. My work starts with clean, validated data (ETL in Python and SQL), moves through exploratory and statistical analysis, and ends in dashboards and written recommendations.',
      'During a four-month data analytics internship at Labmentix I automated ETL pipelines, built Power BI reporting that replaced four manual Excel reports, and surfaced churn drivers the retention team adopted.',
    ],
    projectOrder: [
      'retail', 'resilytics', 'recommendation', 'dynamic-pricing', 'traffic', 'churn',
      'marketing-attribution', 'inventory-forecasting', 'executive-kpi', 'ecommerce', 'yesbank', 'spa-project',
    ],
    skills: [
      { label: 'Querying & data prep', items: ['SQL (CTEs, window functions)', 'Python', 'Pandas', 'NumPy', 'Excel', 'ETL', 'Data cleaning & validation'] },
      { label: 'BI & visualisation', items: ['Power BI', 'DAX', 'Star schema', 'Drill-through', 'RLS', 'Tableau', 'Matplotlib', 'Seaborn'] },
      { label: 'Analysis', items: ['EDA', 'Statistical analysis', 'Hypothesis testing', 'A/B testing', 'Cohort analysis', 'RFM', 'Pareto analysis'] },
      { label: 'Business insight', items: ['KPI design', 'Data storytelling', 'Root-cause analysis', 'Stakeholder communication'] },
    ],
    cta: { title: 'Need clarity from your data?', body: 'Dashboards, KPI frameworks or a deep-dive into sales and customers — let’s talk.' },
    palette: { primary: '#3b82f6', accent: '#22d3ee', tertiary: '#38bdf8' },
  },
  ai: {
    key: 'ai',
    path: '/ai-ml-engineer',
    theme: 'ai',
    label: 'AI / ML Engineer',
    short: 'AI/ML',
    headline: 'Building Intelligence.',
    headlineAccent: 'Engineering Possibilities.',
    subhead:
      'Machine-learning systems from feature engineering to deployment — classification, forecasting, computer vision and NLP, evaluated honestly and served through APIs and apps.',
    metaDescription:
      'Suhas Dhamapurkar — AI/ML Engineer: Python, scikit-learn, XGBoost, computer vision, NLP, model evaluation and deployment with FastAPI and Streamlit.',
    cardBlurb: 'Models that learn, predict and ship — from XGBoost to computer vision and NLP.',
    cardTags: ['XGBoost', 'Computer vision', 'NLP', 'FastAPI'],
    insight: [
      '85% test accuracy — XGBoost churn model on 7,000+ records',
      'SARIMA forecasting on 15 years of stock data',
      'Top 5% at the Imarticus Data Science Hackathon',
    ],
    about: [
      'I hold a B.Tech in Computer Science with an AI & ML specialisation, and I build models with deployment in mind: reproducible pipelines, honest evaluation, and an API or app at the end.',
      'My completed work includes an XGBoost churn classifier and time-series forecasting; my current roadmap covers computer vision, NLP and retrieval-augmented systems, each listed below as a proposed project until results are published.',
    ],
    projectOrder: [
      'helmet-detection', 'vehicle-counting', 'recommendation', 'churn', 'fake-review',
      'demand-anomaly', 'document-intelligence', 'rag-assistant', 'ml-monitoring', 'yesbank', 'spa-project',
    ],
    skills: [
      { label: 'Machine learning', items: ['Python', 'Scikit-learn', 'XGBoost', 'Random Forest', 'Regression', 'Classification', 'Clustering', 'TensorFlow'] },
      { label: 'Time series', items: ['ARIMA', 'SARIMA', 'Forecasting', 'Anomaly detection'] },
      { label: 'Vision & language', items: ['Computer vision', 'OpenCV', 'YOLO-family detectors', 'NLP', 'Embeddings & retrieval'] },
      { label: 'Evaluation & deployment', items: ['Precision / recall / F1', 'ROC & PR curves', 'MAE / RMSE / R²', 'FastAPI', 'Streamlit', 'Git', 'AWS fundamentals'] },
    ],
    cta: { title: 'Have a prediction problem?', body: 'Classification, forecasting or an ML feature you want in production — let’s talk.' },
    palette: { primary: '#8b5cf6', accent: '#6366f1', tertiary: '#c084fc' },
  },
  hybrid: {
    key: 'hybrid',
    path: '/hybrid',
    theme: 'hybrid',
    label: 'Hybrid Data + AI',
    short: 'Hybrid',
    headline: 'From Data to Prediction.',
    headlineAccent: 'From Prediction to Action.',
    subhead:
      'End-to-end decision intelligence: understand the business with data, predict what happens next with ML, and ship the decision in a product — as with Resilytics.',
    metaDescription:
      'Suhas Dhamapurkar — Hybrid Data + AI: end-to-end pipelines from analytics to prediction to action. Flagship: Resilytics decision-intelligence platform.',
    cardBlurb: 'The full pipeline — analyse, predict, act. Flagship: Resilytics.',
    cardTags: ['Resilytics', 'Pipelines', 'Risk', 'ML'],
    insight: [
      'Resilytics — live multi-tenant SaaS, built solo',
      'Monte Carlo, VaR-95, HHI and Altman Z-Score in one engine',
      'Analytics + ML + production engineering',
    ],
    about: [
      'I work across the whole path from raw data to action. Resilytics is the clearest example: I designed and built every layer — ingestion, validation, a DuckDB warehouse, a Monte Carlo risk engine and executive reporting — and run it in production.',
      'That combination of analyst judgement, ML and engineering is what I bring to teams that need decisions, not just dashboards or models.',
    ],
    flagship: 'resilytics',
    projectOrder: ['resilytics', 'traffic', 'recommendation', 'predictive-customer', 'document-intelligence', 'ask-resilytics', 'churn', 'spa-project'],
    skills: [
      { label: 'Data foundations', items: ['SQL', 'Python', 'Pandas', 'ETL', 'Data validation', 'DuckDB', 'PostgreSQL'] },
      { label: 'Modelling & risk', items: ['XGBoost', 'Time series', 'Monte Carlo simulation', 'VaR-95', 'HHI', 'Altman Z-Score'] },
      { label: 'Product engineering', items: ['FastAPI', 'Redis', 'RQ workers', 'React', 'TypeScript', 'Vite', 'Railway', 'Vercel'] },
      { label: 'Decision delivery', items: ['Power BI', 'Executive reporting', 'Data storytelling', 'KPI design'] },
    ],
    cta: { title: 'Want data, models and product in one person?', body: 'From pipeline to prediction to a shipped decision tool — let’s talk.' },
    palette: { primary: '#22d3ee', accent: '#8b5cf6', tertiary: '#10b981' },
  },
};

export const ROLE_LIST: RoleConfig[] = [ROLES.data, ROLES.ai, ROLES.hybrid];
export const roleFromPath = (path: string) => ROLE_LIST.find((r) => r.path === path);
