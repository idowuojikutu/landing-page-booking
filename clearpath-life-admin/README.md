# ClearPath — Make room for life

ClearPath is a local-first personal life-admin workspace designed to reduce mental load. It gives people one calm place to capture tasks, keep bills and renewals visible, and make steady progress on meaningful goals.

## Why this problem matters
Everyday responsibilities are scattered across notes, calendars, messages, paper reminders and memory. That fragmentation can make small but important commitments easy to forget. ClearPath explores a unified, low-friction place to organize those commitments without overwhelming users.

## Frontend features
- Responsive, polished dashboard with mobile navigation
- Tasks, bills/renewals and personal goals in one workspace
- Create, edit, complete and delete items
- Due dates, optional notes, bill amounts and goal progress
- Dashboard summary cards, upcoming items and goal previews
- Search across saved items; press `/` or `Ctrl/Cmd + K`
- Sorting and filtering in each section
- Light/dark theme preference
- Helpful daily nudges
- Local persistence using browser `localStorage`
- Basic export-free-by-default privacy: entries stay in the current browser on the current device
- Accessible labels, keyboard shortcuts and responsive layouts

## Run locally
Open `index.html` in a modern browser. Tailwind CSS is loaded from its CDN; no build step is required.

## Important prototype limitations
This is a functional frontend prototype, not yet a multi-user cloud product. Browser-local data does not automatically sync across devices and may be lost if browser storage is cleared. Do not store passwords, financial account credentials, identity documents or other highly sensitive information here.

## Roadmap to a scalable product
1. **Foundation:** TypeScript, component system, automated tests, linting and CI.
2. **Accounts & sync:** secure authentication, server-side authorization, PostgreSQL, encrypted transport, backups and data export/delete controls.
3. **Reliable reminders:** opt-in email, push and calendar integrations with time-zone support and notification preferences.
4. **Trust & safety:** threat modelling, privacy policy, data retention controls, consent, accessibility audits and abuse reporting.
5. **Scale:** API versioning, observability, rate limiting, queues, caching, disaster recovery and staged deployments.
6. **Inclusive global product:** localization, multiple currencies, regional date formats, low-bandwidth support and offline-first sync conflict handling.

## Suggested architecture for the next phase
- Frontend: TypeScript + React/Next.js or a similarly maintainable component framework
- API: REST or typed RPC with schema validation
- Data: PostgreSQL with per-user ownership checks and migrations
- Background jobs: reminder queue with retries and idempotency
- Deployment: CI/CD, preview environments, health checks and rollback support

## Author
Developed by **Idowu Ojikutu 2026**.

ClearPath's goal is not to claim it can serve billions today; it is to start with a clear, common problem and build toward reliability, privacy, accessibility and localization from the beginning.
