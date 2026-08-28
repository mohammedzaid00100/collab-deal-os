# Project Status

## Implemented
- Responsive landing page with creator/brand role selection
- Login and signup demo flow
- Creator onboarding with live preview
- Creator dashboard
- Opportunity discovery and match-score filtering
- Structured offers page
- AI Deal Advisor input + deterministic pricing engine + server-side OpenAI explanation hook
- Creator profile, subscription, settings
- Brand onboarding and campaign creation
- Brand dashboard, campaigns, creator discovery, offers, AI advisor, profile, billing, settings
- Local demo data and localStorage persistence
- Minimal Node server with static hosting, AI endpoint, Razorpay subscription endpoint, webhook verification
- Supabase/Postgres starter schema
- Desktop/tablet/mobile responsive layouts

## Works immediately without external accounts
The project runs in demo mode with realistic local data. Authentication, offer actions, campaign creation, AI calculations, usage UI, and role flows are interactive.

## Requires credentials to become live
- `OPENAI_API_KEY` for AI explanation text
- Razorpay keys + plan IDs for live subscriptions
- Supabase project/config + RLS policies for production persistence/auth
- Resend/PostHog are intentionally not wired into V1 UI because they are support services rather than core product logic

## Deliberately excluded from V1
- Chat/messages
- Marketplace payouts
- Instagram/TikTok verification dependency
- Advanced ML matching
- Team workflows
