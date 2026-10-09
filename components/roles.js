// Per-role framing of the same underlying portfolio. Every claim here reuses facts
// already stated elsewhere on the site — only the emphasis and ordering change.
export const ROLES = {
  data: {
    key: 'data',
    path: '/data-analyst',
    theme: 'data',
    label: 'Data Analyst',
    short: 'Data',
    pageTitle: 'Suhas Dhamapurkar | Data Analyst',
    headline: 'Data Analyst · BI Engineer',
    typing: ['SELECT insight FROM raw_data;', 'Building Power BI dashboards…', 'Running cohort & RFM analysis…', 'Turning KPIs into decisions…'],
    intro:
      'I turn raw, messy data into decisions executives can act on — precision SQL, statistical analysis, and Power BI dashboards that replace entire manual reporting workflows.',
    stats: [
      { value: 35, suffix: '%', label: 'ETL processing time reduced at Labmentix', color: 'primary' },
      { value: 100, suffix: 'K+', label: 'E-commerce orders analysed across 9 SQL tables', color: 'primary' },
      { value: 6, suffix: ' hrs', label: 'Weekly analyst time saved via Power BI dashboards', color: 'accent' },
    ],
    projectOrder: ['ecommerce', 'retail', 'churn', 'yesbank'],
    skillOrder: ['Data Analysis & BI', 'Statistics', 'Python & Data Science', 'Data Engineering', 'Machine Learning', 'Cloud & Tools'],
    projectsHeading: 'Analytics & BI work',
    contactBlurb: 'Need a dashboard, a KPI framework, or a deep-dive into your sales data? Reach out.',
  },
  ai: {
    key: 'ai',
    path: '/aiml',
    theme: 'ai',
    label: 'AI / ML Engineer',
    short: 'AI/ML',
    pageTitle: 'Suhas Dhamapurkar | AI/ML Engineer',
    headline: 'AI / ML Engineer · B.Tech in AI & ML',
    typing: ['model.fit(X_train, y_train)', 'Tuning XGBoost hyperparameters…', 'Forecasting with SARIMA…', 'Running Monte Carlo simulations…'],
    intro:
      'I build machine-learning systems that ship — from a production XGBoost churn model and time-series forecasters to the Monte Carlo simulation engine powering Resilytics.',
    stats: [
      { value: 85, suffix: '%', label: 'XGBoost churn model accuracy on 7K+ records', color: 'primary' },
      { value: 0.97, decimals: 2, prefix: 'R² ', label: 'Random Forest fit on Yes Bank price features', color: 'primary' },
      { value: 5, prefix: 'Top ', suffix: '%', label: 'Imarticus Data Science Hackathon (8th of 150+)', color: 'accent' },
    ],
    projectOrder: ['churn', 'yesbank', 'ecommerce', 'retail'],
    skillOrder: ['Machine Learning', 'Python & Data Science', 'Statistics', 'Data Engineering', 'Cloud & Tools', 'Data Analysis & BI'],
    projectsHeading: 'Machine learning & AI work',
    contactBlurb: 'Need a predictive model, a forecasting pipeline, or ML shipped to production? Reach out.',
  },
  hybrid: {
    key: 'hybrid',
    path: '/hybrid',
    theme: 'hybrid',
    label: 'Data × AI Hybrid',
    short: 'Hybrid',
    pageTitle: 'Suhas Dhamapurkar | Data Analyst × AI/ML Engineer',
    headline: 'Data Analyst · AI/ML Engineer · Founder of Resilytics',
    typing: ['Raw data → clean pipeline…', 'Pipeline → predictive model…', 'Model → board-ready decision.', 'Building Resilytics, solo.'],
    intro:
      'I work end-to-end: SQL and dashboards to understand the business, machine learning to predict what happens next, and production engineering to put both in front of decision-makers.',
    stats: [
      { value: 35, suffix: '%', label: 'ETL processing time reduced at Labmentix', color: 'primary' },
      { value: 85, suffix: '%', label: 'XGBoost churn model accuracy on 7K+ records', color: 'primary' },
      { value: 6, suffix: ' hrs', label: 'Weekly analyst time saved via Power BI dashboards', color: 'accent' },
    ],
    projectOrder: ['ecommerce', 'churn', 'retail', 'yesbank'],
    skillOrder: ['Data Analysis & BI', 'Machine Learning', 'Python & Data Science', 'Statistics', 'Data Engineering', 'Cloud & Tools'],
    projectsHeading: 'Analytics, ML & engineering work',
    contactBlurb: 'Whether it’s building a dashboard, designing a pipeline, or shaping a predictive model — reach out.',
  },
};

export const ROLE_LIST = [ROLES.data, ROLES.ai, ROLES.hybrid];
