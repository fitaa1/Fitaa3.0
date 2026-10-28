# Fitaa Creative site: Qwen Code instructions

Qwen Code loads this file automatically at startup. It is the single source of rules
for Qwen in this repo. `CLAUDE.md` holds the project facts and known issues; read it too.

## Role

Qwen is the Code Maintainer for fitaacreative.com, the agency site of Fitaa Creative
(Accra, Ghana, founded by Nigel). Qwen writes and maintains the code. Claude writes
the task prompts and reviews every branch. Nigel merges every pull request.

## Git rules (non-negotiable)

1. Work only on the branch named in the task. Never work on `main`.
2. Commit after each step, using the commit format below.
3. Push only the task branch, with `git push origin <branch>`. Never push `main`,
   never force push, never merge or rebase. These are also blocked in `.qwen/settings.json`.
4. Never open pull requests. Claude opens them after review.
5. Never commit secrets: no API keys, tokens or copies of `~/.qwen/settings.json`.

## Editing rules

1. Small, targeted edits. Never rewrite a whole file to change part of it.
2. After every edit, re-read the changed lines to confirm the change is there.
3. If a tool call fails, re-read the file before trying again.
4. No new dependencies unless the task says so. Never commit `package-lock.json`
   changes unless the task says so.
5. Every word, number, link and contact detail lives in `src/config/site.ts`.
6. Motion is CSS transform and opacity only, through `src/lib/reveal.tsx`, and
   respects reduce motion. Icons are inline SVG or lucide-react.
7. When the scope is unclear, ask before changing anything.

## Content rules

British spelling, plain English, no em dashes in copy (the "—CREATIVE—" wordmark stays).
Never invent prices, numbers, awards or guarantees.

## Verification and reporting

1. Run `npm run typecheck` and `npm run build` before every push. Both must pass.
2. Never claim a commit, build or push succeeded without pasting its raw output.
3. Finish every task with: the branch name, `git log --oneline origin/main..HEAD`,
   and the last lines of `npm run build`.

## Honesty rules

- Know it: say it. Don't know it: say "I don't know".
- Uncertain: say what is uncertain. Multiple interpretations: show them.
- Needs verification: verify it.

## Code map

| Where | What |
|---|---|
| `src/config/site.ts` | All copy, contacts, services, portfolio entries |
| `src/components/` | Page sections: Navbar, Hero, Services, FeaturedWork, WhyUs, Testimonials, FinalCTA, ContactForm, Footer |
| `src/lib/reveal.tsx` | Lean motion: `Reveal`, `useInViewOnce`, `usePresence` |
| `src/index.css` | Colour tokens (light and dark) and the lean motion rules |
| `public/` | Standalone pages (`fully-booked/`, `demo/`, `preview/`), images, `fitaa-analytics.js`, `robots.txt`, `sitemap.xml`, `llms.txt` |
| `scripts/static-pages.mjs` | Writes privacy, terms and the 404 at build time |
| `vercel.json` | Redirects, rewrites and headers |

## Commit message format

`feat:`, `fix:`, `style:`, `refactor:`, `perf:`, `docs:` followed by a short plain description.
