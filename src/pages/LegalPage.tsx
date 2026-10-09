import type { ReactNode } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { PROFILE, CONTACT_FORM_ENDPOINT } from '@/config/profile';
import { useMeta } from '@/hooks/useMeta';

type Doc = 'privacy' | 'terms' | 'disclaimer';

const UPDATED = 'October 2026';
const email = <a className="text-primary-light underline underline-offset-4" href={`mailto:${PROFILE.links.email}`}>{PROFILE.links.email}</a>;

const DOCS: Record<Doc, { title: string; description: string; body: ReactNode }> = {
  privacy: {
    title: 'Privacy Policy',
    description: 'How this portfolio handles personal information.',
    body: (
      <>
        <p>This is a personal portfolio website operated by {PROFILE.name}. It is designed to collect as little personal information as possible.</p>
        <h2>What is collected</h2>
        <ul>
          <li><strong>No accounts, cookies for tracking, or analytics</strong> are used by this site.</li>
          <li>
            <strong>Contact form.</strong>{' '}
            {CONTACT_FORM_ENDPOINT
              ? 'When you submit the form, your name, email address and message are sent to a third-party form service and forwarded to my inbox so I can reply.'
              : 'The form does not send anything to a server. It opens your own email application with your message pre-filled; you choose whether to send it.'}
          </li>
          <li><strong>Hosting logs.</strong> The hosting provider (Vercel) may process technical data such as IP address and browser type to deliver and secure the site, under its own privacy policy.</li>
          <li><strong>Embedded content.</strong> A product walkthrough video is hosted on Google Drive and only loads if you choose to play it; Google’s privacy policy then applies.</li>
        </ul>
        <h2>How it is used</h2>
        <p>Messages you send are used only to reply to you. They are not sold, shared for marketing, or used for profiling.</p>
        <h2>Your choices</h2>
        <p>You can ask me to delete any correspondence you have sent by emailing {email}.</p>
        <h2>Changes</h2>
        <p>This policy may be updated; the date below shows the latest revision.</p>
      </>
    ),
  },
  terms: {
    title: 'Terms of Use',
    description: 'Terms for using this portfolio website.',
    body: (
      <>
        <p>By using this website you agree to these terms.</p>
        <h2>Content and copyright</h2>
        <p>Unless stated otherwise, the text, design, project write-ups, images and code samples on this site are © {PROFILE.name}. You may link to the site and quote short excerpts with attribution. Other reuse requires permission.</p>
        <h2>Third-party links and names</h2>
        <p>Links to external sites (GitHub, LinkedIn, Streamlit, Google Drive, Resilytics) are provided for convenience; I am not responsible for their content. Product and company names mentioned are the property of their respective owners and are used only descriptively.</p>
        <h2>Interactive demos</h2>
        <p>Demos run entirely in your browser on synthetic or sample data. They are illustrations and must not be relied on for financial, business or other decisions.</p>
        <h2>No warranty</h2>
        <p>The site is provided “as is”, without warranties of any kind. To the extent permitted by law, I am not liable for any loss arising from its use.</p>
        <h2>Contact</h2>
        <p>Questions about these terms: {email}.</p>
      </>
    ),
  },
  disclaimer: {
    title: 'Disclaimer',
    description: 'Important notes about projects, demos and claims on this site.',
    body: (
      <>
        <h2>Project status</h2>
        <p>Projects are labelled <strong>Completed</strong>, <strong>Proposed</strong> or <strong>Details pending</strong>. Only completed projects report results, and those results are stated as delivered. Proposed projects describe planned work and make no claims about performance, deployments, users or business impact.</p>
        <h2>Demos and sample data</h2>
        <p>The recommendation, model-training, risk-simulation and “Ask Resilytics” demos use synthetic or fictional sample data generated for illustration. Their outputs are not results from any real business, client or dataset.</p>
        <h2>No affiliation</h2>
        <p>The recommendation demo is an original concept inspired by common streaming and e-commerce experiences. It is not affiliated with, endorsed by, or connected to Amazon, Netflix, or any other company, and uses no third-party logos or catalogues.</p>
        <h2>Not professional advice</h2>
        <p>Analyses, forecasts and risk metrics shown here (including stock-price forecasting and Resilytics risk methodology) are educational and are not financial, investment or legal advice.</p>
      </>
    ),
  },
};

export default function LegalPage({ doc }: { doc: Doc }) {
  const d = DOCS[doc];
  useMeta(`${d.title} — ${PROFILE.name}`, d.description);
  return (
    <div data-theme="neutral" className="theme-bg min-h-screen">
      <SiteHeader />
      <main id="main" className="page-x max-w-3xl py-14">
        <h1 className="text-3xl font-bold sm:text-4xl">{d.title}</h1>
        <p className="mt-2 text-sm text-ink-3">Last updated: {UPDATED}</p>
        <article className="mt-8 space-y-4 text-[15px] leading-relaxed text-ink-2 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">
          {d.body}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
