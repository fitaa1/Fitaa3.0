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

- **Pushing:** push a new branch with `git push -u origin <branch>` the first time. Without `-u` the local tracking ref is missing and the session's stop hook reports "unpushed commits, no remote branch" even though the branch is on GitHub. Before acting on that warning, check with `git ls-remote origin <branch>`. The hook lives in the Claude workspace, not in this repo.
- **Opening a pull request:** GitHub's GraphQL API is blocked in Claude's workspace, so `gh pr create` fails with 403. Use the REST route: write `{"title","head","base","body"}` to a file and run `gh api repos/fitaa1/<repo>/pulls --input pr.json`.
- **Host environment variables:** a variable reaches the site only from the next deploy. Add variables first, then trigger a deploy. On Netlify, a variable marked secret cannot use "same value for all contexts": the same value must be typed into each deploy context. Names only in docs and chats, never values.
- **Redirect hosts:** check every host name against the real project list (Netlify: `fitaaglobal`, `fitaahomes`; Vercel: `fitaadigital` serves fitaacreative.com) before writing a redirect. A redirect once pointed at `fitaa-homes.netlify.app`, which does not exist.
- **Test scripts:** `node --test tests/` treats the folder as a file on Node 22 and fails. Use a glob such as `tests/*.test.mjs`.
- **Fail safe, never fail free:** when data cannot be read (a calendar, saved dates, a form service), the page must say so and send the visitor to WhatsApp. It must never show free dates, a green "live" tick or a success message it cannot back up.
- **Claude's workspace network:** homes.fitaaglobal.com and some other hosts are blocked from the workspace. Check a deploy address (`<deploy-id>--<project>.netlify.app`) instead, say so in the report, and use a web fetch to confirm the live domain loads.
- **Google Docs edits:** an `insertText` needs a `location` or `endOfSegmentLocation`. Read the doc back after every edit before calling it done.
- **Claims:** a "done", "live" or "verified" line in a PR, doc or the Daily Log needs a real check behind it (status code, screenshot, test run). Otherwise write UNVERIFIED and why.
- **Contact form (Creative):** it used to show "Message Received" when no Formspree ID was set, which would silently drop every lead. It now shows the error state with the email address. Keep it that way.
- **Fonts:** Google Fonts load without blocking the first paint (`index.html`). Do not turn the stylesheet back into a plain blocking link: it cost about 1.5 s of first paint on mobile.
- **Second GA destination:** every event on this site also reaches a second GA4 property, `G-G4NQ36GKW4`. It is not in the code, so it comes from the Google tag settings in Google Analytics (Admin, Data streams, Configure tag settings, Manage Google tag). Nigel decides whether to keep it.
