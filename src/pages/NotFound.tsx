import { Link } from 'react-router-dom';
import { ROLE_LIST } from '@/config/roles';
import SiteFooter from '@/components/layout/SiteFooter';
import { useMeta } from '@/hooks/useMeta';

export default function NotFound() {
  useMeta('Page not found — Suhas Dhamapurkar', 'The page you were looking for does not exist.');
  return (
    <div data-theme="neutral" className="theme-bg flex min-h-screen flex-col">
      <main id="main" className="page-x flex flex-1 flex-col items-center justify-center py-24 text-center">
        <p className="font-mono text-sm text-primary-light">404</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">This page doesn’t exist.</h1>
        <p className="mt-3 max-w-md text-ink-2">The link may be outdated. Pick a portfolio below or head back to the start.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">Back to start</Link>
          {ROLE_LIST.map((r) => (
            <Link key={r.key} to={r.path} className="btn-ghost">{r.label}</Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
