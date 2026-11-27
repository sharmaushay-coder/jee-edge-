# JEE Edge — JEE Main CBT Practice

A local-first JEE Main practice platform built from the three Quizrr Ranker's Package PDFs
(Physics, Chemistry, Mathematics). No login, no server, no subscription. Everything is stored
in your browser, and the question content is rendered straight from the original PDFs so every
formula, unit and diagram stays exactly as printed.

| Subject | Sets | Questions | Chapters |
|---|---:|---:|---:|
| Physics | 12 | 790 | 30 |
| Chemistry | 12 | 775 | 26 |
| Mathematics | 12 | 775 | 28 |
| **Total** | **36** | **2,340** | **84** |

## Quick start

Requirements: [Bun](https://bun.sh) (recommended) or Node.js 18+ with npm.

```bash
cd jee-edge
bun install
bun run dev
```

Open the printed URL (default `http://127.0.0.1:5173`). On first load the question bank is
seeded into IndexedDB; the three PDFs load lazily when a question is displayed.

Production build:

```bash
bun run build
bun run preview
```

## Features

- **Dashboard** — real attempts, accuracy, streak, subject progress, weak chapters, recent mocks.
- **Subject → Chapter → Question** navigation, with per-chapter counts, attempted, accuracy and completion.
- **Set-wise practice** — all 36 original sets, preserving set and question numbers.
- **Practice modes** — chapter, subject, set, random, unattempted, incorrect, bookmarked, custom chapters.
- **Question engine** — PDF page crops (formulas/diagrams intact), single-correct and numerical answers,
  check/reveal, bookmark, personal notes, mark for review, question palette, per-question timer.
- **CBT mock tests** — configurable duration, question count, subjects/chapters, marking scheme,
  countdown with auto-submit, palette, Save & Next, Mark for Review, Clear Response, submit confirmation.
- **Results** — score, accuracy, subject/chapter breakdown, time, question-by-question review with correct answers.
- **Analytics** — 30-day trend, subject accuracy, every chapter, weakest/strongest, repeatedly incorrect.
- **Revision** — incorrect, bookmarked, notes, unattempted, filtered by subject.
- **Search** — full-bank text search with subject/chapter/set/status/type/bookmark filters.
- **PDF viewer** — open the exact original page from any question.
- **AI Assistant tab** — add a Google Gemini and/or ChatGPT (OpenAI) key, then generate a full solution, a hint, a wrong-option analysis or a similar question. Each question also has an **Ask AI** chat for free-form doubts, with conversation context.
- **Local data** — export/import JSON backup, clear data with confirmation, PWA installable.

## How the question bank was built

The source PDFs render mathematics as vector/Type-3 glyphs without Unicode mappings. A text-only
extraction loses every formula and most option values, so the app does **not** re-type questions.
Instead, `scripts/extract.ts`:

1. Reads text positions with pdf.js and detects every question number (bold, left margin).
2. Records the exact page regions (`page`, `top`, `bottom`, `x0`, `x1`) each question occupies,
   including pages where a question spills over.
3. Extracts searchable text, option labels, the answer key (parsed from the printed key pages),
   and the question type (`single` / `numerical`).
4. Maps each question to a chapter from its own set's syllabus using keyword evidence plus the
   PDF's question ordering (monotonic block segmentation), with a confidence flag.
5. Writes `src/data/questions.json`, `src/data/bank.json` and `docs/extraction-report.md`.

The browser renders those regions with pdf.js (`public/vendor`), so the displayed question is the
original printed question. The extracted text powers search and analytics.

### Re-running extraction (optional)

`pdfjs-dist` is only needed for extraction, not for the app, and is intentionally not a runtime
dependency. If you change the PDFs:

```bash
bun add -d pdfjs-dist@4.8.69
bun run extract
bun run validate
```

Then copy the PDFs to `public/pdfs/` using the names `physics-qrps.pdf`, `chemistry-qrps.pdf`,
`mathematics-qrps.pdf`.

## Verification

```bash
bun run validate     # structural checks: 2,340 questions, 36 sets, answers, segments, chapter coverage
bun run test         # Vitest: scoring, numerical tolerance, mock evaluation, bank integrity
bun run build        # TypeScript + production build
```

See `docs/extraction-report.md`, `docs/validation-report.json` and `docs/TEST-REPORT.md`.

## AI Assistant (Gemini or ChatGPT)

Open the **AI Assistant** tab (or Settings → AI provider & keys). Choose **Google Gemini** or
**ChatGPT (OpenAI)**, paste the key(s), save, and press **Test connection**. Gemini supports a
primary and a backup key; the backup is used automatically on quota, rate-limit, server or network
errors. If the selected provider has no usable key, the other configured provider is tried.

Two ways to use it:

- **Any question:** in a practice session, press the ✨ button → **Full solution**, **Hint only**,
  **Why others are wrong**, **Similar question**, or type your own doubt in the chat box.
- **General doubts:** the AI Assistant tab has a free-form chat for concepts, formulas and reactions.

Keys are kept in this browser's `localStorage` and sent directly to the provider. There is no server,
so keys are not protected from someone with access to this browser profile; use a restricted key and
never commit it. The entire app (practice, mocks, analytics) works with no key and no internet.

## Project structure

```
jee-edge/
├─ public/
│  ├─ pdfs/                  original Physics/Chemistry/Mathematics PDFs
│  └─ vendor/                pdf.js browser build (offline)
├─ scripts/
│  ├─ extract.ts             PDF → question bank pipeline
│  ├─ validate.ts            structural validation
│  ├─ lexicon.ts             chapter taxonomy + keyword lexicon
│  └─ make-icons.ts          PWA icon generator
├─ src/
│  ├─ components/            QuestionPlayer, AiPanel, UI primitives
│  ├─ lib/                   bank, IndexedDB (Dexie), scoring, PDF rendering, Gemini
│  ├─ pages/                 Dashboard, Practice, Session, Mock, Analytics, Revision, Search, Settings
│  └─ data/                  generated questions.json, bank.json, extraction report
└─ docs/                     extraction + test reports
```

## Data & privacy

All progress lives in IndexedDB in this browser. Export a JSON backup before clearing browser data
or switching devices. The app never requires an account.

## PWA / offline

The app shell is precached. The PDFs are cached on first use by the service worker (runtime cache),
so a subject becomes fully available offline after its PDF has been opened once. Use
**Install app** in Chrome/Edge (or “Add to Home screen” on Android).

## Known limitations

- Chapter labels are **inferred** from each set's syllabus and question order; 418 questions carry a
  low-confidence flag and are marked “needs review” in the question view. The source PDFs do not tag
  individual questions with a chapter.
- Topic/subtopic labels are not present in the source PDFs, so topic filters are not fabricated.
- The PDFs contain answer keys but no worked solutions; “explanation” is therefore either the
  printed answer or an optional AI explanation.
- Seven final questions of sets have their options on an overflow page; the crop can omit the
  trailing options for those. Their answers are still correct. See `docs/TEST-REPORT.md`.
- PDF rendering is on demand; the first question of each subject takes a moment while its PDF loads.
- The source material is © MathonGo/Quizrr. This build is for personal study; do not publish the
  PDFs or extracted questions publicly.

## Deploy to GitHub Pages (free HTTPS + installable offline PWA)

A ready workflow is included at `.github/workflows/deploy.yml`. Full instructions, including
installing on an Android tablet and testing offline, are in **[DEPLOY.md](DEPLOY.md)**.

Short version (run only when you want to publish):

```bash
cd "C:\Users\HP\OneDrive\Desktop\ayush yoyo\jee-edge"
git init
git add .
git commit -m "JEE Edge — local-first JEE Main CBT practice"
git branch -M main
git remote add origin https://github.com/<your-username>/jee-edge.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: GitHub Actions**. The workflow builds and deploys
to `https://<your-username>.github.io/jee-edge/`.

On the tablet: open that URL in Chrome → **Install app**, then open each subject once so its PDF
is cached. After that the app and all three question banks work offline.

Notes: each PDF is under GitHub's 100 MB file limit but the repository is ~120 MB. If GitHub
rejects the push, use Git LFS:

```bash
git lfs install
git lfs track "public/pdfs/*.pdf"
git add .gitattributes
git commit -m "Track source PDFs with Git LFS"
git push
```

`.env` is ignored; there are no required environment variables.
