# Supabase workspace for FuelOS

This directory contains design artifacts only until a dedicated FuelOS project is approved and its security settings are inspected.

- `drafts/001_multitenant_foundation.sql` is a review draft, **not a migration**. Do not apply it directly.
- No project reference, URL, publishable key, service-role key, or secret is committed here.
- No Supabase client is connected to the frontend yet.
- No production or existing unrelated project has been modified.

Before implementation: provision a dedicated development/pilot project; inspect Auth, Data API exposure, current schema, migration history, extensions, network settings and advisors; review the draft SQL and role matrix; then create a proper CLI migration after approval. Test tenant isolation with synthetic users and organizations before any real station data.
