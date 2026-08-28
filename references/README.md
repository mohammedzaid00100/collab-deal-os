# Reference material used

The implementation was built from the supplied Collab Deal OS interface screenshots and the uploaded product/API blueprints.

Visual references used for the design language:
- Role-selection landing page
- Login page
- Creator onboarding
- Creator dashboard
- Brand onboarding / campaign setup
- Brand dashboard
- AI Deal Advisor input/result screens
- Creator opportunity listing
- Offer revision screen

Product rules carried into V1:
- Creator/brand role selection with a shared auth system
- Own campaign/opportunity database
- Structured accept/reject/revise loop; no chat in V1
- Manual creator metrics first with creator-declared/verified/unavailable status
- Deterministic pricing engine before AI explanation
- 5 free evaluations, Pro ₹299/month, Premium ₹599/month
- Matching weights: 30% niche, 20% audience/location, 15% creator size, 15% engagement, 10% budget, 10% platform
- Private API keys only on the server
