# Noryvex Monorepo

This repository contains two separate projects:

```
noryvex/
├── index.html, src/, ...   → Marketing Website  (trynoryvex.com)
└── portal/                 → Client Portal      (*.trynoryvex.com + /admin)
```

## Vercel Deployment

Two separate Vercel projects are needed:

### Project 1 — Marketing Website
- **Root Directory**: `.` (repo root)
- **Framework**: Vite
- **Domain**: `trynoryvex.com`

### Project 2 — Client Portal
- **Root Directory**: `portal`
- **Framework**: Next.js
- **Domains**:
  - `portal.trynoryvex.com` (primary)
  - `*.trynoryvex.com` (wildcard — for client subdomains)
  - `trynoryvex.com/admin` (handled by middleware rewrite)

## Portal Environment Variables (set in Vercel)

```
DATABASE_URL=<your-neon-url>
JWT_SECRET=<64-char-random-string>
NEXT_PUBLIC_APP_DOMAIN=trynoryvex.com
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
VAPI_API_KEY=<your-vapi-key>
VAPI_WEBHOOK_SECRET=<your-vapi-webhook-secret>
```

## Client Portal Subdomain Format

When you create a workspace for a client with subdomain `clinic`:
→ Portal URL: **`https://clinic.trynoryvex.com`**

Examples:
- `smilecare.trynoryvex.com` — Smile Care Dental
- `peakhealth.trynoryvex.com` — Peak Health Clinic
- `cityvets.trynoryvex.com` — City Vets

## Admin Panel
`https://trynoryvex.com/admin` → Login with super_admin credentials
