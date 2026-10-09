import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectById, PROJECTS, titleFor, type DemoKey, type Project, type RoleKey } from '@/data/projects';
import { ROLES } from '@/config/roles';
import { PROFILE } from '@/config/profile';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import StatusBadge from '@/components/ui/StatusBadge';
import { ArrowLeft, ArrowRight, External, Github } from '@/components/ui/Icons';
import { useMeta } from '@/hooks/useMeta';
import { useReveal } from '@/hooks/useReveal';
import NotFound from './NotFound';

const DEMOS: Record<DemoKey, React.LazyExoticComponent<() => JSX.Element>> = {
  recommender: lazy(() => import('@/components/demos/RecommenderDemo')),
  montecarlo: lazy(() => import('@/components/demos/MonteCarloDemo')),
  ask: lazy(() => import('@/components/demos/AskDemo')),
  training: lazy(() => import('@/components/demos/TrainingDemo')),
};

function Block({ title, children, muted = false }: { title: string; children: ReactNode; muted?: boolean }) {
  return (
    <section className="glass rounded-2xl p-6" data-reveal>
      <h2 className={`text-sm font-semibold uppercase tracking-[0.12em] ${muted ? 'text-ink-3' : 'text-primary-light'}`}>{title}</h2>
      <div className="mt-3 text-[15px] leading-relaxed text-ink-2">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-light" aria-hidden="true" />{i}</li>
      ))}
    </ul>
  );
}

function Gallery({ images }: { images: { src: string; caption: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open === null) return;
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, images.length]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((img, i) => (
          <li key={img.src}>
            <button type="button" onClick={() => setOpen(i)} className="group block w-full overflow-hidden rounded-xl border border-white/10 text-left" aria-label={`Open ${img.caption}`}>
              <img src={img.src} alt={img.caption} loading="lazy" decoding="async" className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <span className="block px-2 py-1.5 text-[11px] text-ink-3">{img.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null && (
        <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-label={images[open].caption}
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4 outline-none" onClick={() => setOpen(null)}>
          <figure className="relative max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={images[open].src} alt={images[open].caption} className="max-h-[80vh] w-auto rounded-xl" />
            <figcaption className="mt-3 flex items-center justify-between text-sm text-ink-2">
              <span>{images[open].caption} · {open + 1}/{images.length}</span>
              <span className="flex gap-2">
                <button type="button" className="btn-ghost px-3 py-1.5" onClick={() => setOpen((open - 1 + images.length) % images.length)} aria-label="Previous image"><ArrowLeft /></button>
                <button type="button" className="btn-ghost px-3 py-1.5" onClick={() => setOpen((open + 1) % images.length)} aria-label="Next image"><ArrowRight /></button>
                <button type="button" className="btn-ghost px-3 py-1.5" onClick={() => setOpen(null)}>Close</button>
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

function Video({ src, title }: { src: string; title: string }) {
  const [load, setLoad] = useState(false);
  return load ? (
    <iframe src={src} title={title} allow="fullscreen" loading="lazy" className="aspect-video w-full rounded-xl border border-white/10" />
  ) : (
    <button type="button" onClick={() => setLoad(true)} className="glass grid aspect-video w-full place-items-center rounded-xl text-sm text-ink-2 hover:text-ink">
      <span className="flex flex-col items-center gap-3">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-light text-bg">▶</span>
        Load product walkthrough video (Google Drive)
      </span>
    </button>
  );
}

export default function ProjectPage({ role }: { role: RoleKey }) {
  const { projectId = '' } = useParams();
  const project = projectById(projectId);
  const r = ROLES[role];
  const root = useRef<HTMLDivElement>(null);
  const title = project ? titleFor(project, role) : 'Project not found';
  useMeta(`${title} — ${PROFILE.name}`, project?.summary ?? 'Project not found.');
  useReveal(root, [projectId, role]);
  if (!project) return <NotFound />;

  const proposed = project.status === 'proposed';
  const placeholder = project.status === 'placeholder';
  const order = r.projectOrder.filter((id) => projectById(id));
  const idx = order.indexOf(project.id);
  const prev = idx > 0 ? projectById(order[idx - 1]) : undefined;
  const next = idx >= 0 && idx < order.length - 1 ? projectById(order[idx + 1]) : undefined;
  const related = (project.relatedTo ?? []).map(projectById).filter((p): p is Project => !!p);
  const Demo = project.demo ? DEMOS[project.demo] : null;
  const plan = (s: string) => (proposed ? `Planned ${s.toLowerCase()}` : s);

  return (
    <div ref={root} data-theme={r.theme} className="theme-bg min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 btn-primary">Skip to content</a>
      <SiteHeader role={r} base={r.path} />
      <main id="main" className="page-x pb-20 pt-8">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-3">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to={r.path} className="hover:text-ink">{r.label}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to={`${r.path}#projects`} className="hover:text-ink">Projects</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink-2">{title}</li>
          </ol>
        </nav>

        <header className="mt-6 max-w-3xl">
          <StatusBadge status={project.status} />
          <h1 className="mt-4 text-3xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-3 text-lg text-primary-light">{project.tagline}</p>
          <p className="mt-4 text-ink-2">{project.summary}</p>
          {project.links && (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.links.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="btn-primary">Live site <External /></a>}
              {project.links.demo && <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="btn-primary">Interactive demo <External /></a>}
              {project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn-ghost"><Github /> Source code</a>}
            </div>
          )}
        </header>

        {(proposed || placeholder) && (
          <div role="note" className="mt-8 rounded-2xl border border-amber-300/30 bg-amber-300/[0.07] p-5 text-sm text-amber-100">
            {proposed ? (
              <><strong>Proposed project.</strong> The sections below describe planned scope and approach. It has not been built or evaluated yet, so no results, metrics or deployments are claimed.</>
            ) : (
              <><strong>Details pending.</strong> This slot is reserved for Suhas’s SPA project; its description will be added once confirmed.</>
            )}
          </div>
        )}

        {project.cover && (
          <img src={project.cover} alt={`${title} — cover`} loading="lazy" decoding="async" className="mt-10 max-h-[460px] w-full rounded-2xl border border-white/10 object-cover object-top" data-reveal />
        )}

        {!placeholder && (
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <Block title="Problem">{project.problem}</Block>
            <Block title={proposed ? 'Planned dataset' : 'Dataset'}>{project.dataset}</Block>
            <Block title={plan('Architecture')}><List items={project.architecture} /></Block>
            <Block title={plan('Methodology')}><List items={project.methodology} /></Block>
            <Block title="Tools">
              <ul className="flex flex-wrap gap-2">{project.tools.map((t) => <li key={t} className="pill">{t}</li>)}</ul>
            </Block>
            <Block title="Results" muted={proposed}>
              {project.results.length ? <List items={project.results} /> : <p>No results yet — this project has not been built and evaluated.</p>}
            </Block>
            <Block title={plan('Evaluation')}><List items={project.evaluation} /></Block>
            <Block title={proposed ? 'Known risks & limitations' : 'Limitations'}><List items={project.limitations} /></Block>
            <Block title={proposed ? 'Intended business value' : 'Business implications'}><List items={project.implications} /></Block>
            {project.enhancements && project.enhancements.length > 0 && (
              <Block title="Proposed enhancements (not yet built)" muted><List items={project.enhancements} /></Block>
            )}
          </div>
        )}

        {project.links?.video && (
          <section className="mt-10" aria-label="Video" data-reveal>
            <Video src={project.links.video} title={`${title} walkthrough`} />
          </section>
        )}

        {project.gallery && (
          <section className="mt-10" aria-labelledby="gallery-title" data-reveal>
            <h2 id="gallery-title" className="mb-4 text-xl font-bold">Dashboards & screenshots</h2>
            <Gallery images={project.gallery} />
          </section>
        )}

        {Demo && (
          <section className="mt-10" aria-label="Interactive demo">
            <Suspense fallback={<div className="glass h-64 animate-pulse rounded-2xl" />}>
              <Demo />
            </Suspense>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-10" aria-labelledby="related-title">
            <h2 id="related-title" className="mb-4 text-xl font-bold">Related</h2>
            <ul className="flex flex-wrap gap-3">
              {related.map((p) => (
                <li key={p.id}>
                  <Link to={`${r.path}/projects/${p.id}`} className="glass card-hover inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                    {titleFor(p, role)} <StatusBadge status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav aria-label="More projects" className="mt-14 grid gap-4 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
          {prev ? (
            <Link to={`${r.path}/projects/${prev.id}`} className="glass card-hover rounded-2xl p-5">
              <span className="text-xs text-ink-3">← Previous</span>
              <span className="mt-1 block font-semibold">{titleFor(prev, role)}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`${r.path}/projects/${next.id}`} className="glass card-hover rounded-2xl p-5 text-right">
              <span className="text-xs text-ink-3">Next →</span>
              <span className="mt-1 block font-semibold">{titleFor(next, role)}</span>
            </Link>
          ) : (
            <Link to={`${r.path}#projects`} className="glass card-hover rounded-2xl p-5 text-right">
              <span className="text-xs text-ink-3">Back to</span>
              <span className="mt-1 block font-semibold">All {r.short} projects</span>
            </Link>
          )}
        </nav>
        <p className="mt-6 text-center text-xs text-ink-3">{PROJECTS.filter((p) => p.status === 'completed').length} completed projects across the portfolio.</p>
      </main>
      <SiteFooter />
    </div>
  );
}
