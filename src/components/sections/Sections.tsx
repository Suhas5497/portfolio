import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { RoleConfig } from '@/config/roles';
import { ACHIEVEMENTS, CONTACT_FORM_ENDPOINT, EDUCATION, EXPERIENCE, PROFILE } from '@/config/profile';
import { PROJECTS, titleFor, type Project, type ProjectStatus } from '@/data/projects';
import StatusBadge from '@/components/ui/StatusBadge';
import { ArrowRight, Download, External, Github, Linkedin, Mail } from '@/components/ui/Icons';

export function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 py-20 sm:py-24">
      <div className="page-x">
        <p className="eyebrow" data-reveal>{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-3 text-3xl font-bold sm:text-4xl" data-reveal>{title}</h2>
        {intro && <div className="mt-4 max-w-2xl text-ink-2" data-reveal>{intro}</div>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
export function About({ role }: { role: RoleConfig }) {
  const facts: [string, string][] = [
    ['Based in', 'Pune · from ' + PROFILE.hometown],
    ['Languages', PROFILE.languages.join(', ')],
    ['Education', 'B.Tech CSE (AI & ML) · PG in Data Science & Analytics'],
    ['Currently', 'Building Resilytics'],
  ];
  return (
    <Section id="about" eyebrow="About" title="A little about me">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="prose-p space-y-4 text-[15px] leading-relaxed text-ink-2" data-reveal>
          {role.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="glass grid gap-4 rounded-2xl p-6" data-reveal>
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-widest text-ink-3">{k}</dt>
              <dd className="mt-1 text-sm text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────
export function Skills({ role }: { role: RoleConfig }) {
  return (
    <Section id="skills" eyebrow="Skills" title="Tools & techniques">
      <div className="grid gap-5 sm:grid-cols-2">
        {role.skills.map((g) => (
          <div key={g.label} className="glass card-hover rounded-2xl p-6" data-reveal>
            <h3 className="text-sm font-semibold text-primary-light">{g.label}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li key={s} className="pill">{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="glass mt-5 rounded-2xl p-6" data-reveal>
        <h3 className="text-sm font-semibold text-primary-light">Achievements & certifications</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink-2">
          {ACHIEVEMENTS.map((a) => (
            <li key={a} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-light" aria-hidden="true" />{a}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
export function ProjectCard({ project, role, featured = false }: { project: Project; role: RoleConfig; featured?: boolean }) {
  const to = `${role.path}/projects/${project.id}`;
  return (
    <article
      className={`glass card-hover group relative flex flex-col overflow-hidden rounded-2xl ${featured ? 'lg:col-span-2 lg:flex-row' : ''}`}
      data-reveal
    >
      {project.cover ? (
        <div className={`relative overflow-hidden bg-surface ${featured ? 'lg:w-1/2' : ''}`}>
          <img
            src={project.cover}
            alt=""
            loading="lazy"
            decoding="async"
            width={1600}
            height={900}
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${featured ? 'h-56 lg:h-full' : 'h-44'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent" />
        </div>
      ) : (
        <div className={`relative grid h-28 place-items-center overflow-hidden bg-[radial-gradient(circle_at_30%_30%,rgb(var(--c-primary)/0.25),transparent_60%),radial-gradient(circle_at_80%_70%,rgb(var(--c-accent)/0.18),transparent_55%)] ${featured ? 'lg:h-auto lg:w-1/2' : ''}`}>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">{project.status === 'placeholder' ? 'Coming soon' : 'Concept'}</span>
        </div>
      )}
      <div className={`flex flex-1 flex-col p-6 ${featured ? 'lg:p-8' : ''}`}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={project.status} />
          {featured && <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-[11px] font-semibold text-bg">Flagship</span>}
        </div>
        <h3 className={`font-bold ${featured ? 'text-2xl' : 'text-lg'}`}>
          <Link to={to} className="after:absolute after:inset-0 focus:outline-none">
            {titleFor(project, role.key)}
          </Link>
        </h3>
        <p className="mt-1 text-xs font-semibold text-primary-light">{project.tagline}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-2">{project.summary}</p>
        {project.status === 'completed' && project.results[0] && (
          <p className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-ink-2">
            <span className="font-semibold text-ink">Result: </span>
            {project.results[0]}
          </p>
        )}
        {project.tools.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tools">
            {project.tools.slice(0, 6).map((t) => (
              <li key={t} className="pill py-0.5 text-[11px]">{t}</li>
            ))}
          </ul>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-light">
          {project.status === 'placeholder' ? 'View placeholder' : 'Read case study'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

type Filter = 'all' | ProjectStatus;

export function Projects({ role }: { role: RoleConfig }) {
  const [filter, setFilter] = useState<Filter>('all');
  const ordered = useMemo(() => {
    const list = role.projectOrder.map((id) => PROJECTS.find((p) => p.id === id)).filter((p): p is Project => !!p);
    // Completed work first so recruiters see evidence before plans; otherwise keep the role's order.
    const rank: Record<ProjectStatus, number> = { completed: 0, proposed: 1, placeholder: 2 };
    return list.map((p, i) => ({ p, i })).sort((a, b) => rank[a.p.status] - rank[b.p.status] || a.i - b.i).map((x) => x.p);
  }, [role]);
  const flagship = role.flagship ? ordered.find((p) => p.id === role.flagship) : undefined;
  const rest = ordered.filter((p) => p !== flagship && (filter === 'all' || p.status === filter));
  const count = (s: ProjectStatus) => ordered.filter((p) => p.status === s).length;

  const tabs: [Filter, string][] = [
    ['all', `All (${ordered.length})`],
    ['completed', `Completed (${count('completed')})`],
    ['proposed', `Proposed (${count('proposed')})`],
  ];

  return (
    <Section
      id="projects"
      eyebrow="Featured projects"
      title="Selected work"
      intro={<>Completed projects show results exactly as delivered. <strong className="text-ink">Proposed</strong> projects describe planned scope only — no results are claimed until they are built and evaluated.</>}
    >
      {flagship && (
        <div className="mb-8 grid lg:grid-cols-2">
          <ProjectCard project={flagship} role={role} featured />
        </div>
      )}
      <div role="tablist" aria-label="Filter projects" className="mb-6 flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${filter === key ? 'bg-primary-light text-bg' : 'glass text-ink-2 hover:text-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <ProjectCard key={`${filter}-${p.id}`} project={p} role={role} />
        ))}
      </div>
    </Section>
  );
}

// ── Experience ────────────────────────────────────────────────────────────────
export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I’ve built things">
      <ol className="relative space-y-6 border-l border-white/10 pl-6">
        {EXPERIENCE.map((e) => (
          <li key={e.org} className="relative" data-reveal>
            <span className="absolute -left-[31px] top-2 h-3 w-3 rounded-full bg-primary-light shadow-[0_0_12px_rgb(var(--c-primary)/0.7)]" aria-hidden="true" />
            <div className="glass rounded-2xl p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold">{e.role}</h3>
                  <p className="text-sm font-semibold text-primary-light">
                    {e.url ? <a href={e.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{e.org} ↗</a> : e.org}
                    {e.mode ? <span className="text-ink-3"> · {e.mode}</span> : null}
                  </p>
                </div>
                <span className="pill self-start whitespace-nowrap">{e.period}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-2">
                {e.bullets.map((b) => (
                  <li key={b} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />{b}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────
export function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Academic background">
      <div className="grid gap-5 md:grid-cols-2">
        {EDUCATION.map((e) => (
          <div key={e.credential} className="glass rounded-2xl p-6" data-reveal>
            {e.period && <span className="pill">{e.period}</span>}
            <h3 className="mt-4 text-lg font-bold leading-snug">{e.credential}</h3>
            <p className="mt-1 text-sm font-semibold text-primary-light">{e.institution}</p>
            {e.detail && <p className="mt-2 text-sm text-ink-2">{e.detail}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Résumé + CTA ──────────────────────────────────────────────────────────────
export function ResumeCta({ role }: { role: RoleConfig }) {
  return (
    <section id="resume" aria-labelledby="resume-title" className="scroll-mt-20 py-10">
      <div className="page-x">
        <div className="glass relative overflow-hidden rounded-3xl border-primary/30 p-8 sm:p-12" data-reveal>
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Résumé</p>
              <h2 id="resume-title" className="mt-3 text-2xl font-bold sm:text-3xl">{role.cta.title}</h2>
              <p className="mt-2 max-w-xl text-ink-2">{role.cta.body}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={PROFILE.resumeUrl} target="_blank" rel="noopener" className="btn-primary"><Download /> Download résumé (PDF)</a>
              <a href="#contact" className="btn-ghost"><Mail /> Get in touch</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
export function Contact({ role }: { role: RoleConfig }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!CONTACT_FORM_ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry (${role.label}) — ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
      window.location.href = `mailto:${PROFILE.links.email}?subject=${subject}&body=${body}`;
      return;
    }
    setState('sending');
    try {
      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, portfolio: role.label }),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  };

  const links = [
    { label: 'Email', value: PROFILE.links.email, href: `mailto:${PROFILE.links.email}`, icon: <Mail className="h-5 w-5" /> },
    { label: 'LinkedIn', value: 'linkedin.com/in/suhas-1710d', href: PROFILE.links.linkedin, icon: <Linkedin className="h-5 w-5" /> },
    { label: 'GitHub', value: 'github.com/Suhas5497', href: PROFILE.links.github, icon: <Github className="h-5 w-5" /> },
  ];
  const field = 'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-ink placeholder:text-ink-3 outline-none transition focus:border-primary-light/60 focus:ring-1 focus:ring-primary-light/40';

  return (
    <Section id="contact" eyebrow="Contact" title="Let’s work together" intro={role.cta.body}>
      <div className="grid gap-8 lg:grid-cols-2">
        <ul className="space-y-3" data-reveal>
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="glass card-hover flex items-center gap-4 rounded-xl p-4"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary-light">{l.icon}</span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-ink-3">{l.label}</span>
                  <span className="block text-sm text-ink">{l.value}</span>
                </span>
                {l.href.startsWith('http') && <External className="ml-auto h-4 w-4 text-ink-3" />}
              </a>
            </li>
          ))}
        </ul>
        <form onSubmit={submit} className="glass space-y-4 rounded-2xl p-6 sm:p-8" data-reveal aria-describedby="contact-note">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-2">Name</span>
              <input required autoComplete="name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-2">Email</span>
              <input required type="email" autoComplete="email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-2">Message</span>
            <textarea required rows={5} className={`${field} resize-y`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </label>
          <button type="submit" disabled={state === 'sending'} className="btn-primary w-full disabled:opacity-60">
            {state === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <p id="contact-note" className="text-xs text-ink-3" role="status">
            {state === 'sent' && 'Thanks — your message was sent.'}
            {state === 'error' && 'Sorry, that didn’t go through. Please email me directly.'}
            {state === 'idle' && (CONTACT_FORM_ENDPOINT ? 'Your message is sent to my inbox. See the privacy policy.' : 'This opens your email app with the message pre-filled — nothing is stored on this site.')}
          </p>
        </form>
      </div>
    </Section>
  );
}
