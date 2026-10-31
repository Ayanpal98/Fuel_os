# ATSFY FuelOS — Repository Audit

Audit date: 31 October 2026  
Repository: `Ayanpal98/Fuel_os`  
Audited ref: `main` (read-only baseline), with a separate working branch for the first fix.

## Executive summary

FuelOS is a polished React/Vite frontend prototype for independent fuel retailers. The current code and README consistently describe a demo experience, not a production station-management system. The next milestone should be a secure, multi-station backend and operationally correct fuel accounting—not simply wiring forms to a database.

## What is present

- React 18 + Vite 6 application, with Recharts and Lucide React.
- Public marketing homepage, owner-access preview, and dashboard preview routes.
- Dashboard sections for overview, sales/transactions, tank/nozzle stock, shifts, staff, expenses/credit, and reports.
- Demo-only interactions for shift creation, notifications, filtering, and CSV export.
- A GitHub Actions workflow that runs a Vite production build on pushes and pull requests to `main`.
- README clearly discloses that authentication, persistence, tenant isolation, and secure sessions are not implemented.

## Findings and priorities

### P0 — Required before real station data or production users

1. **No real authentication or protected routes.** The login form is explanatory only, and the dashboard can be opened directly at `/dashboard`. Implement a real identity/session layer and server-enforced authorization before onboarding stations.
2. **No persistent backend.** Dashboard records, transactions, tank levels, shifts, staff and expenses are hard-coded or held in component state. A browser refresh loses demo shift changes; this is not an operational ledger.
3. **No station-level tenant boundary.** The UI shows a sample station selector, but there is no verified owner-to-station authorization model. Every database query and write must be scoped and authorized server-side.
4. **Fuel reconciliation needs a domain model.** Tank dips/deliveries, opening and closing meter readings, nozzle calibration/rollover, sales, returns, density/temperature where applicable, and book-vs-physical variance need explicit rules and audit trails. Do not treat a dashboard total as an accounting source of truth.
5. **No audit trail or controlled shift close.** Shift closing should capture readings, cash/UPI/card/credit collections, variance, supervisor approval and immutable event history. Corrections should be recorded as reversals/adjustments, not silent overwrites.
6. **Demo credentials UX needs protection.** The login page accepts email/password input despite authentication being unavailable. Before public promotion, remove or disable password entry in preview mode so users are not encouraged to submit real credentials.

### P1 — Reliability and maintainability

1. **Single large application module.** `main.jsx` contains routing, page components, demo fixtures, CSV generation and interaction logic. Split by feature and isolate data access/domain calculations before adding backend complexity.
2. **Hand-rolled route handling.** Only three paths are mapped; unknown paths fall back to the homepage. Add deliberate 404 handling and choose a router before adding more routes.
3. **Hard-coded demo identity and records.** Station name/location, staff, transactions, amounts, inventory, notifications and report values are fixtures. Keep these visibly marked as sample data and never present them as customer records.
4. **Date was hard-coded.** The dashboard heading displayed a fixed October 2026 date. A working-branch change replaces it with the browser's current localized date.
5. **No automated component or domain tests are present in the package scripts.** Add tests for meter arithmetic, reconciliation, permissions, shift state transitions, CSV escaping, and date/number formatting.
6. **Dependency reproducibility.** The root listing has no lockfile, while CI uses `npm install`. Commit the package-manager lockfile and use `npm ci` in CI.
7. **Accessibility review required.** Audit keyboard interaction for custom clickable elements (including the station selector), dialog focus management, labels, table semantics, contrast, and screen-reader announcements.
8. **Error/empty/loading states are not yet backed by network behaviour.** Define consistent loading, retry, offline, validation and permission-denied states when APIs are introduced.

### P2 — Product readiness

- Add PWA manifest, installability checks, offline-safe read-only behaviour, and an explicit sync/conflict strategy only after the online data model is stable.
- Add role-based workflows (owner, manager/supervisor, cashier/attendant) with least privilege.
- Add configurable station settings, fuel products, tank/nozzle mapping, shifts, payment modes, expenses and customer credit policies.
- Add report definitions with traceable source records and date ranges.
- Add structured operational logging, backups/restore drills, monitoring, rate limiting and incident procedures.
- Validate any pump-controller or meter integration against the actual hardware and station process; no integration is verified by this audit.

## Recommended implementation sequence

### Phase 0 — Stabilize the prototype
- Keep the existing visual design and demo boundary.
- Fix stale/static UI values and route fallbacks.
- Add lockfile, CI reproducibility, linting, unit tests and accessibility checks.
- Separate demo fixtures from UI components.

### Phase 1 — Domain and security design
- Confirm single-station vs multi-station ownership, roles, approval rules and audit requirements.
- Define the relational schema and row-level access policy before applying production migrations.
- Model stock movements and meter readings as append-only events with reconciliation calculations.
- Create a threat model and test tenant isolation with multiple synthetic owners/stations.

### Phase 2 — Backend foundation
- Implement authentication, verified sessions, owner onboarding and station membership.
- Add server-side authorization and tenant-scoped APIs.
- Add migrations, seed-only demo data, backups and observability.
- Keep production data separate from demo fixtures.

### Phase 3 — Operational workflows
- Implement staff and shift setup, opening/closing readings, transaction entry, collections, expenses and credit ledger.
- Add stock deliveries, tank readings, nozzle meter readings and reconciliation.
- Add approvals, reversals, audit history and exports.

### Phase 4 — Pilot readiness
- Run a controlled pilot with a station that explicitly agrees to participate.
- Reconcile FuelOS records against station registers and actual meter/tank procedures.
- Test backup restore, permission boundaries, network interruptions and data export.
- Only then assess production launch readiness.

## Guardrails

- Do not invent station customers, staff, prices, transactions, stock, fuel rates, margins or integrations.
- Do not connect a production database or apply production migrations without explicit project/security review.
- Keep demo records synthetic and clearly labelled.
- Never claim regulatory, accounting, hardware or payment compliance without evidence and validation.

## Audit limitations

This review is based on the repository files and README available at the audited ref. It is not a full browser/device QA run, dependency vulnerability scan, penetration test, production database review, or validation at a live fuel station. The build workflow exists, but a fresh build was not executed as part of this repository-only review.
