# FuelOS multi-tenant architecture (pilot foundation)

Status: design draft; not connected to a Supabase project and not deployed.
Target: controlled pilot, Agartala first; expandable across Northeast India.
Frontend constraint: preserve the existing React/Vite prototype and visual system.

## 1. Infrastructure decision

- Backend: Supabase Auth + PostgreSQL + Row Level Security.
- Tenant model: an organization owns one or more stations. Organization members can be assigned roles; station members receive narrower station-specific roles.
- Client: existing React/Vite app. Supabase client integration is intentionally deferred until a dedicated FuelOS project is identified and its settings/security are reviewed.
- Environment: local development and isolated pilot project only. Never place service-role/secret keys in browser variables.
- No production database connection, migration, seed, or deployment is authorized by this design document.

## 2. Existing infrastructure inspection

Repository baseline contains a React 18 / Vite 6 frontend, package.json, README, index.html, main.jsx, styles.css, vite.config.js, and a GitHub Actions build workflow. It has no checked-in Supabase config, migrations, environment template, or client SDK integration on the inspected main branch.

The user's Supabase workspace exposes one existing project named `ashasetu` in `ap-south-1`, status INACTIVE. Database table and migration inspection failed because the database was not accessible. This project is not identified as FuelOS and must not be reactivated or modified for this work.

## 3. Tenant and role model

```
Organization (customer/business account)
  ├── Organization membership: owner | admin | billing_admin
  ├── Station: Station A
  │    ├── Station membership: manager | supervisor | attendant | accountant
  │    ├── Fuel products / tanks / nozzles
  │    ├── Shifts / meter readings / sales / payments
  │    ├── Stock movements / expenses / credit ledger
  │    └── Audit events
  └── Station: Station B
       └── Same station-scoped operational model
```

Rules:
- A user may belong to multiple organizations.
- An organization may own multiple stations.
- Organization owner/admin can access all stations in that organization.
- Other roles require an explicit station membership.
- Roles are stored in database membership tables, never trusted from user-editable Auth metadata.
- A station-scoped row always carries station_id; references between operational rows must be constrained to the same station.
- The first owner membership must be provisioned through a trusted administrative workflow. Do not allow arbitrary self-promotion through client-side inserts.

## 4. Initial data domains

| Domain | Core records | Key invariants |
|---|---|---|
| Identity | organizations, organization_memberships | membership controls tenant access |
| Station | stations, station_memberships | organization and station scopes |
| Configuration | fuel_products, tanks, nozzles | nozzle belongs to one tank and product at a station |
| Shifts | shifts, meter_readings | opening/closing readings, controlled close |
| Sales | sales, sale_payments | source shift/nozzle, payment allocation |
| Inventory | stock_movements | delivery, dip, adjustment, transfer as traceable events |
| Finance | expenses, customer_accounts, credit_entries | station-scoped ledger, no silent balance edits |
| Governance | audit_events | append-only actor/action/entity history |

## 5. Fuel accounting principles

- Store litres and unit prices as fixed-precision numeric values, not floating-point values.
- Record cumulative meter readings and calculate dispensed quantity from validated opening/closing readings.
- Handle meter rollover, meter replacement, calibration, nozzle changes and corrections explicitly; do not assume simple subtraction is always valid.
- Track deliveries, physical tank dips and adjustments as separate stock events.
- Reconcile book stock against physical stock and record variance with an explanation and approver.
- A shift close is a controlled state transition; closed records are not silently edited.
- Cash, UPI, card, fleet/credit and other collections are separately allocated and reconciled.
- Store timestamps as timestamptz; display in the station's configured timezone (default proposal: Asia/Kolkata, to be confirmed).

## 6. Security design

- Enable RLS on every exposed table.
- Use explicit authenticated grants only for tables intended for browser access; do not grant anon access to operational data.
- Policies check both authenticated identity and membership/role. `TO authenticated` alone is not authorization.
- Use a private, non-exposed schema for narrowly scoped RLS helper functions. Any SECURITY DEFINER helper must have a fixed empty search_path, fully qualified object names, explicit auth.uid() checks, and execution revoked from PUBLIC/anon.
- Never authorize from raw_user_meta_data / user_metadata.
- Never expose service_role or secret keys in Vite/browser variables.
- Keep audit events append-only; no ordinary update/delete policies.
- Avoid views unless they use security_invoker semantics or are kept outside exposed schemas with tightly scoped grants.
- Explicitly verify Data API exposure settings and grants. New public tables are not automatically exposed under current Supabase defaults.
- Test cross-tenant access using two synthetic organizations and users before any pilot data is loaded.

## 7. Delivery phases

### Phase A — design and isolated project
1. Confirm a dedicated FuelOS Supabase project; do not reuse `ashasetu`.
2. Confirm organization, billing/cost, region and project ownership.
3. Inspect Auth, Data API exposure, network restrictions, database settings and current migrations.
4. Review the SQL draft and role matrix.
5. Create a development-only migration after approval; never apply this draft directly to production.

### Phase B — backend foundation
1. Provision organization/station membership through a trusted onboarding path.
2. Implement Auth screens and protected client routing without changing the current visual language.
3. Add RLS policies and negative tests for cross-tenant reads/writes.
4. Add generated TypeScript database types and a safe browser client using only a publishable key.
5. Keep demo fixtures isolated behind an explicit demo mode.

### Phase C — pilot operations
1. Station configuration, fuel products, tanks and nozzles.
2. Staff, shifts and meter readings.
3. Sales and payment allocation.
4. Deliveries, tank dips, stock reconciliation.
5. Expenses, credit ledger and traceable reports.
6. Controlled pilot with consent, parallel paper/register reconciliation and documented rollback.

### Phase D — production readiness
Backups and restore drills, monitoring, incident response, rate limits, audit review, privacy/legal review, operational acceptance and security sign-off.

## 8. Acceptance gates

- User A cannot read, update, insert or delete User B's organization/station data.
- A station attendant cannot access owner-only financial or staff administration functions.
- A user with no station membership cannot access station operational data.
- Cross-station foreign-key references are rejected.
- Closed shifts and audit history cannot be silently overwritten.
- All financial and fuel quantities use deterministic decimal arithmetic.
- No production migration or live station onboarding until security and operational reviews pass.

## 9. Open pilot decisions

- Legal/operator model: one fuel-retail business per organization, or a franchise/group model?
- Station roles and exact permissions.
- Meter reading frequency and rollover/correction procedure for the actual pumps.
- Whether credit/fleet accounts are in pilot scope.
- Which payment methods and reconciliation reports are required.
- Station timezone and local operating-day cut-off.
- Pilot station and nominated owner/admin (not yet supplied; no station or seller data is assumed).

## 10. Current status

This is an architecture and implementation plan, not a claim of a working backend. The SQL under `supabase/drafts/` is a review draft only. No Supabase project has been connected, no database has been changed, and no production migrations have been applied.
