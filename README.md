# Collab Deal OS

A responsive creator–brand collaboration website built with **HTML, CSS, vanilla JavaScript, JSON, Markdown, and a minimal Node.js server**. No React, Next.js, Vue, TypeScript, Flutter, or native mobile code.

## Run

```bash
npm start
```

Open `http://localhost:4173`.

The website works in **demo mode** immediately. External accounts are optional until you want live auth, AI explanations, or billing.

## Product architecture

- Browser: HTML + CSS + vanilla JS
- V1 data model: campaigns, opportunities, structured offers/revisions, creator/brand profiles, analyses, usage limits, subscriptions, notifications
- Pricing engine: deterministic formula using creator performance, deal scope, rights, and market context
- AI: server-side explanation only; numerical pricing is calculated before the model is called
- Billing: Razorpay subscription endpoint, server-side credentials
- Persistence: localStorage demo mode + Supabase/Postgres starter schema for production

## Environment

Copy `.env.example` to `.env` in a deployment environment or export variables through your host. This dependency-free server reads environment variables directly.

Private values such as OpenAI API keys, Razorpay secrets, webhook secrets, and Supabase service-role credentials must never be placed in browser JavaScript.

## V1 flows

### Creator
Role selection → login → onboarding → dashboard → opportunities → AI evaluation → accept/revise/reject → subscription.

### Brand
Role selection → login → campaign onboarding → brand dashboard → creator discovery/matching → structured offer → AI evaluation → revision/accept/reject.

## Notes

The supplied product presentation contained an older chat/negotiation concept. The newer technical blueprint says **no chat in V1**, so this build follows the newer written specification and uses structured offer revisions instead.
