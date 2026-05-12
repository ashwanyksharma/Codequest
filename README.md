# CodeQuest

CodeQuest is a gamified DSA practice platform built with React, TypeScript, and Supabase. It turns problem solving into a progression system with worlds, XP, badges, streaks, interview simulations, and weekly performance reports.

**Live site:** [codequest-rust.vercel.app](https://codequest-rust.vercel.app/)

## Why CodeQuest

Most coding practice tools feel like lists of questions. CodeQuest is designed to feel more like a journey:

- Progress through **7 structured worlds** with **28+ problems**
- Earn **XP**, maintain streaks, and unlock new content
- Practice in **JavaScript, C++, and Python**
- Review detailed test results, notes, and progress history
- See your rank on the **leaderboard**
- Run a focused **interview simulation**
- Get a **weekly report** powered by Supabase data

## Features

- **Gamified learning flow** with worlds, levels, unlock logic, and progress tracking
- **Problem workspace** with starter code, hints, editorials, visible test cases, and per-problem notes
- **Multi-language editor** for JavaScript, C++, and Python templates
- **Submission tracking** with pass/fail results, XP rewards, and attempt history
- **Profile system** with badges, level progression, solved count, and streaks
- **Leaderboard** ranked by XP
- **Interview mode** for timed practice across core topics
- **Weekly analytics** for recent performance and learning trends
- **Supabase auth + database** with row-level security

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend/Data:** Supabase Auth, Postgres, Edge Functions
- **UI:** Lucide React
- **Deployment:** Vercel

## Project Structure

```text
src/
  components/     Reusable UI pieces
  contexts/       Auth and navigation state
  lib/            Supabase, execution logic, interview logic, data helpers
  pages/          App screens
supabase/
  migrations/     Database schema and seed SQL
  functions/      Edge function for weekly reporting
backend/
  package.json    Additional backend package metadata
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start the app

```bash
npm run dev
```

### 4. Production build

```bash
npm run build
```

## Supabase

The project includes Supabase migrations for:

- core schema
- seeded learning content
- profile creation on signup
- language support updates

If you are setting up a fresh Supabase project, apply the SQL files from [supabase/migrations](/home/ashwany/Downloads/Code-quest-bolt/Code-Quest/supabase/migrations:1).

## Deployment

CodeQuest is configured for Vercel with [vercel.json](/home/ashwany/Downloads/Code-quest-bolt/Code-Quest/vercel.json:1).

For a successful deploy, make sure Vercel has:

- the correct project root
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

## Screens Included

- Landing page
- Dashboard
- World details
- Problem solving view
- Leaderboard
- Interview page
- Profile page
- Weekly report

## License

This project is for learning, experimentation, and portfolio use.
