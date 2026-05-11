# Build Right USA — Production Handoff

## What This Is
A premium US home-services lead generation platform. Homeowners submit quote requests,
AI generates renovation previews, and leads are matched with licensed contractors.

## Tech Stack
- **Frontend**: React 18 + Vite 5 + TypeScript 5 + Tailwind CSS 3
- **UI**: shadcn/ui (Radix primitives) + lucide-react
- **Backend**: Supabase (Postgres, Auth, Storage, Realtime, Edge Functions)
- **AI Chat**: Lovable AI Gateway → Google Gemini
- **AI Renovation**: Lovable AI Gateway → Google Gemini Vision
- **Email**: Resend (transactional lead notifications)
- **Routing**: react-router-dom v6
- **State/Data**: @tanstack/react-query
- **i18n**: Custom context, 8 languages incl. RTL

---

## Environment Variables

### Frontend (.env)
Copy `.env.example` → `.env` and fill in:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-ref
```

### Supabase Edge Function Secrets
Set these in: Supabase Dashboard → Edge Functions → Manage Secrets
```
LOVABLE_API_KEY        — Lovable AI Gateway key (chat + ai-renovation)
RESEND_API_KEY         — Resend email API key (notify-lead)
ALLOWED_ORIGIN         — Your production domain e.g. https://buildright-usa.com
```
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are auto-provided to edge functions.

---

## Database Setup (Required Before First Deploy)

### Step 1: Run existing migrations (already in supabase/migrations/)
These were created by Lovable and define the core schema. Apply via:
```sh
supabase db push
# or paste each migration file into Supabase SQL Editor in date order
```

### Step 2: Run the final migration
```
supabase/migrations/20260420000000_final_schema.sql
```
This adds:
- `idempotency_key` column + unique constraint on `leads` (deduplication)
- Tightened RLS on `site_settings` (anon can only read 2 specific keys)
- Tightened `event_log` INSERT (only known event types)
- Blocks anon SELECT on `contractors`

### Step 3: Enable Realtime on leads table
In Supabase Dashboard → Database → Replication → add `leads` table.
This powers the ActivityToast real-time social proof.

### Step 4: Create Storage Buckets
Two buckets are created by migrations, but verify they exist:
- `photos` (public) — admin-uploaded project photos
- `renovation-uploads` (public) — user AI preview uploads

### Step 5: Seed site_settings
Run in SQL Editor:
```sql
INSERT INTO site_settings (key, value) VALUES
  ('CHAT_ENABLED', 'true'),
  ('FAKE_ACTIVITY_ENABLED', 'true')
ON CONFLICT (key) DO NOTHING;
```

### Step 6: Create first admin user
1. Sign up via /admin/login
2. In Supabase SQL Editor:
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('<your-user-uuid>', 'admin');
```

---

## Local Development
```sh
npm install
npm run dev          # http://localhost:8080
npm run build        # production build
npx tsc --noEmit     # type check
```

---

## Deployment to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables (VITE_* ones only)
4. Build command: `npm run build`
5. Output dir: `dist`
6. Deploy edge functions separately via Supabase CLI:
```sh
supabase functions deploy chat
supabase functions deploy notify-lead
supabase functions deploy distribute-lead
supabase functions deploy ai-renovation
```

---

## What Was Cleaned & Fixed

### Duplicate files removed
- `src/src/` entire nested tree deleted (was Lovable patch artifacts)

### Critical improvements merged
1. **AI Preview funnel** — Lead gate moved AFTER blurred teaser. Flow:
   `upload → configure → generating → blurred preview → lead gate → result`
2. **ChatWidget** — 8s AbortController timeout, 1 retry, graceful fallback CTA
3. **Lead deduplication** — `idempotency_key` upsert on all 3 lead forms
4. **HeroSlider** — Slide[0] eager+high priority (LCP). Slides 1-4 lazy+low
5. **ActivityToast** — Real Supabase Realtime data, no fake random numbers
6. **VideoHero** — `prefers-reduced-motion` respected; `preload="metadata"`
7. **React Query** — `staleTime: 60s`, `retry: 1`, `refetchOnWindowFocus: false`
8. **AdminDashboard** — Skeleton loaders replace plain "Loading..." text
9. **AdminLeads** — Skeleton loaders for table
10. **LeadForm** — Spinner on submit, WhatHappensNext confirmation, TrustStrip
11. **GetQuote** — TrustStrip + WhatHappensNext + SEO meta
12. **LeadCaptureForm** — WhatHappensNext + TrustStrip + response time copy
13. **ChatWidget mobile** — `bottom-[76px]` clears sticky CTA bar
14. **chat edge function** — CORS locked, rate limiting, body cap, no error leaks
15. **robots.txt** — /admin blocked from crawlers
16. **Migration** — idempotency + tightened RLS

### New components added
- `src/components/TrustStrip.tsx` — 4 micro-credentials near CTA
- `src/components/WhatHappensNext.tsx` — Post-submit timeline

---

## What Still Needs Manual Action

| Item | Action |
|------|--------|
| `COMPANY_PHONE` in `src/lib/constants.ts` | Replace `(555) 123-4567` with real number |
| `COMPANY_ADDRESS` in `src/lib/constants.ts` | Replace placeholder with real address |
| Canonical URLs in `GetQuote.tsx`, `LandingPage.tsx` | Replace `buildright-usa.com` with real domain |
| `ALLOWED_ORIGIN` Supabase secret | Set to production domain before going live |
| Supabase Realtime on leads | Enable in Dashboard → Database → Replication |
| First admin user | Create via SQL after first signup |
| Resend domain verification | Verify sending domain in Resend dashboard |

---

## Database Schema Reference

| Table | Purpose |
|-------|---------|
| `leads` | All form submissions. RLS: anon INSERT, auth SELECT/UPDATE |
| `lead_notes` | CRM activity log per lead |
| `lead_distributions` | Tracks which contractors received each lead |
| `contractors` | Contractor profiles. RLS: admin/agent only |
| `photos` | Project gallery. Approved=true = public |
| `site_settings` | Feature flags (CHAT_ENABLED, FAKE_ACTIVITY_ENABLED) |
| `event_log` | Analytics events |
| `user_roles` | Admin/agent/viewer roles |
| `profiles` | User profiles (auto-created on signup) |

---

## Key URLs
- Homepage: `/`
- Quote form: `/get-a-quote`
- AI Preview: `/renovation-preview`
- Admin login: `/admin/login`
- Admin dashboard: `/admin/dashboard`
- Landing pages: `/:slug` (e.g. `/roofing-tampa`)
- Location pages: `/locations/:slug`
