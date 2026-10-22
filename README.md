# ATSFY FuelOS — Phase 1 Frontend MVP

A responsive frontend-only prototype for petrol pump owners, starting with individual stations in Northeast India.

## Features in this preview
- Responsive owner dashboard with sales charts and demo KPIs
- Tank inventory and nozzle meter sample screens
- Shift register with search, CSV export, and an interactive add-shift modal
- Sales & transactions, staff, expenses & credit, and reports screens
- Notifications, profile menu, mobile navigation, and toast feedback
- Clear demo-data labels; no backend, login, payment processing, or hardware integration

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

## Notes
- All numbers, staff, tank readings, transactions, alerts, and activity items are illustrative demo data.
- The new-shift action and filters update local in-memory React state only; they do not persist after refresh.
- CSV export currently exports the demo shift register.
- Before production use, validate meter reading procedures, stock reconciliation, role permissions, audit logs, backups, privacy, and compatibility with station equipment.
- Built with React, Vite, Recharts, and Lucide React.

## Suggested next phases
1. Validate the UI with 2–3 independent petrol pump operators.
2. Add backend authentication, station tenancy, roles, and database persistence.
3. Implement auditable nozzle readings, shift close, tank receipts, stock reconciliation, and payment totals.
4. Add reports, backup and export policies, then investigate supported pump-controller integrations.
