# 📡 New Repository Radar

A dashboard that surfaces newly created, fast-growing GitHub repositories: momentum charts, category breakdown and country filters.

**Live demo:** https://github-repository-tracking.vercel.app

## How it works

1. A scheduled GitHub Action ([`daily-analyze.yml`](.github/workflows/daily-analyze.yml)) runs `src/scripts/analyze-trends.ts` every 6 hours and once daily at 02:00 UTC.
2. The script queries the GitHub API and writes results as JSON into [`data/`](data) (daily report, history snapshots).
3. The React dashboard reads that data, so no backend server is needed.

## Features

- KPI cards, momentum chart and category distribution (Recharts)
- Category and country filters
- Repository cards with links back to GitHub
- Marketing landing page plus dashboard layout with sidebar

## Tech Stack

React · TypeScript · Vite · Tailwind CSS · shadcn/ui · Recharts · React Router · GitHub Actions · Vercel

## Getting Started

```bash
git clone https://github.com/alobit21/Github_repository_tracking-.git
cd Github_repository_tracking-
npm install
cp .env.example .env     # add a GitHub token for higher API rate limits
npm run dev              # http://localhost:5173
```

To run the analyzer locally:

```bash
GITHUB_TOKEN=ghp_xxx npx tsx src/scripts/analyze-trends.ts
```

> ⚠️ Anything prefixed `VITE_` is bundled into the browser build. Use a token with minimal scope, or leave it unset in production.

## Author

**Aloyce Mtavangu**: [Portfolio](https://mac.tarxemo.com) · [LinkedIn](https://www.linkedin.com/in/aloyce-mtavangu-5932652a0)
