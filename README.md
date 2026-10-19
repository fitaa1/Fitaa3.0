# Fitaa Creative: Agency Website

Single-page site for Fitaa Creative, a creative and digital marketing agency in Accra, Ghana.

**Live:** https://fitaacreative.vercel.app

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
| `public/fully-booked/index.html` | **Fully Booked offer page** (`/fully-booked`): one self-contained file (styles, script and logo inside). WhatsApp number and messages in `SETTINGS` at the bottom |
| `public/demo/ridge-house/index.html` | Demo short-let host page (`/demo/ridge-house`), one self-contained file |
| `public/demo/studio/index.html` | Demo beauty studio page (`/demo/studio`), one self-contained file; services, hours and number in `SETTINGS` |
| `src/components/` | One file per section: `Hero`, `Services`, `WhyUs`, `FeaturedWork`, `Testimonials`, `FinalCTA` (contact), `Navbar`, `Footer` |

Editing guide: see **CUSTOMIZE.md**.

## Standalone pages: export or copy for a client

The three pages under `public/` (Fully Booked and the two demos) need nothing else from this repo.

1. **Export:** open the file on GitHub, tap **Download raw file**, and drop it on [Netlify Drop](https://app.netlify.com/drop) or Cloudflare Pages, or open it in a browser.
2. **Client copy:** copy the demo folder (for example `public/demo/studio/` to `public/clients/<client-name>/`), change `SETTINGS` at the bottom of the file (WhatsApp number, name, services or prices), replace the `[bracketed]` text and photo placeholders, set `prefix` to `''` and delete the demo bar.
3. **Client hosting:** client sites go on Cloudflare Pages or Netlify (both free for commercial use). Vercel's free plan is for non-commercial use.

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
