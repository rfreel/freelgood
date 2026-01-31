# Agent Runbook: Build the Soot-and-Sepia Manual Site (Astro)

## Prime directive
Do not invent design tokens or colors. No hex codes outside `src/styles/tokens.css`. Build must remain static.

## Setup
```bash
npm create astro@latest making-manual -- --template minimal
cd making-manual
npm install
npm install zod gray-matter markdown-it
npm install -D prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

Implement in this order (do not skip)
	1.	Create file tree per spec and commit.
	2.	Add src/styles/tokens.css + src/styles/globals.css and wire them in BaseLayout.astro.
	3.	Add early theme + reader apply scripts in <head> (no flash).
	4.	Implement src/lib/schema.ts + src/lib/content.ts with hard validation (throw on errors).
	5.	Build pages:
	•	src/pages/index.astro
	•	src/pages/chapters/index.astro
	•	src/pages/chapters/[slug].astro (with ToC + prev/next)
	6.	Implement ToC generation from headings.
	7.	Implement search index build script writing public/search-index.json.
	8.	Implement CommandK.astro and bind ⌘K.
	9.	Add sample chapters and verify build output.

Required commands
	•	Dev: npm run dev
	•	Build: npm run build
	•	Preview: npm run preview
	•	Lint: npm run lint
	•	Format: npm run format

Done criteria (must pass)
	•	npm run build succeeds from clean clone.
	•	Theme toggle cycles system/light/dark and persists; no flash on load.
	•	Reader mode persists and forces single-column reading.
	•	/chapters renders from _chapters.yml.
	•	/chapters/[slug] renders markdown with a working ToC and prev/next.
	•	⌘K search finds a heading term and navigates to the chapter.
	•	With OS reduced motion enabled, there are no auto-looping animations.

## Acceptance test + follow-ups
**Acceptance test:** A fresh clone can run `npm install && npm run build && npm run preview`, then visually confirm: soot/sepia light and dark themes, reader mode, chapters index, chapter pages with ToC and prev/next, and ⌘K search backed by `public/search-index.json`.

**Follow-ups (next action):** If you want, I’ll output the exact contents for the key starter files (`BaseLayout.astro`, `ChapterLayout.astro`, `content.ts`, `schema.ts`, search build script) so an agent can paste them without improvisation.  
**Follow-ups (edge case):** If you want chapter figures with replay controls, I’ll specify a strict `<Figure>` component API and the lint rule that blocks missing caption/alt.  
**Follow-ups (failure mode):** If agents implement theme toggling without the inline head script, you’ll get a light-to-dark flash; treat it as a hard regression and block merges.

STOP
