# Suhas Dhamapurkar — Portfolio

An interactive portfolio with three experiences: **Data Analyst**, **AI/ML Engineer** and **Hybrid Data + AI**.
A cinematic landing page with a 3D portrait lets visitors choose a path; each path has its own theme, live
3D scene, interactive demo, projects, experience, education, résumé and contact.

**Stack:** React 18 · Vite · TypeScript · Tailwind CSS · React Three Fiber · Three.js · Drei · GSAP + ScrollTrigger · React Router

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing — portrait, three portfolio cards, 2-second dwell previews |
| `/data-analyst` | Data Analyst portfolio (blue/cyan, data globe, findings explorer) |
| `/ai-ml-engineer` | AI/ML Engineer portfolio (violet/indigo, neural network, live training demo) |
| `/hybrid` | Hybrid Data + AI portfolio (cyan/violet/emerald, intelligence core, pipeline graph, risk simulator) |
| `/<role>/projects/:id` | Project case study (problem, dataset, architecture, methodology, tools, results, evaluation, limitations, business implications) |
| `/privacy`, `/terms`, `/disclaimer` | Legal pages |
| `*` | 404 |

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # TypeScript only
```

### Environment variables

Copy `.env.example` to `.env.local` if you need overrides. Every `VITE_*` value is bundled into the
public site — **never put secrets in them**.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Canonical URL for canonical/OG tags (e.g. `https://suhas.vercel.app`). |
| `VITE_CONTACT_FORM_ENDPOINT` | Optional form endpoint (e.g. Formspree). Empty → the contact form opens the visitor's email app. |

## Editing content

All content lives in typed data files — no component changes needed.

| File | What it holds |
| --- | --- |
| `src/config/profile.ts` | Name, links, portrait, experience, education, achievements |
| `src/config/roles.ts` | Per-experience headline, theme palette, skills, project order, about text |
| `src/data/projects.ts` | Every project and its case-study content |

### Honesty rules for projects

Each project has a `status`:

- **`completed`** — results come only from the résumé / existing published work. Shown with a green *Completed* badge.
- **`proposed`** — planned scope only. `results` must stay empty; the page labels every section as *planned*
  and says no results are claimed.
- **`placeholder`** — reserved slot (currently the **SPA project**). Fill in the `spa-project` entry when details are confirmed.

To publish a proposed project, change its `status` to `completed` and fill `results`, `evaluation` and `links`
with real, verifiable information. Interactive demos (recommender, model training, risk simulator,
Ask Resilytics) run on clearly labelled synthetic or sample data.

### Portrait

- `public/assets/portrait-hero-*.webp` — background-removed, stylised cut-out used on the landing page (rendered as a 3D plane).
- `public/assets/portrait-480.*` — small portrait used on inner pages.

To use a new photo, replace these files keeping the same names and aspect ratios (or update `PROFILE.portrait` / `PROFILE.hero`).

## Project structure

```
src/
  App.tsx                 routes, lazy-loaded pages, scroll handling
  config/                 profile + per-role configuration
  data/projects.ts        project registry
  pages/                  Landing, RolePage, ProjectPage, LegalPage, NotFound
  components/
    layout/               header, footer
    sections/             About, Skills, Projects, Experience, Education, Résumé CTA, Contact
    demos/                interactive demos (each labelled with its data source)
    three/                React Three Fiber scenes (procedural — no external models/textures)
    ui/                   portrait, badges, icons, loader
  hooks/                  reduced motion, page metadata, GSAP scroll reveals
  lib/                    WebGL detection, seeded RNG
```

## Accessibility & performance

- Keyboard: cards are links (Tab / Arrow keys / Home / End, Enter to open); skip links on every page.
- Touch: first tap previews a card, second tap opens it.
- `prefers-reduced-motion`: springs/animations are disabled; 3D scenes render a still frame.
- No WebGL or a 3D crash → static gradient fallbacks; the landing portrait falls back to a normal image.
- Three.js is code-split and lazy-loaded; 3D rendering pauses when off-screen; DPR is capped.
- Images are WebP and lazy-loaded below the fold. No audio; the product video loads only on click.

## Deploying to Vercel

The repo includes `vercel.json` (Vite framework preset, `dist/` output, SPA rewrites, security headers).

1. Import the repository in Vercel (or push to the connected repo).
2. **Project Settings → Build & Development:** Framework *Vite*, build `npm run build`, output `dist`
   (`vercel.json` sets these; if the project was previously configured for Next.js, make sure no old override remains).
3. Optionally add `VITE_SITE_URL` / `VITE_CONTACT_FORM_ENDPOINT` under *Environment Variables*.
4. Deploy. Deep links such as `/hybrid/projects/resilytics` work thanks to the SPA rewrite.

## License

Code: MIT (see `LICENSE`). Personal content, portrait and project write-ups © Suhas Dhamapurkar. All rights reserved.
