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
