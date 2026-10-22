# ATSFY FuelOS — Public Home + Owner Workspace Preview

A responsive frontend prototype for independent petrol pump owners, starting with Northeast India.

## Current experience
- Public marketing homepage with product overview, capabilities, workflow, and calls to action
- Dedicated owner sign-in screen at `/login`
- Dashboard preview at `/dashboard`, with a return-to-home sign-out action
- Responsive owner dashboard for sales, tank/nozzle stock, shifts, staff, expenses/credit, and reports
- Search, filters, CSV exports, demo notifications, and a demo new-shift interaction
- Basic page titles and descriptions that update with the current view
- GitHub Actions production build check and split React/chart bundles

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

## Routes
- `/` — public FuelOS homepage
- `/login` — station owner sign-in screen
- `/dashboard` — illustrative owner dashboard

## Important phase boundary
**This is still a frontend-only prototype.** Owner authentication, account creation, password recovery, protected routes, station tenancy, database persistence, and secure sessions are not implemented. The sign-in form intentionally explains this and does not pretend to authenticate. Do not enter a real password. The dashboard preview uses illustrative data only.

## Next backend phase
1. Agree on station-owner onboarding and roles.
2. Implement secure authentication and session handling.
3. Create station-tenanted database tables for owners, stations, staff, tanks, nozzles, shifts, sales, expenses and audit events.
4. Enforce access control so each owner can only access authorized station data.
5. Add audited shift closing, stock reconciliation, backups and production logging.
6. Validate meter reading procedures and any supported pump-controller integration before using live station data.

Built with React, Vite, Recharts, and Lucide React.
