# Customising Fitaa Digital

Everything you need to personalise this site is in two files:

1. **`src/config/site.ts`** — all text content, links, and data
2. **`src/index.css`** — colors, fonts, and spacing

---

## 1. Site Content (`src/config/site.ts`)

### Agency Name & Tagline
```ts
name: "Fitaa Digital",
tagline: "Pure. Strategic. Impactful.",
description: "Your short elevator pitch goes here...",
url: "https://yourdomain.com",
```

### Navigation
```ts
nav: [
  { label: "Home",     href: "#home"     },
  { label: "Services", href: "#services" },
  // add or remove items here
],
```

### Services (up to 6 recommended)
```ts
services: [
  {
    title: "Your Service Title",
    description: "One or two sentences describing what you do.",
    icon: Monitor, // any Lucide icon
  },
],
```

Available icons to import from `lucide-react`: `Monitor`, `Palette`, `Globe`, `BarChart2`, `Target`, `Zap`, `Megaphone`, `Activity`, `Camera`, `Code`, `Layout`, etc.

### Stats
```ts
stats: [
  { value: 50,  suffix: "+", label: "Brands Elevated" },
  { prefix: "$", value: 2.4, suffix: "M", label: "Revenue Generated" },
],
```

### Case Studies
```ts
caseStudies: [
  {
    client: "Client Name",
    industry: "Industry",
    result: "Key Result",
    description: "One sentence summary.",
    link: "https://...",
    bg: "from-[#9B122C]/30 via-[#9B122C]/10 to-transparent", // overlay gradient
    imagePath: "https://...", // use a real image URL or put image in /public
  },
],
```

**To use a local image:** put the file in `/public/` (e.g. `/public/work/tinkertresses.jpg`) and set `imagePath: "/work/tinkertresses.jpg"`.

### Testimonials
```ts
testimonials: [
  {
    quote: "The testimonial text...",
    author: "Full Name",
    title: "Job Title",
    company: "Company Name",
  },
],
```

### Contact
```ts
contact: {
  email:       "hello@yourdomain.com",
  address:     "Your City, Country",
  phone:       "+1 000 000 0000",
  formspreeId: "YOUR_FORM_ID", // from formspree.io — leave empty to disable
},
```

### Social Links
```ts
social: {
  behance:   "https://www.behance.net/yourhandle",
  instagram: "https://www.instagram.com/yourhandle",
},
```

---

## 2. Colors & Fonts (`src/index.css`)

### Brand Colors

Change the HSL values to match your brand:

```css
:root {
  /* Light mode */
  --ruby: 349 79% 34%;   /* Primary accent — default Ruby Red #9B122C */
  --gold: 46 65% 42%;    /* Secondary accent — default Royal Gold #D4AF37 */
}
.dark {
  --gold: 46 65% 52%;    /* Gold is slightly brighter in dark mode */
}
```

**HSL converter:** [hslpicker.com](https://hslpicker.com) or use VS Code's color picker.

### Background & Text Colors

```css
:root {
  --background: 27 46% 97%;  /* Light mode page background */
  --foreground: 214 60% 9%;  /* Light mode text */
  --card: 0 0% 100%;         /* Light mode card background */
}
.dark {
  --background: 214 60% 7%;  /* Dark mode page background */
  --foreground: 27 46% 97%;  /* Dark mode text */
  --card: 219 14% 12%;       /* Dark mode card background */
}
```

### Fonts

The project uses:
- **Playfair Display** (headings) — loaded from Google Fonts
- **Satoshi** (body) — loaded from Fontshare

To change fonts, update the `@import` at the top of `src/index.css` and the `--app-font-*` variables:

```css
--app-font-sans:  'Your Body Font', sans-serif;
--app-font-serif: 'Your Heading Font', serif;
```

---

## 3. Logo

The logo is at `/public/logo.png`. Replace it with your own file — same filename, same folder.

It's used in:
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `index.html` (favicon)

---

## 4. SEO (`index.html`)

Update the meta tags at the top of `index.html`:

```html
<title>Your Agency — Your Tagline</title>
<meta name="description" content="Your description..." />
<meta property="og:url" content="https://yourdomain.com/" />
<meta property="og:image" content="https://yourdomain.com/og-image.png" />
```

Place your Open Graph image (1200×630px recommended) at `/public/og-image.png`.

---

## 5. Analytics (Optional)

Add your analytics snippet before `</head>` in `index.html`. No extra packages needed.

**Google Analytics:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Meta Pixel:**
```html
<!-- Meta Pixel Code -->
<script>!function(f,b,e,...){...}(window,document,'script')</script>
```

---

## 6. Contact Form

See [README.md](./README.md#contact-form-setup) for Formspree setup instructions.
