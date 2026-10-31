-- FuelOS multi-tenant foundation — REVIEW DRAFT ONLY
-- DO NOT APPLY to any project until project identity, access model and SQL are reviewed.
-- Target PostgreSQL 17 / Supabase. No production changes are authorized by this file.

begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 160),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','billing_admin')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.stations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null check (length(trim(name)) between 2 and 160),
  code text,
  address text,
  city text,
  state text,
  country_code char(2) not null default 'IN',
  timezone text not null default 'Asia/Kolkata',
  currency_code char(3) not null default 'INR',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, code)
);

create table if not exists public.station_memberships (
  station_id uuid not null references public.stations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('manager','supervisor','attendant','accountant')),
  created_at timestamptz not null default now(),
  primary key (station_id, user_id)
);

create table if not exists public.fuel_products (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 80),
  product_code text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (station_id, id),
  unique (station_id, product_code)
);

create table if not exists public.tanks (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  fuel_product_id uuid not null,
  name text not null,
  nominal_capacity_l numeric(14,3) not null check (nominal_capacity_l > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (station_id, id),
  foreign key (station_id, fuel_product_id)
    references public.fuel_products(station_id, id) on delete restrict
);

create table if not exists public.nozzles (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  tank_id uuid not null,
  fuel_product_id uuid not null,
  name text not null,
  meter_serial text,
  meter_rollover_l numeric(16,3),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (station_id, id),
  foreign key (station_id, tank_id)
    references public.tanks(station_id, id) on delete restrict,
  foreign key (station_id, fuel_product_id)
    references public.fuel_products(station_id, id) on delete restrict,
  check (meter_rollover_l is null or meter_rollover_l > 0)
);

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  assigned_user_id uuid references auth.users(id) on delete set null,
  opened_by uuid not null references auth.users(id) on delete restrict,
  closed_by uuid references auth.users(id) on delete restrict,
  status text not null default 'open' check (status in ('open','submitted','closed','void')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  opening_cash numeric(14,2) not null default 0 check (opening_cash >= 0),
  closing_cash numeric(14,2),
  close_notes text,
  created_at timestamptz not null default now(),
  unique (station_id, id),
  check ((status <> 'closed') or (closed_at is not null and closed_by is not null))
);

create table if not exists public.meter_readings (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  nozzle_id uuid not null,
  shift_id uuid not null,
  reading_type text not null check (reading_type in ('opening','closing','checkpoint','correction')),
  meter_value_l numeric(18,3) not null check (meter_value_l >= 0),
  recorded_by uuid not null references auth.users(id) on delete restrict,
  recorded_at timestamptz not null default now(),
  correction_reason text,
  created_at timestamptz not null default now(),
  foreign key (station_id, nozzle_id)
    references public.nozzles(station_id, id) on delete restrict,
  foreign key (station_id, shift_id)
    references public.shifts(station_id, id) on delete restrict,
  check (reading_type <> 'correction' or length(trim(coalesce(correction_reason,''))) >= 5)
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  shift_id uuid not null,
  nozzle_id uuid not null,
  recorded_by uuid not null references auth.users(id) on delete restrict,
  litres numeric(14,3) not null check (litres > 0),
  unit_price numeric(12,3) not null check (unit_price >= 0),
  gross_amount numeric(16,2) generated always as (round(litres * unit_price, 2)) stored,
  occurred_at timestamptz not null default now(),
  source text not null default 'manual' check (source in ('manual','meter_derived','imported','integration')),
  external_reference text,
  created_at timestamptz not null default now(),
  unique (station_id, id),
  foreign key (station_id, shift_id)
    references public.shifts(station_id, id) on delete restrict,
  foreign key (station_id, nozzle_id)
    references public.nozzles(station_id, id) on delete restrict
);

create table if not exists public.sale_payments (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  sale_id uuid not null,
  method text not null check (method in ('cash','upi','card','fleet_credit','other')),
  amount numeric(16,2) not null check (amount > 0),
  reference text,
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  foreign key (station_id, sale_id)
    references public.sales(station_id, id) on delete restrict
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  tank_id uuid not null,
  movement_type text not null check (movement_type in ('delivery','dip','adjustment','transfer_in','transfer_out')),
  quantity_l numeric(14,3) not null,
  reference text,
  reason text,
  recorded_by uuid not null references auth.users(id) on delete restrict,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  foreign key (station_id, tank_id)
    references public.tanks(station_id, id) on delete restrict,
  check (quantity_l <> 0),
  check (movement_type <> 'adjustment' or length(trim(coalesce(reason,''))) >= 5)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  category text not null,
  description text not null,
  amount numeric(14,2) not null check (amount > 0),
  spent_at timestamptz not null default now(),
  recorded_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  station_id uuid references public.stations(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists stations_org_idx on public.stations(organization_id);
create index if not exists org_memberships_user_idx on public.organization_memberships(user_id);
create index if not exists station_memberships_user_idx on public.station_memberships(user_id);
create index if not exists tanks_station_idx on public.tanks(station_id);
create index if not exists nozzles_station_idx on public.nozzles(station_id);
create index if not exists shifts_station_opened_idx on public.shifts(station_id, opened_at desc);
create index if not exists meter_readings_station_nozzle_time_idx on public.meter_readings(station_id, nozzle_id, recorded_at desc);
create index if not exists sales_station_time_idx on public.sales(station_id, occurred_at desc);
create index if not exists payments_station_sale_idx on public.sale_payments(station_id, sale_id);
create index if not exists stock_movements_station_tank_time_idx on public.stock_movements(station_id, tank_id, occurred_at desc);
create index if not exists expenses_station_spent_idx on public.expenses(station_id, spent_at desc);
create index if not exists audit_events_org_time_idx on public.audit_events(organization_id, occurred_at desc);

-- SECURITY DEFINER helpers are deliberately in a non-exposed schema.
-- They bypass RLS only for the narrowly scoped membership lookup and always bind to auth.uid().
create or replace function private.is_org_member(target_org uuid, allowed_roles text[] default null)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_memberships m
    where m.organization_id = target_org
      and m.user_id = (select auth.uid())
      and (allowed_roles is null or m.role = any(allowed_roles))
  );
$$;

create or replace function private.can_access_station(target_station uuid, allowed_station_roles text[] default null)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.stations s
    where s.id = target_station
      and (
        private.is_org_member(s.organization_id, array['owner','admin'])
        or exists (
          select 1
          from public.station_memberships sm
          where sm.station_id = s.id
            and sm.user_id = (select auth.uid())
            and (allowed_station_roles is null or sm.role = any(allowed_station_roles))
        )
      )
  );
$$;

revoke all on function private.is_org_member(uuid, text[]) from public, anon, authenticated;
revoke all on function private.can_access_station(uuid, text[]) from public, anon, authenticated;
grant execute on function private.is_org_member(uuid, text[]) to authenticated;
grant execute on function private.can_access_station(uuid, text[]) to authenticated;

alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.stations enable row level security;
alter table public.station_memberships enable row level security;
alter table public.fuel_products enable row level security;
alter table public.tanks enable row level security;
alter table public.nozzles enable row level security;
alter table public.shifts enable row level security;
alter table public.meter_readings enable row level security;
alter table public.sales enable row level security;
alter table public.sale_payments enable row level security;
alter table public.stock_movements enable row level security;
alter table public.expenses enable row level security;
alter table public.audit_events enable row level security;

create policy organizations_select_member on public.organizations
for select to authenticated using (private.is_org_member(id));
create policy organizations_update_admin on public.organizations
for update to authenticated using (private.is_org_member(id, array['owner','admin']))
with check (private.is_org_member(id, array['owner','admin']));

create policy org_memberships_select_member on public.organization_memberships
for select to authenticated using (user_id = (select auth.uid()) or private.is_org_member(organization_id, array['owner','admin']));

create policy stations_select_member on public.stations
for select to authenticated using (private.is_org_member(organization_id));
create policy stations_insert_admin on public.stations
for insert to authenticated with check (private.is_org_member(organization_id, array['owner','admin']));
-- Station updates that affect tenant ownership/configuration are reserved for a reviewed server workflow.

create policy station_memberships_select_accessible on public.station_memberships
for select to authenticated using (private.can_access_station(station_id));
create policy station_memberships_manage_admin on public.station_memberships
for all to authenticated
using (private.is_org_member((select s.organization_id from public.stations s where s.id = station_id), array['owner','admin']))
with check (private.is_org_member((select s.organization_id from public.stations s where s.id = station_id), array['owner','admin']));

create policy fuel_products_station_access on public.fuel_products
for select to authenticated using (private.can_access_station(station_id));
create policy fuel_products_station_manage on public.fuel_products
for all to authenticated
using (private.can_access_station(station_id, array['manager']))
with check (private.can_access_station(station_id, array['manager']));

create policy tanks_station_access on public.tanks
for select to authenticated using (private.can_access_station(station_id));
create policy tanks_station_manage on public.tanks
for all to authenticated
using (private.can_access_station(station_id, array['manager']))
with check (private.can_access_station(station_id, array['manager']));

create policy nozzles_station_access on public.nozzles
for select to authenticated using (private.can_access_station(station_id));
create policy nozzles_station_manage on public.nozzles
for all to authenticated
using (private.can_access_station(station_id, array['manager']))
with check (private.can_access_station(station_id, array['manager']));

create policy shifts_station_access on public.shifts
for select to authenticated using (private.can_access_station(station_id));
create policy shifts_station_insert on public.shifts
for insert to authenticated with check (
  private.can_access_station(station_id, array['manager','supervisor'])
  and opened_by = (select auth.uid())
);

create policy meter_readings_station_access on public.meter_readings
for select to authenticated using (private.can_access_station(station_id));
create policy meter_readings_station_insert on public.meter_readings
for insert to authenticated with check (
  private.can_access_station(station_id, array['manager','supervisor','attendant'])
  and recorded_by = (select auth.uid())
);

create policy sales_station_access on public.sales
for select to authenticated using (private.can_access_station(station_id));
create policy sales_station_insert on public.sales
for insert to authenticated with check (
  private.can_access_station(station_id, array['manager','supervisor','attendant'])
  and recorded_by = (select auth.uid())
);

create policy sale_payments_station_access on public.sale_payments
for select to authenticated using (private.can_access_station(station_id));
create policy sale_payments_station_insert on public.sale_payments
for insert to authenticated with check (private.can_access_station(station_id, array['manager','supervisor','attendant']));

create policy stock_movements_station_access on public.stock_movements
for select to authenticated using (private.can_access_station(station_id));
create policy stock_movements_station_insert on public.stock_movements
for insert to authenticated with check (
  private.can_access_station(station_id, array['manager','supervisor'])
  and recorded_by = (select auth.uid())
);

create policy expenses_station_access on public.expenses
for select to authenticated using (private.can_access_station(station_id, array['manager','accountant']));
create policy expenses_station_insert on public.expenses
for insert to authenticated with check (
  private.can_access_station(station_id, array['manager','accountant'])
  and recorded_by = (select auth.uid())
);

create policy audit_events_station_access on public.audit_events
for select to authenticated using (
  private.is_org_member(organization_id, array['owner','admin'])
  or (station_id is not null and private.can_access_station(station_id, array['manager']))
);

-- No UPDATE or DELETE policies are defined for audit_events, meter_readings,
-- sales, sale_payments, stock_movements or shifts. Audit events are not client-writable.
-- Corrections should be append-only compensating events. A trusted server-side
-- onboarding/shift-close workflow must validate totals and state transitions.

-- Explicit grants: public-schema API exposure must also be enabled in project settings
-- where required. RLS remains the row-level authorization boundary.
grant select on public.organizations, public.organization_memberships, public.stations,
  public.station_memberships, public.fuel_products, public.tanks, public.nozzles,
  public.shifts, public.meter_readings, public.sales, public.sale_payments,
  public.stock_movements, public.expenses to authenticated;

grant update on public.organizations to authenticated;
grant insert on public.stations to authenticated;
grant insert, update on public.station_memberships, public.fuel_products,
  public.tanks, public.nozzles to authenticated;
grant insert on public.shifts to authenticated;
grant insert on public.meter_readings, public.sales, public.sale_payments,
  public.stock_movements, public.expenses to authenticated;

commit;
