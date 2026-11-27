# fitaacreative.com standby on Cloudflare

Vercel stays the live host. This Worker (`fitaa-creative`) serves the same built site at its own workers.dev address, ready to take over if Vercel ever stops or starts charging (Nigel, 26 Nov 2026). It reads `middleware.ts` and `vercel.json` directly, so prices by country, rewrites and headers are the same on both hosts. `tests/cloudflare.test.mjs` holds them together.

## Set up once (nothing live changes)

1. Cloudflare, Workers & Pages, Create, Import a repository, `fitaa1/Fitaa3.0`.
2. Build command `npm ci && npm run build`. Deploy command `npx wrangler deploy --config cloudflare/wrangler.jsonc`. Root directory blank.
3. Build variable `UK_WHATSAPP` with the same value as in Vercel (Settings, Variables and Secrets, Build). It is read when the pages are built, so UK visitors get the UK number.
4. Deploy, then open the workers.dev address: the home page, /fully-booked and a demo should load with USD prices from outside Ghana and the UK.

From then on every merge to `main` builds on both Vercel and Cloudflare.

## Swapping fitaacreative.com to Cloudflare

The domain is registered at Namecheap, with its DNS on Namecheap's own servers pointed at Vercel. A Worker can take a domain only when Cloudflare holds its DNS, so the quick swap needs one step done ahead of time:

1. Ahead of time: Cloudflare, Add a domain, `fitaacreative.com`, copy every record Namecheap shows (keep the Vercel records and every email record exactly), then at Namecheap set Custom DNS to the two Cloudflare name servers. Vercel keeps serving the site.
2. On the day: Worker `fitaa-creative`, Settings, Domains & Routes, Add, Custom domain, `fitaacreative.com`, then the same for `www.fitaacreative.com`. Cloudflare replaces the Vercel records itself. The site moves within minutes.
3. To go back: remove the two custom domains and put the Vercel records back.

## Not on Cloudflare

Vercel Analytics counts only on Vercel. Google Analytics works on both.

## The second standby, Netlify

`netlify.toml` builds the same site on Netlify. Netlify has no country step, so every visitor there gets the default copy (USD prices, Ghana WhatsApp). Set up once: Netlify, Add new project, Import an existing project, GitHub, `fitaa1/Fitaa3.0`. The build settings come from `netlify.toml`. No settings are needed, because only the default copy is served there. To swap to Netlify while the DNS stays at Namecheap, point the `A` record for `@` at `75.2.60.5` and the `www` CNAME at the Netlify address. Namecheap caches records for up to 30 minutes, so the move takes up to half an hour.
