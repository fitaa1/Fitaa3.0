# Fitaa Digital — Agency Website

**Pure. Strategic. Impactful.**

A premium, high-performance marketing agency landing page for [Fitaa Digital](https://fitaa.digital) — built in Accra, Ghana. LED billboard campaigns, graphic design, campaign landing pages, and full digital marketing.

---

## Tech Stack

| Technology | Role |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [TypeScript 5](https://www.typescriptlang.org) | Type safety |
| [Vite 6](https://vitejs.dev) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Radix UI](https://www.radix-ui.com) | Accessible UI primitives |
| [React Hook Form + Zod](https://react-hook-form.com) | Form validation |
| [Lucide React](https://lucide.dev) | Icons |
| [Formspree](https://formspree.io) | Contact form backend (optional) |

---

## Local Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd fitaa-digital

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser (or port 5000 on Replit).

---

## How to Customise

All site content is centralised in **`src/config/site.ts`**. No need to hunt through individual components. See `CUSTOMIZE.md` for a full guide.

### Colors & Fonts

Edit **`src/index.css`** — CSS variables in `:root` (light mode) and `.dark` (dark mode):

```css
:root {
  --ruby: 349 79% 34%;   /* #9B122C — Ruby Red */
  --gold: 46 65% 42%;    /* #D4AF37 — Royal Gold */
}
```

### Content Sections

| Section | Component | Config key in `site.ts` |
|---|---|---|
| Navigation | `Navbar.tsx` | `nav` |
| Hero | `Hero.tsx` | `tagline`, `description` |
| Services | `Services.tsx` | `services` |
| Case Studies | `FeaturedWork.tsx` | `caseStudies` |
| Stats | `WhyUs.tsx` | `stats` |
| Testimonials | `Testimonials.tsx` | `testimonials` |
| Contact | `FinalCTA.tsx` | `contact` |
| Social Links | `Footer.tsx` | `social` |

---

## Contact Form Setup

The form uses [Formspree](https://formspree.io) for zero-backend email delivery.

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy your **form ID** (e.g. `xrgvwkzb`)
3. Paste it into `src/config/site.ts`:

```ts
contact: {
  formspreeId: "xrgvwkzb",
}
```

> If `formspreeId` is left empty the form simulates success locally — useful for development.

---

## Deployment

### Vercel (Recommended)

Connect your GitHub repo in the [Vercel dashboard](https://vercel.com/new).

**Build settings** (Vercel auto-detects these from the project):
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

The included `vercel.json` handles SPA client-side routing automatically.

### Netlify / Cloudflare Pages / GitHub Pages

```bash
npm run build
```

Serve the `dist/` folder. Configure your host to redirect all routes to `index.html` for client-side routing.

### Replit

The dev server uses `host: "0.0.0.0"` and `allowedHosts: true` — these are **development-only** settings inside the `server` block and have zero effect on `vite build`. Vercel and all other production builds are unaffected.

---

## Theme

Dark mode is the default. Users toggle with the sun/moon button in the navbar. Preference is saved to `localStorage`.

---

## License

MIT — free to use, modify, and distribute.

---

*Built with care in Accra, Ghana*
