// Single source of truth for personal facts. Every value here comes from
// Suhas's résumé (public/resume.pdf) or his own brief — do not add facts that
// are not supplied by him. Phone number intentionally omitted from the site.

export const PROFILE = {
  name: 'Suhas Dhamapurkar',
  firstName: 'Suhas',
  hometown: 'Ratnagiri, Maharashtra, India',
  languages: ['English', 'Hindi', 'Marathi'],
  portrait: {
    webp: '/assets/portrait-480.webp',
    jpg: '/assets/portrait-480.jpg',
    alt: 'Portrait of Suhas Dhamapurkar',
    width: 480,
    height: 720,
  },
  /** Stylised cut-out of the same real photo (background removed, neon rim light). */
  hero: {
    webp: '/assets/portrait-hero-960.webp',
    small: '/assets/portrait-hero-600.webp',
    alt: 'Suhas Dhamapurkar',
    width: 960,
    height: 1207,
  },
  resumeUrl: '/resume.pdf',
  links: {
    email: 'suhasdhamapurkar1710@gmail.com',
    linkedin: 'https://linkedin.com/in/suhas-1710d',
    github: 'https://github.com/Suhas5497',
    resilytics: 'https://resilytics.in',
  },
} as const;

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || '';
export const CONTACT_FORM_ENDPOINT = (import.meta.env.VITE_CONTACT_FORM_ENDPOINT as string | undefined) || '';

export interface ExperienceItem {
  role: string;
  org: string;
  url?: string;
  period: string;
  mode?: string;
  bullets: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Founder & Sole Engineer (Independent Project)',
    org: 'Resilytics',
    url: 'https://resilytics.in',
    period: 'Aug 2025 – Present',
    bullets: [
      'Designed and built a multi-tenant decision-intelligence SaaS solo: structured data ingestion, schema validation, canonical transformation, analytics warehouse, risk/simulation engine and executive reporting, with tenant isolation enforced at the SQL layer.',
      'Implemented a Monte Carlo simulation and shock-testing engine alongside a SQL/Python analytics layer applying HHI (market concentration), Basel III VaR-95 and a modified Altman Z-Score.',
      'Owned full-stack architecture and production deployment — FastAPI, PostgreSQL, Redis, async RQ workers, DuckDB warehouse; React/TypeScript/Vite frontend — including migrations, automated release checks and demo-environment tooling.',
    ],
  },
  {
    role: 'Data Analyst Intern (four months)',
    org: 'Labmentix Pvt. Ltd.',
    period: 'Feb 2025 – May 2025',
    mode: 'Remote',
    bullets: [
      'Engineered automated ETL pipelines in Python and SQL, reducing weekly data-processing time by 35%.',
      'Built an XGBoost churn-prediction model on 7,000+ telecom customer records with 85% test accuracy; surfaced the top 3 churn drivers, which the retention team adopted.',
      'Designed Power BI dashboards with DAX measures for revenue KPIs and profitability trends, replacing 4 recurring manual Excel reports and saving ~6 analyst-hours per week.',
      'Aligned KPI definitions and validated data assumptions with the team to keep dashboards accurate for decision-making.',
    ],
  },
];

export interface EducationItem {
  credential: string;
  institution: string;
  period?: string;
  detail?: string;
}

export const EDUCATION: EducationItem[] = [
  {
    credential: 'Post Graduate Program in Data Science & Analytics',
    institution: 'Imarticus Learning, Pune',
    period: 'Aug 2025 – May 2026',
    detail: 'Capstone: E-Commerce Business Analytics (SQL & Power BI).',
  },
  {
    credential: 'B.Tech in Computer Science — AI & ML specialisation',
    institution: 'Kolhapur Institute of Technology (KIT’s College of Engineering), Kolhapur',
    period: '2021 – 2025',
    detail: 'CGPA 7.45 / 10',
  },
];

export const ACHIEVEMENTS: string[] = [
  '8th rank (Top 5%) of 150+ participants — Imarticus Data Science Hackathon, Apr 2026',
  'Data Analysis with Python — Forage',
  'AWS Cloud Fundamentals (hands-on deployment; Cloud Practitioner certification in progress)',
];
