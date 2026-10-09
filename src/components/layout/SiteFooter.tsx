import { Link } from 'react-router-dom';
import { PROFILE } from '@/config/profile';
import { Github, Linkedin, Mail } from '@/components/ui/Icons';

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-white/[0.06] py-10">
      <div className="page-x flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-3">© {year} {PROFILE.name}. All rights reserved.</p>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-2">
          <Link to="/" className="hover:text-ink">Choose a portfolio</Link>
          <Link to="/privacy" className="hover:text-ink">Privacy</Link>
          <Link to="/terms" className="hover:text-ink">Terms</Link>
          <Link to="/disclaimer" className="hover:text-ink">Disclaimer</Link>
          <span className="flex items-center gap-3 pl-1">
            <a href={`mailto:${PROFILE.links.email}`} aria-label="Email" className="hover:text-ink"><Mail /></a>
            <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-ink"><Linkedin /></a>
            <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-ink"><Github /></a>
          </span>
        </nav>
      </div>
    </footer>
  );
}
