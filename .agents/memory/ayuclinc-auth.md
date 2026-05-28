---
name: AyuClinic Auth Approach
description: How admin authentication works after replacing Manus OAuth with password-based login
---

# AyuClinic Admin Auth

## The rule
Admin login API route must NOT start with `/api/` — that prefix is claimed by the separate api-server artifact on port 8080. Use `/auth/` prefix instead.

**Why:** The shared reverse proxy routes `/api/*` to the api-server artifact (port 8080), not to ayuclinc (port 23915). A route at `/api/admin/login` returns 502 from the api-server.

**How to apply:** Any new server-side routes in the ayuclinc artifact that could conflict with `/api` prefix should use `/auth/`, `/trpc/`, or other non-conflicting prefixes.

## Auth flow
- POST `/auth/admin/login` with `{ password }` checked against `ADMIN_PASSWORD` env var
- On success: upserts user with openId="admin", role="admin" in DB; signs JWT; sets `app_session_id` cookie
- JWT secret: `SESSION_SECRET` env var (already provisioned by Replit)
- Default password: `AyuAdmin@2024` (stored in `ADMIN_PASSWORD` shared env var — user should change)

## Key files
- `server/_core/sdk.ts` — simplified JWT sign/verify, no Manus OAuth
- `server/_core/index.ts` — contains the `/auth/admin/login` POST route inline
- `server/_core/env.ts` — uses `SESSION_SECRET ?? JWT_SECRET` for cookie secret
- `client/src/pages/AdminLogin.tsx` — admin login UI at `/admin/login`

## What was removed
- All Manus OAuth service code (OAuthService class, axios HTTP calls to OAuth server)
- `registerOAuthRoutes` import and call (oauth.ts file remains but is unused)
- Manus SDK getUserInfoWithJwt, exchangeCodeForToken calls
- localStorage "manus-runtime-user-info" writes
