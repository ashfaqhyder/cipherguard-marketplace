# CipherGuard — Cybersecurity Marketplace Demo

A standalone, Vercel-deployable Next.js storefront for a fictional cybersecurity brand. It includes a responsive product marketplace, product details, pricing comparison, a local demo cart, simulated checkout, and an administrator-only security lab that generates signed URLs for controlled Valorynn scans.

**This is a demonstration app. It does not include an antivirus engine, sell real software licenses, process payments, or store customer orders.**

## Features

- Premium responsive storefront with original CipherGuard branding
- Product catalogue, filters, product detail pages, and plan comparison
- Browser-local cart and simulated checkout (no payment provider)
- Admin login protected by a signed, HTTP-only cookie
- Persistent dark/light theme toggle
- Valorynn shield logo and wordmark credit in the footer
- Expanded security lab with 10 controls: CSP, MIME sniffing protection, Referrer-Policy, wildcard CORS, fictional diagnostics, Permissions-Policy, X-Frame-Options, demo cookie flags, cache policy, and a fictional server banner
- Live expected-finding preview to help audit which signals Valorynn currently detects
- Signed, read-only scenario URLs with a 7-day expiry
- A target endpoint at `/api/target?scenario=...` whose actual HTTP response changes based on the signed configuration
- No database required for the initial demo; scenario config is encoded into a signed URL, so it works with stateless Vercel Functions

## Run locally

Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local
```

Set the local environment values in `.env.local`, for example:

```env
DEMO_ADMIN_PASSWORD=use-a-long-local-demo-password
DEMO_SESSION_SECRET=use-a-long-random-session-secret-at-least-32-chars
DEMO_SCENARIO_SECRET=use-a-different-random-scenario-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then run:

```bash
npm run dev
```

Open `http://localhost:3000`. The local fallback password is `local-demo-password-change-me` only if `DEMO_ADMIN_PASSWORD` is not set; set a password explicitly for predictable behavior. Do not use the fallback in production.

## Deploy to Vercel

1. Put this folder in a new GitHub repository. Do not mix it into the Valorynn repository unless you intentionally want a monorepo.
2. In Vercel, import the repository as a new project.
3. Add the following Environment Variables for **Production**, and preferably Preview:
   - `DEMO_ADMIN_PASSWORD`: a strong, unique password (20+ characters recommended)
   - `DEMO_SESSION_SECRET`: a cryptographically random secret, at least 32 characters
   - `DEMO_SCENARIO_SECRET`: a different cryptographically random secret, at least 32 characters
   - `NEXT_PUBLIC_SITE_URL`: the exact deployed origin, e.g. `https://your-project.vercel.app` (no trailing slash)
4. Deploy and open `/admin/login`.
5. Sign in, select a scenario preset, and generate a target URL.
6. Submit the full generated URL to Valorynn. Change the scenario, generate a second URL, and scan that URL to compare results.

Generate strong secrets locally with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Run it separately for each secret. Do not commit `.env.local` or production secrets.

## Valorynn test workflow

1. In the lab, generate **Vulnerable baseline**.
2. Copy its target URL and scan that URL in Valorynn.
3. Record the findings and report/score.
4. Generate **Secure baseline** and scan the new URL.
5. Compare reports. Findings depend on which detectors are implemented in the Valorynn scanner.

Each generated URL is immutable, signed, and expires after 7 days. Generate a new URL when you change controls. This makes the “before” and “after” target configurations reproducible without relying on in-memory server state.

## Important Vercel constraints

- Vercel Functions are stateless. Do not rely on in-memory variables or local files to save shared lab configuration. This demo stores the selected config in a signed, expiring token instead. For shared editable scenarios, audit history, or order persistence, add a database such as Postgres/Supabase.
- Baseline browser headers are added by middleware on normal storefront/admin routes. The `/api/target` route is deliberately excluded so the lab can vary selected headers. Vercel manages some headers, including HSTS, and can add platform-level response headers. This demo intentionally does **not** provide a misleading HSTS-off toggle. Inspect the deployed response itself.
- Vercel's default protection and security behavior can vary by deployment configuration. Always check the actual response headers after deployment.
- A scenario URL is intended for authorized, controlled testing only. It is read-only and can only select the predefined safe behavior; it does not provide a shell, code execution, secret access, or arbitrary header injection.
- The target endpoint is public if someone has a valid signed URL. Treat the URL as a short-lived demo token and avoid posting it publicly.
- The login uses a shared demo admin password, not a full user-management system. For a public commercial application, replace it with a proper identity provider, rate limiting, audit logging, and role-based access controls.
- The lab's CSP toggle affects the target endpoint response. Since the endpoint returns JSON and not an HTML document, some browser-focused CSP detectors may not flag it. The lab is designed for header inspection and scanner demonstrations, not to prove every browser exploit scenario. The expanded controls are training signals, not a claim that Valorynn detects all ten automatically; detection depends on implemented scanner rules.

## Routes

- `/` — home
- `/products` — product catalogue
- `/products/[slug]` — product detail
- `/pricing` — plan comparison
- `/cart` — browser-local cart
- `/checkout` — simulated checkout
- `/about` — demo scope and principles
- `/admin/login` — admin sign-in
- `/admin` — security lab
- `/api/target?scenario=<signed-token>` — controlled scan target

## Security notes

- The demo checkout never requests card details.
- No real malware, exploit payloads, credentials, or customer records are included.
- Never use this lab to scan third-party systems without authorization.
- A detected issue is only as meaningful as the scanner's implemented rules; verify findings and response headers independently.
