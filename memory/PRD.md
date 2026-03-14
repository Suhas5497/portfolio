# Suhas Dhamapurkar Portfolio - PRD

## Original Problem Statement
Improve existing personal data analyst portfolio website for Suhas Dhamapurkar with:
- Fix header branding (show Suhas Dhamapurkar, not Resilytics)
- Connect project image banners from /public/assets/
- Fix interactive demo buttons with Streamlit URLs
- Improve project card design with hover animations
- Add interactive Recharts visualizations
- Present Resilytics as Featured Platform project
- Resume download functionality
- Deployment preparation for GitHub Pages

## User Personas
- **Recruiters/Hiring Managers**: Looking for data analyst candidates
- **Potential Clients**: Seeking data analytics consulting
- **Technical Peers**: Other data professionals reviewing work

## Core Requirements (Static)
1. Professional light-themed portfolio design
2. Working navigation with smooth scroll
3. Project cards with images, descriptions, tech tags, demo links
4. Interactive charts (Revenue Forecast, Churn Drivers, Skill Radar)
5. Resume download functionality
6. Contact form with email integration
7. Mobile responsive design
8. GitHub Pages deployment ready

## What's Been Implemented (Jan 2026)
- [x] Complete UI redesign: Dark to light professional theme
- [x] Header fixed: Shows "Suhas Dhamapurkar | Data Analyst | Analytics Engineer" with SD logo
- [x] Navigation menu: About, Platform, Projects, Visuals, Skills, GitHub, Contact
- [x] Project image banners connected from /public/assets/
- [x] Demo URLs configured (Customer Churn, Retail Sales)
- [x] Interactive demo functionality: iframe modal + new tab option
- [x] Project cards with hover lift animation and glow effect
- [x] Recharts visualizations: Line, Bar, Radar, Area charts
- [x] Resilytics presented as "Featured Analytics Platform"
- [x] Architecture diagram for platform section
- [x] Resume download button linked to /resume.pdf
- [x] Skills section with animated progress bars
- [x] Contact form opens email client with pre-filled content
- [x] Mobile responsive with hamburger menu
- [x] README with deployment instructions

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- Recharts (visualizations)
- Plus Jakarta Sans font

## Prioritized Backlog

### P0 (Critical) - None remaining
All critical features implemented

### P1 (High Priority)
- [ ] Add actual Streamlit demo deployments (currently configured but demos need hosting)
- [ ] SEO optimization (meta tags, Open Graph)
- [ ] Add Google Analytics

### P2 (Medium Priority)
- [ ] Add blog section for data analytics articles
- [ ] Implement dark mode toggle
- [ ] Add testimonials section
- [ ] PDF resume generation from portfolio data

### P3 (Nice to Have)
- [ ] Add loading animations/skeleton screens
- [ ] Implement i18n for multiple languages
- [ ] Add case study deep-dive pages

## Next Tasks
1. Deploy Streamlit apps and update DEMO_URLS
2. Configure custom domain (resilytics.in)
3. Add Google Analytics tracking
4. SEO optimization
