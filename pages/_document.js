import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Suhas Dhamapurkar — Data Analyst building ETL pipelines, ML models, and BI dashboards. Founder of Resilytics." />
        <meta name="keywords" content="data analyst, SQL, Python, Power BI, machine learning, Resilytics, portfolio" />
        <meta property="og:title" content="Suhas Dhamapurkar | Data Analyst" />
        <meta property="og:description" content="Data Analyst skilled in SQL, Python, and Power BI. Built Resilytics — a production B2B analytics SaaS." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
