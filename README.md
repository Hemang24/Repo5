# DecideAI — Weighted Decision Matrix

An AI-powered decision analysis tool that helps you make confident, data-driven choices through a structured 6-step process.

## Features

- **AI-Generated Analysis**: Input any decision and get a tailored set of evaluation criteria and options
- **Weighted Criteria**: Adjust the importance (0–10) of each criterion to match your priorities
- **Multi-Option Scoring**: Rate each option across every criterion with live weighted scores
- **Devil's Advocate**: AI argues *against* your leading choice — react to each argument to reveal blind spots
- **Personalized Follow-Up**: Questions generated based on your weights, scores, and devil's advocate reactions
- **Decision Report**: Radar chart, bar chart, score breakdown table, and a fully personalized written synthesis

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Set your Anthropic API key:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your ANTHROPIC_API_KEY
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (radar + bar charts)
- **Claude API** (claude-sonnet-4-6) via Anthropic SDK
- **Framer Motion** (animations)
- **Lucide React** (icons)

## How It Works

1. **Frame Your Decision** — Describe what you're deciding
2. **What Matters** — AI generates relevant criteria; you set weights
3. **Rate Options** — Score each AI-suggested option on every criterion
4. **Devil's Advocate** — AI challenges your leading choice with 4 strong counter-arguments
5. **Go Deeper** — Answer personalized follow-up questions
6. **Your Report** — Get a full analysis with charts and personalized written synthesis
