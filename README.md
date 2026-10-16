# Fitaa Digital: Agency Website

Single-page site for Fitaa Digital (formerly Fitaa Creative), a creative and digital marketing agency in Accra, Ghana.

**Live:** https://fitaadigital.vercel.app

## Stack

| Tool | Role |
|---|---|
| React 18 + TypeScript | UI |
| Vite 6 | Build and dev server |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| React Hook Form + Zod | Enquiry form (loaded only when needed) |
| Formspree | Delivers enquiry form messages |
| Lucide | Icons |
| Vercel | Hosting; every branch gets a preview link |

## Where things are

| File | What it controls |
|---|---|
| `src/config/site.ts` | **All words, links, images and lists on the page** |
| `src/index.css` | Colours (light and dark), fonts, spacing, effects |
| `index.html` | SEO title and description, link previews, Google business data, favicon, splash screen |
| `public/work/` | Case study images (4:3 WebP) |
| `public/sitemap.xml`, `public/robots.txt` | Search engine files |
| `src/pages/Legal.tsx` | Privacy Policy and Terms text (`/privacy`, `/terms`) |
| `src/components/` | One file per section: `Hero`, `Services`, `WhyUs`, `FeaturedWork`, `Testimonials`, `FinalCTA` (contact), `Navbar`, `Footer` |

Editing guide: see **CUSTOMIZE.md**.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5000
npm run build      # production build in dist/
```

## Deploy

Push a branch to GitHub and Vercel builds a preview automatically. Merging into `main` updates the live site. Work happens on branches with a pull request; nothing is pushed straight to `main`.

## Built-in behaviour worth knowing

- **Theme** follows the visitor's device (light or dark) until they tap the toggle; their choice is then remembered.
- **Splash** shows the logo for 1 second on the first visit of a session, and is skipped for visitors with reduced motion turned on.
- **Menu highlight** follows the section on screen.
- **Speed:** the enquiry form and legal pages load separately, so the first load stays small.
