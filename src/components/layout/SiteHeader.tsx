import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ROLE_LIST, type RoleConfig } from '@/config/roles';
import { PROFILE } from '@/config/profile';
import { Download } from '@/components/ui/Icons';

const SECTIONS = [
  ['About', 'about'],
  ['Skills', 'skills'],
  ['Projects', 'projects'],
  ['Experience', 'experience'],
  ['Education', 'education'],
  ['Contact', 'contact'],
] as const;

export function RoleSwitcher({ current, full = false }: { current?: RoleConfig; full?: boolean }) {
  return (
    <nav aria-label="Switch portfolio" className={`glass flex items-center gap-1 rounded-full p-1 ${full ? 'w-full' : ''}`}>
      {ROLE_LIST.map((r) => (
        <NavLink
          key={r.key}
          to={r.path}
          aria-current={current?.key === r.key ? 'page' : undefined}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${full ? 'flex-1 text-center' : ''} ${
            current?.key === r.key ? 'bg-primary-light text-bg' : 'text-ink-2 hover:text-ink'
          }`}
        >
          {r.short}
        </NavLink>
      ))}
    </nav>
  );
}

/** Header for role and project pages. `base` prefixes section anchors (e.g. on project pages). */
export default function SiteHeader({ role, base = '' }: { role?: RoleConfig; base?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`sticky top-0 z-40 transition-colors ${scrolled || open ? 'border-b border-white/[0.06] bg-bg/85 backdrop-blur-xl' : ''}`}>
      <div className="page-x flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" title="Choose a portfolio">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-white shadow-lg shadow-primary/30">SD</span>
          <span className="hidden font-display text-sm font-semibold sm:block">{PROFILE.name}</span>
        </Link>

        {role && (
          <nav aria-label="Sections" className="hidden items-center gap-5 xl:flex">
            {SECTIONS.map(([label, id]) => (
              <a key={id} href={`${base}#${id}`} className="text-sm text-ink-2 transition-colors hover:text-ink">
                {label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <RoleSwitcher current={role} />
          </div>
          <a href={PROFILE.resumeUrl} target="_blank" rel="noopener" className="btn-primary px-4 py-2 text-xs">
            <Download /> Résumé
          </a>
          <button
            type="button"
            className="rounded-lg p-2 text-ink-2 hover:text-ink xl:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="page-x pb-5 xl:hidden">
          <div className="mb-3 md:hidden">
            <RoleSwitcher current={role} full />
          </div>
          {role && (
            <nav aria-label="Sections (mobile)" className="grid grid-cols-2 gap-1">
              {SECTIONS.map(([label, id]) => (
                <a key={id} href={`${base}#${id}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-ink-2 hover:bg-white/5 hover:text-ink">
                  {label}
                </a>
              ))}
            </nav>
          )}
        </div>
      )}
    </header>
  );
}
