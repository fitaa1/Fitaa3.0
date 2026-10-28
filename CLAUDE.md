# Fitaa Creative (fitaacreative.com)

The agency site for Fitaa Creative, Accra. React + Vite single-page site, hosted on Vercel (project name `fitaadigital`, which serves fitaacreative.com; www and fitaacreative.vercel.app 301 to it). Standalone pages live as plain HTML in `public/`: `/fully-booked`, `/demo/ridge-house`, `/demo/studio`. Privacy, terms and the 404 are written at build time by `scripts/static-pages.mjs`.

Git workflow: branch + pull request for every change, never push to `main`. Nigel approves every merge.

## Run, check, deploy, roll back

- `npm ci`, then `npm run typecheck` and `npm run build` before every push. There are no unit tests yet.
- Look at changed pages at 390, 820 and 1440 px (Playwright or a headless browser). `vite preview` does not apply `vercel.json` rewrites, so open `/fully-booked/index.html` locally, not `/fully-booked`.
- Deploy: merging to `main` deploys to production on Vercel. Each pull request gets a Vercel preview.
- Roll back in under two minutes: Vercel, project `fitaadigital`, Deployments, pick the last good production deploy, menu, **Instant Rollback** (or Promote to Production).

## Where things live

- Every word, number, link and contact detail: `src/config/site.ts`. Do not scatter contact details elsewhere.
- Analytics: `public/fitaa-analytics.js` (GA4 `G-D62TL0T2VD`, events whatsapp_click, booking_request, call_click, email_click, demo_open, niche_switch, outbound_click, enquiry_submit). It only switches on for the live hosts listed in the file.
- Contact form: Formspree (`formspreeId` in `site.ts`). Messages arrive in Gmail from formspree.io, usually in the Updates tab.
- Headers and redirects: `vercel.json`.

## Content rules

British spelling, plain English, no em dashes in copy (the "—CREATIVE—" wordmark is part of the logo lockup and stays). Do not invent prices, numbers, awards or guarantees; every figure on the site needs a source Nigel has confirmed.

## Known issues and guards

Found in the 22 Oct 2026 audit. Each line is a mistake that happened once, and the guard that stops it repeating.

- **Pushing and the stop hook:** Claude's clones are single-branch (`git clone --depth 1`), so Git only tracks `main` and `git push -u` cannot record a new branch. The session's stop hook then reports "unpushed commits, no remote branch" even though the branch is on GitHub. Before acting on it, check with `git ls-remote origin <branch>`. Fix once per clone: `git config --add remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'`, then `git fetch --depth=1 origin <branch>` and `git branch --set-upstream-to=origin/<branch>`. The hook lives in the Claude workspace, not in this repo.
- **Opening a pull request:** GitHub's GraphQL API is blocked in Claude's workspace, so `gh pr create` fails with 403. Use the REST route: write `{"title","head","base","body"}` to a file and run `gh api repos/fitaa1/<repo>/pulls --input pr.json`.
- **Host environment variables:** a variable reaches the site only from the next deploy. Add variables first, then trigger a deploy. On Netlify, a variable marked secret cannot use "same value for all contexts": the same value must be typed into each deploy context. Names only in docs and chats, never values.
- **Redirect hosts:** check every host name against the real project list (Netlify: `fitaaglobal`, `fitaahomes`; Vercel: `fitaadigital` serves fitaacreative.com) before writing a redirect. A redirect once pointed at `fitaa-homes.netlify.app`, which does not exist.
- **Test scripts:** `node --test tests/` treats the folder as a file on Node 22 and fails. Use a glob such as `tests/*.test.mjs`.
- **Fail safe, never fail free:** when data cannot be read (a calendar, saved dates, a form service), the page must say so and send the visitor to WhatsApp. It must never show free dates, a green "live" tick or a success message it cannot back up.
- **Claude's workspace network:** homes.fitaaglobal.com and some other hosts are blocked from the workspace. Check a deploy address (`<deploy-id>--<project>.netlify.app`) instead, say so in the report, and use a web fetch to confirm the live domain loads.
- **Google Docs edits:** an `insertText` needs a `location` or `endOfSegmentLocation`. Read the doc back after every edit before calling it done.
- **Claims:** a "done", "live" or "verified" line in a PR, doc or the Daily Log needs a real check behind it (status code, screenshot, test run). Otherwise write UNVERIFIED and why.
- **Contact form (Creative):** it used to show "Message Received" when no Formspree ID was set, which would silently drop every lead. It now shows the error state with the email address. Keep it that way.
- **Fonts and analytics:** Google Fonts load without blocking the first paint on every page (`index.html` and each page in `public/`). Google Analytics loads on the visitor's first tap, scroll or key press, or after 4 seconds (`public/fitaa-analytics.js`, Nigel's choice: skimmers under 4 s aren't counted, Vercel Analytics still counts them). Never turn either back into an early or blocking load: the fonts cost about 1 s of first paint, and GA locks a slow phone for about 0.8 s.
- **Splash:** one 0.5 s pulse of the logo on the first visit of a session, then the logo opens into the page (`index.html`). Nigel chose 0.5 s. It starts when the logo has loaded, and only first visits download `logo-224.webp`.
- **Preview photos:** every photo on a lead preview lives in `public/preview/<page>-img/` as WebP, at most 1200 px on the long side. Never hotlink Airbnb, Booking.com or Trip.com images: their links change and the preview breaks.
- **Questions on /fully-booked:** the FAQPage data in the page head is built from the visible questions. Change both together, or Google and AI answers quote the old wording.
- **Portfolio images:** each needs `name.webp` (1440 px), `name-1080.webp` and `name-720.webp` in `public/work/`, so phones never download the large file.
- **Second GA destination:** every event on this site also reaches a second GA4 property, `G-G4NQ36GKW4`. It is not in the code, so it comes from the Google tag settings in Google Analytics (Admin, Data streams, Configure tag settings, Manage Google tag). Nigel decides whether to keep it.
