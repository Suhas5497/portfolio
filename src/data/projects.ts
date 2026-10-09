// Project registry shared by all three experiences.
//
// HONESTY RULES (enforced by the UI):
//  • status 'completed'  → results/metrics come only from Suhas's résumé or his
//    existing published portfolio. Nothing here is estimated or invented.
//  • status 'proposed'   → planned scope only. `results` must stay empty; the
//    detail page labels every section as planned and shows "No results yet".
//  • status 'placeholder'→ reserved slot; details intentionally blank until
//    supplied. Edit the entry in this file to publish it.
// To promote a proposed project, change its status and fill `results`,
// `evaluation` and `links` with real, verifiable information.

export type RoleKey = 'data' | 'ai' | 'hybrid';
export type ProjectStatus = 'completed' | 'proposed' | 'placeholder';
export type DemoKey = 'recommender' | 'montecarlo' | 'ask' | 'training';

export interface Project {
  id: string;
  title: string;
  roleTitles?: Partial<Record<RoleKey, string>>;
  tagline: string;
  status: ProjectStatus;
  summary: string;
  problem: string;
  dataset: string;
  architecture: string[];
  methodology: string[];
  tools: string[];
  results: string[];
  evaluation: string[];
  limitations: string[];
  implications: string[];
  enhancements?: string[];
  links?: { github?: string; demo?: string; live?: string; video?: string };
  cover?: string;
  gallery?: { src: string; caption: string }[];
  demo?: DemoKey;
  relatedTo?: string[];
}

const NO_RESULTS: string[] = [];

function proposed(p: Omit<Project, 'status' | 'results'> & { results?: never }): Project {
  return { ...p, status: 'proposed', results: NO_RESULTS };
}

export const PROJECTS: Project[] = [
  // ── Completed ──────────────────────────────────────────────────────────────
  {
    id: 'resilytics',
    title: 'Resilytics',
    roleTitles: { data: 'Resilytics — Revenue Intelligence', hybrid: 'Resilytics — Decision Intelligence Platform' },
    tagline: 'Multi-tenant B2B decision-intelligence SaaS, built and deployed solo',
    status: 'completed',
    summary:
      'Turns raw SMB transaction data into board-ready risk and decision reports: ingestion and validation, an analytics warehouse, a Monte Carlo risk engine and executive reporting.',
    problem:
      'Small and mid-sized businesses rarely have a BI team, so founders and finance leads lack timely signals about revenue concentration, downside risk and financial health.',
    dataset:
      'Tenant-uploaded structured business/transaction data (e.g. CSV exports). Each upload passes schema validation and canonical transformation before analysis.',
    architecture: [
      'Ingestion → schema validation → canonical transformation into a DuckDB analytics warehouse.',
      'FastAPI backend with PostgreSQL for application data and Redis + async RQ workers for long-running jobs.',
      'Risk/simulation engine (Monte Carlo + shock testing) and an executive reporting layer.',
      'React + TypeScript + Vite frontend; tenant isolation enforced at the SQL layer.',
    ],
    methodology: [
      'Monte Carlo simulation and shock testing of revenue scenarios.',
      'HHI to measure customer / market concentration.',
      'Basel III-style VaR-95 for downside exposure.',
      'Modified Altman Z-Score as a financial-distress indicator.',
    ],
    tools: ['Python', 'SQL', 'FastAPI', 'PostgreSQL', 'DuckDB', 'Redis', 'RQ', 'React', 'TypeScript', 'Vite'],
    results: [
      'Live in production at resilytics.in.',
      'Complete pipeline from raw upload to an executive risk/decision report.',
      'Database migrations, automated release checks and demo-environment tooling in place.',
    ],
    evaluation: [
      'Engineering validation through schema checks on every upload and automated release checks before deploys.',
      'No customer-outcome or revenue-impact metrics are claimed on this site.',
    ],
    limitations: [
      'Risk metrics are only as reliable as the uploaded data; incomplete histories widen uncertainty.',
      'Simulation outputs are decision support, not financial advice.',
      'Built and maintained by one engineer.',
    ],
    implications: [
      'Gives SMB leaders a repeatable view of concentration and downside risk without hiring a BI team.',
      'Converts analysis into ranked, explainable actions rather than raw charts.',
    ],
    enhancements: [
      'Ask Resilytics — a natural-language assistant (see its own proposed project page).',
    ],
    links: {
      live: 'https://resilytics.in',
      github: 'https://github.com/Suhas5497/Resilytics',
      video: 'https://drive.google.com/file/d/1xa5auWjSEbmHqArwoHLRRlr1A08TEjMh/preview',
    },
    cover: '/assets/projects/resilytics-cover.webp',
    demo: 'montecarlo',
    relatedTo: ['ask-resilytics'],
  },
  {
    id: 'retail',
    title: 'Retail Sales Intelligence Dashboard',
    tagline: 'Four-page executive Power BI dashboard · 2015–2018 sales',
    status: 'completed',
    summary:
      'An interactive Power BI report covering returns & delivery, sales & profit, target achievement and a ranked key-risk action plan.',
    problem:
      'Regional managers could not see delivery delays, rising returns or target shortfalls until the end of the quarter.',
    dataset: 'Retail sales records, 2015–2018, totalling ₹29.4L in sales.',
    architecture: [
      'Star-schema data model in Power BI.',
      'Four report pages: Returns & Delivery · Sales & Profit · Target Achievement · Key Risk & Action Plan.',
    ],
    methodology: [
      'KPI cards and YoY growth DAX measures.',
      'Dynamic slicers and a decomposition tree for root-cause drill-down.',
      'Findings translated into a category-level action plan.',
    ],
    tools: ['Power BI', 'DAX', 'Star Schema', 'Excel'],
    results: [
      'Central region drove 60% of total sales — flagged as a concentration risk.',
      'Standard Class shipping averaged 5-day delays across 60% of orders.',
      'Return rate rose from 5.4% to 6.9%, isolated by category.',
      '88.48% achievement tracked against a ₹5.4L sales target.',
    ],
    evaluation: ['Descriptive analysis; figures are computed directly from the dataset in Power BI.'],
    limitations: [
      'Historical 2015–2018 data — patterns may not reflect current conditions.',
      'Descriptive and diagnostic only; no forecasting in this version.',
    ],
    implications: [
      'Reduce dependence on the Central region; review Standard Class SLAs; target categories driving returns.',
    ],
    enhancements: ['Add a demand forecast and automated threshold alerts (proposed).'],
    links: {
      github: 'https://github.com/Suhas5497/sales-intelligence-platform',
      demo: 'https://sales-intelligence-platform-dovb9bnzxw69tvcorxpqqz.streamlit.app/',
    },
    cover: '/assets/projects/retail-cover.webp',
    gallery: [
      { src: '/assets/projects/retail-1-returns-delivery.webp', caption: 'Returns & delivery' },
      { src: '/assets/projects/retail-2-sales-profit.webp', caption: 'Sales & profit' },
      { src: '/assets/projects/retail-3-target-achievement.webp', caption: 'Target achievement' },
      { src: '/assets/projects/retail-4-key-risk.webp', caption: 'Key risk & action plan' },
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Business Analytics',
    tagline: 'Imarticus PG capstone · advanced SQL & Power BI',
    status: 'completed',
    summary:
      'SQL analysis of 100,000+ orders across 9 relational tables: RFM segmentation, Pareto revenue analysis, cohort retention and a drill-through dashboard.',
    problem:
      'No single view of customer value tiers, category revenue mix, or the delivery delays eroding margins.',
    dataset: '100,000+ orders across 9 relational tables.',
    architecture: ['Relational SQL model → analytical queries and stored procedures → Power BI drill-through dashboard.'],
    methodology: [
      'CTEs, window functions (RANK, LAG, NTILE), stored procedures and multi-table joins.',
      'RFM segmentation (Champions → Lost), Pareto analysis and a cohort retention table.',
    ],
    tools: ['SQL', 'Power BI', 'DAX', 'Python'],
    results: [
      'Top 5 categories generated 62% of revenue (Pareto).',
      'RFM customer segments from Champions to Lost.',
      'Cohort retention table built.',
      'Drill-through dashboard exposing delivery-delay root causes.',
    ],
    evaluation: ['Descriptive analysis; results reproducible from the SQL in the repository.'],
    limitations: ['Single historical dataset; segment thresholds are rule-based rather than learned.'],
    implications: ['Focus retention spend on high-value RFM segments and fix the delivery causes behind delays.'],
    links: { github: 'https://github.com/Suhas5497/ecommerce-sql-analytics' },
    cover: '/assets/projects/ecommerce-cover.webp',
    gallery: [1, 2, 3, 4, 5].map((i) => ({ src: `/assets/projects/ecommerce-${i}.webp`, caption: `Dashboard view ${i}` })),
  },
  {
    id: 'churn',
    title: 'Customer Churn Prediction',
    roleTitles: { data: 'Customer Retention & Churn Analytics', ai: 'Customer Churn Prediction' },
    tagline: 'XGBoost classifier on 7,000+ telecom customer records',
    status: 'completed',
    summary:
      'End-to-end churn prediction: EDA, feature engineering, a tuned XGBoost classifier and driver analysis, with an interactive Streamlit demo.',
    problem: 'Identify high-risk telecom customers before they churn, so retention effort goes where it matters.',
    dataset: '7,000+ telecom customer records.',
    architecture: ['Python pipeline: cleaning → feature engineering → XGBoost model → Streamlit app.'],
    methodology: [
      'Exploratory data analysis and feature engineering.',
      'XGBoost classification with hyperparameter tuning.',
      'Feature-importance analysis to surface churn drivers.',
    ],
    tools: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'Streamlit'],
    results: [
      '85% test accuracy.',
      'Month-to-month contracts showed roughly 3× higher churn probability.',
      'Top 3 churn drivers surfaced and adopted by the retention team (Labmentix internship).',
    ],
    evaluation: ['Accuracy on a held-out test set (85%). Per-class precision/recall are not reported on this site.'],
    limitations: [
      'Accuracy alone can flatter imbalanced churn data; recall on churners matters most.',
      'Model reflects one telecom customer base and period.',
    ],
    implications: ['Prioritise contract-conversion offers for month-to-month customers and act on the top drivers.'],
    enhancements: ['Report precision/recall/ROC-AUC, add probability calibration and drift monitoring (proposed).'],
    links: {
      github: 'https://github.com/Suhas5497/customer-churn-prediction-system',
      demo: 'https://customer-churn-prediction-system-oneq3amaedjugshgt599ip.streamlit.app/',
    },
    cover: '/assets/projects/churn-cover.webp',
  },
  {
    id: 'yesbank',
    title: 'Yes Bank Stock Price Forecasting',
    tagline: 'Time series · SARIMA, ARIMA & Random Forest',
    status: 'completed',
    summary:
      'Fifteen years of monthly Yes Bank prices (2005–2020) analysed around the 2018 fraud case, with three forecasting models compared.',
    problem: 'Quantify the risk signature of a fraud-impacted stock and produce a defensible near-term forecast.',
    dataset: 'Monthly Yes Bank stock data, 2005–2020.',
    architecture: ['Python notebook pipeline: decomposition → model fitting → comparison on error metrics.'],
    methodology: [
      'Statistical decomposition of the decline from the pre-2018 peak.',
      'ARIMA, SARIMA and Random Forest compared on MAE, RMSE and fit.',
    ],
    tools: ['Python', 'Pandas', 'Statsmodels', 'Scikit-learn', 'Matplotlib'],
    results: [
      '~96% price decline quantified from the pre-2018 peak (₹367.90).',
      'SARIMA performed best and forecast the next month’s close at ₹15.80.',
      'Random Forest on intra-month price features: R² = 0.97 (MAE ₹14.96, RMSE ₹23.57).',
    ],
    evaluation: ['MAE, RMSE and R² on held-out periods.'],
    limitations: [
      'Intra-month features make the Random Forest R² optimistic for true out-of-sample forecasting.',
      'Structural breaks (fraud event) limit any model’s reliability.',
    ],
    implications: ['Supports risk-aware positioning rather than price targets.'],
    links: { github: 'https://github.com/Suhas5497/Yes-Bank-Stock-Price-Analysis-Future-Price-Prediction' },
    cover: '/assets/projects/yesbank-cover.webp',
  },

  // ── Proposed (planned scope only — no results claimed) ─────────────────────
  proposed({
    id: 'recommendation',
    title: 'Recommendation System',
    roleTitles: {
      data: 'Recommendation Analytics',
      ai: 'Recommendation Engine',
      hybrid: 'Personalised Recommendation & Analytics',
    },
    tagline: 'Streaming/e-commerce-style recommendations — original concept, no brand affiliation',
    summary:
      'Recommend items from interaction history and measure whether recommendations actually change engagement. Includes an original in-browser demo on synthetic data.',
    problem: 'Large catalogues bury relevant items; teams need both a recommender and analytics that prove it helps.',
    dataset: 'Planned: a public, licence-compatible ratings/interaction dataset. The demo below uses a small synthetic catalogue.',
    architecture: [
      'Interaction log → user–item matrix → candidate generation (item-item similarity / matrix factorisation) → ranking.',
      'Analytics layer: coverage, diversity, CTR-style funnel metrics, cohort comparison.',
    ],
    methodology: ['Item-based collaborative filtering baseline, then matrix factorisation; offline evaluation before any online test.'],
    tools: ['Python', 'Pandas', 'Scikit-learn', 'SQL', 'FastAPI', 'Streamlit'],
    evaluation: ['Planned: precision@k, recall@k, NDCG, catalogue coverage.'],
    limitations: ['Cold-start users/items; popularity bias.'],
    implications: ['Better discovery and measurable engagement uplift — to be validated.'],
    demo: 'recommender',
  }),
  proposed({
    id: 'dynamic-pricing',
    title: 'Dynamic Pricing & Profitability',
    tagline: 'Price elasticity and margin analysis',
    summary: 'Estimate price elasticity by product segment and simulate how price changes move volume and margin.',
    problem: 'Pricing decisions are often made without quantifying elasticity or margin trade-offs.',
    dataset: 'Planned: transaction-level sales with price, cost and promotion fields.',
    architecture: ['SQL extraction → elasticity modelling in Python → Power BI what-if dashboard.'],
    methodology: ['Log-log regression for elasticity; scenario simulation for margin impact.'],
    tools: ['SQL', 'Python', 'Pandas', 'Power BI', 'DAX'],
    evaluation: ['Planned: out-of-sample fit of elasticity models; backtests on historical price changes.'],
    limitations: ['Confounding from promotions and seasonality.'],
    implications: ['Price guidance by segment with explicit margin trade-offs.'],
  }),
  proposed({
    id: 'traffic',
    title: 'Traffic & Mobility Analytics',
    roleTitles: { data: 'Traffic & Mobility Analytics', hybrid: 'Intelligent Traffic & Road Safety' },
    tagline: 'Congestion, incidents and road-safety insight',
    summary:
      'Analyse traffic volumes and incidents to find congestion and safety hot-spots; the hybrid version adds computer-vision counts and helmet-compliance signals.',
    problem: 'Road authorities need evidence for where congestion and safety interventions will help most.',
    dataset: 'Planned: public traffic-count / incident datasets and openly licensed road video.',
    architecture: [
      'Vision layer (vehicle counting, helmet detection) → event table → time/location aggregation → dashboard.',
    ],
    methodology: ['Time-series aggregation, hot-spot mapping, and risk scoring by location and hour.'],
    tools: ['Python', 'OpenCV', 'YOLO-family detector', 'SQL', 'Power BI'],
    evaluation: ['Planned: detection mAP for the vision layer; agreement of counts with manual samples.'],
    limitations: ['Camera angle, lighting and occlusion affect detection quality.'],
    implications: ['Targeted enforcement and infrastructure prioritisation.'],
    relatedTo: ['helmet-detection', 'vehicle-counting'],
  }),
  proposed({
    id: 'marketing-attribution',
    title: 'Marketing Attribution',
    tagline: 'Which channels actually drive conversions',
    summary: 'Compare rule-based and data-driven attribution to allocate marketing budget by contribution.',
    problem: 'Last-click reporting over-credits some channels and hides others.',
    dataset: 'Planned: multi-touch journey logs (public or synthetic, clearly labelled).',
    architecture: ['Journey table in SQL → attribution models in Python → channel ROI dashboard.'],
    methodology: ['First/last/linear/time-decay baselines vs. Markov-chain removal effect.'],
    tools: ['SQL', 'Python', 'Pandas', 'Power BI'],
    evaluation: ['Planned: stability of channel credit across time windows.'],
    limitations: ['Attribution is not causal without experiments.'],
    implications: ['Budget reallocation toward under-credited channels — to be validated with tests.'],
  }),
  proposed({
    id: 'inventory-forecasting',
    title: 'Inventory Forecasting',
    tagline: 'SKU-level demand forecasts for stock planning',
    summary: 'Forecast demand per SKU/store and translate forecasts into reorder points and safety stock.',
    problem: 'Stock-outs and overstock both cost money when demand is estimated by gut feel.',
    dataset: 'Planned: public retail demand dataset.',
    architecture: ['SQL feature tables → forecasting models → reorder-point calculator → dashboard.'],
    methodology: ['Seasonal baselines, SARIMA and gradient-boosted models compared per SKU group.'],
    tools: ['Python', 'Statsmodels', 'XGBoost', 'SQL', 'Excel', 'Power BI'],
    evaluation: ['Planned: MAPE/WAPE and bias by SKU segment.'],
    limitations: ['Intermittent demand for long-tail SKUs.'],
    implications: ['Lower holding cost and fewer stock-outs — to be quantified.'],
  }),
  proposed({
    id: 'executive-kpi',
    title: 'Executive KPI Monitoring',
    tagline: 'One page of KPIs with alerts on what changed',
    summary: 'A KPI framework and dashboard that highlights movements and their drivers instead of static numbers.',
    problem: 'Executives receive many reports but no clear signal of what changed and why.',
    dataset: 'Planned: sample business data (synthetic, labelled) or a public dataset.',
    architecture: ['Star schema → DAX measures → KPI page with variance and decomposition drill-down.'],
    methodology: ['KPI definition workshop, thresholds and variance analysis.'],
    tools: ['Power BI', 'DAX', 'SQL', 'Excel'],
    evaluation: ['Planned: KPI definitions reconciled against source totals.'],
    limitations: ['Alert thresholds need business calibration.'],
    implications: ['Faster, focused executive reviews.'],
  }),
  proposed({
    id: 'helmet-detection',
    title: 'Helmet Detection',
    tagline: 'Computer vision for two-wheeler helmet compliance',
    summary: 'Detect riders and classify helmet use from road video frames.',
    problem: 'Manual helmet-compliance monitoring does not scale.',
    dataset: 'Planned: an openly licensed annotated helmet dataset.',
    architecture: ['Frame sampling (OpenCV) → object detector (YOLO-family) → rider/helmet association → event log.'],
    methodology: ['Transfer learning from a pretrained detector; augmentation for lighting and blur.'],
    tools: ['Python', 'OpenCV', 'YOLO-family detector', 'FastAPI'],
    evaluation: ['Planned: mAP@0.5, precision/recall per class on a held-out split.'],
    limitations: ['Small/occluded heads at distance; privacy considerations for any real footage.'],
    implications: ['Supports road-safety analysis; not intended for automated penalties.'],
  }),
  proposed({
    id: 'vehicle-counting',
    title: 'Vehicle Classification & Counting',
    tagline: 'Detect, classify and count vehicles by type',
    summary: 'Classify vehicles (car, bike, bus, truck) and count line crossings from video.',
    problem: 'Traffic studies need classified counts, which are costly to collect manually.',
    dataset: 'Planned: openly licensed traffic video / annotated datasets.',
    architecture: ['Detector → multi-object tracker → line-crossing counter → time-series table.'],
    methodology: ['Pretrained detector fine-tuned on target classes; tracking to avoid double counts.'],
    tools: ['Python', 'OpenCV', 'YOLO-family detector', 'Pandas'],
    evaluation: ['Planned: mAP per class; count error vs. manual counts.'],
    limitations: ['Occlusion in dense traffic; night footage.'],
    implications: ['Feeds traffic & mobility analytics.'],
  }),
  proposed({
    id: 'fake-review',
    title: 'Fake Review Detection',
    tagline: 'NLP classifier for suspicious reviews',
    summary: 'Classify reviews as genuine or suspicious using text and behavioural features.',
    problem: 'Fake reviews mislead customers and distort product analytics.',
    dataset: 'Planned: a public labelled review dataset.',
    architecture: ['Text cleaning → TF-IDF / transformer embeddings → classifier → explanation of top signals.'],
    methodology: ['Baseline logistic regression, then gradient boosting / fine-tuned transformer.'],
    tools: ['Python', 'Scikit-learn', 'NLP', 'XGBoost', 'Streamlit'],
    evaluation: ['Planned: precision, recall, F1 and PR-AUC.'],
    limitations: ['Labels in public datasets can be noisy; adversarial drift.'],
    implications: ['Flag reviews for moderation rather than auto-removal.'],
  }),
  proposed({
    id: 'demand-anomaly',
    title: 'Demand Forecasting & Anomaly Detection',
    tagline: 'Forecast demand and flag unusual movements',
    summary: 'Forecast demand and detect anomalies where actuals break from expected ranges.',
    problem: 'Spikes and drops go unnoticed until they hit revenue or inventory.',
    dataset: 'Planned: public sales/demand time series.',
    architecture: ['Forecast model → prediction intervals → residual-based anomaly flags → alerts.'],
    methodology: ['SARIMA / gradient boosting forecasts; anomalies from residual z-scores and isolation forest.'],
    tools: ['Python', 'Statsmodels', 'Scikit-learn', 'FastAPI'],
    evaluation: ['Planned: MAPE for forecasts; precision of anomaly flags on labelled events.'],
    limitations: ['Holidays and promotions need explicit features to avoid false alarms.'],
    implications: ['Earlier response to demand shifts.'],
  }),
  proposed({
    id: 'document-intelligence',
    title: 'Document Intelligence',
    roleTitles: { ai: 'Document Intelligence', hybrid: 'Intelligent Document Processing' },
    tagline: 'Extract structured data from business documents',
    summary: 'OCR and layout-aware extraction that turns invoices/forms into validated, structured records.',
    problem: 'Manual data entry from documents is slow and error-prone.',
    dataset: 'Planned: public form/invoice datasets or synthetic documents.',
    architecture: ['OCR → layout parsing → field extraction → validation rules → structured store.'],
    methodology: ['Rule + ML hybrid extraction; deterministic validation of totals and dates.'],
    tools: ['Python', 'OCR', 'NLP', 'FastAPI', 'PostgreSQL'],
    evaluation: ['Planned: field-level precision/recall and exact-match rate.'],
    limitations: ['Low-quality scans and unseen layouts.'],
    implications: ['Faster document processing with an audit trail.'],
  }),
  proposed({
    id: 'rag-assistant',
    title: 'RAG Knowledge Assistant',
    tagline: 'Answers grounded in your documents, with citations',
    summary: 'A retrieval-augmented assistant that answers questions from a document set and cites its sources.',
    problem: 'Knowledge is scattered across documents; generic chatbots hallucinate.',
    dataset: 'Planned: a public documentation corpus.',
    architecture: ['Chunking → embeddings → vector index → retrieval → LLM answer with citations → feedback log.'],
    methodology: ['Hybrid keyword + vector retrieval; answer only from retrieved context.'],
    tools: ['Python', 'FastAPI', 'Embeddings', 'Vector index', 'LLM API'],
    evaluation: ['Planned: retrieval recall@k, answer faithfulness and citation accuracy.'],
    limitations: ['Quality depends on retrieval; must refuse when context is missing.'],
    implications: ['Faster answers for internal teams with traceable sources.'],
  }),
  proposed({
    id: 'ml-monitoring',
    title: 'ML Monitoring',
    tagline: 'Drift, performance and data-quality monitoring',
    summary: 'Monitor production models for data drift, prediction drift and performance decay.',
    problem: 'Models silently degrade after deployment.',
    dataset: 'Planned: logged predictions from the churn model (or a simulated stream).',
    architecture: ['Prediction log → reference vs. current windows → drift metrics → alert dashboard.'],
    methodology: ['PSI / KS tests for drift; delayed-label performance tracking.'],
    tools: ['Python', 'FastAPI', 'PostgreSQL', 'Streamlit'],
    evaluation: ['Planned: detection of injected drift in simulation.'],
    limitations: ['Label delay limits real-time performance tracking.'],
    implications: ['Earlier retraining decisions.'],
    relatedTo: ['churn'],
  }),
  proposed({
    id: 'predictive-customer',
    title: 'Predictive Customer Intelligence',
    tagline: 'From churn risk to next-best action',
    summary:
      'Extends the completed churn model with segmentation and lifetime-value context to recommend a retention action per customer.',
    problem: 'A churn score alone does not tell a team what to do or whether it is worth the cost.',
    dataset: 'Planned: telecom churn data plus engineered value features.',
    architecture: ['Churn model + RFM/value segments → decision rules → action list with expected value.'],
    methodology: ['Combine predicted risk with value tiers; evaluate actions with uplift-style comparisons.'],
    tools: ['Python', 'XGBoost', 'SQL', 'Power BI'],
    evaluation: ['Planned: precision@k of high-risk lists; offline policy comparison.'],
    limitations: ['Action effects need experiments to confirm.'],
    implications: ['Retention spend focused where expected value is highest.'],
    relatedTo: ['churn'],
  }),
  proposed({
    id: 'ask-resilytics',
    title: 'Ask Resilytics',
    tagline: 'Natural-language questions, deterministic answers',
    summary:
      'A proposed assistant for Resilytics: an LLM only interprets the question into a structured intent; every number comes from validated, deterministic calculations.',
    problem: 'Business users want to ask questions in plain language, but LLM-generated numbers cannot be trusted.',
    dataset: 'Resilytics tenant data (validated warehouse tables). The demo below uses a small sample dataset.',
    architecture: [
      '1 · Intent layer — LLM maps the question to a whitelisted intent + parameters (JSON schema).',
      '2 · Validation — parameters checked against the tenant schema; unknown intents are refused.',
      '3 · Calculation — deterministic SQL/Python functions compute the answer.',
      '4 · Narration — the answer is phrased with the computed values only, with the formula shown.',
    ],
    methodology: ['Strict separation of language understanding from computation; full audit log of intent → query → result.'],
    tools: ['FastAPI', 'DuckDB', 'Python', 'LLM API', 'JSON Schema'],
    evaluation: ['Planned: intent-classification accuracy on a question bank; 100% match of numbers vs. direct queries.'],
    limitations: ['Only supports whitelisted intents; ambiguous questions require clarification.'],
    implications: ['Self-serve answers without sacrificing numerical correctness.'],
    demo: 'ask',
    relatedTo: ['resilytics'],
  }),

  // ── Placeholder — fill in when details are supplied ─────────────────────────
  {
    id: 'spa-project',
    title: 'SPA Project',
    tagline: 'Details coming soon',
    status: 'placeholder',
    summary: 'This slot is reserved for Suhas’s single-page application project. Its description will be published once confirmed.',
    problem: '',
    dataset: '',
    architecture: [],
    methodology: [],
    tools: [],
    results: [],
    evaluation: [],
    limitations: [],
    implications: [],
  },
];

export const projectById = (id: string) => PROJECTS.find((p) => p.id === id);
export const titleFor = (p: Project, role?: RoleKey) => (role && p.roleTitles?.[role]) || p.title;
