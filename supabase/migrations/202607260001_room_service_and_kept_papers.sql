-- Private Suite persistence: room-service orders and kept Casino records.
-- Safe to run again: tables and indexes are conditional; policies are replaced.

create table if not exists public.room_service_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ordered_at timestamptz not null default now(),
  courses jsonb not null,
  bill jsonb not null,
  kept boolean not null default false
);

create index if not exists room_service_orders_user_ordered_idx
  on public.room_service_orders (user_id, ordered_at desc);

alter table public.room_service_orders enable row level security;

drop policy if exists "Guests can read their own room-service orders" on public.room_service_orders;
create policy "Guests can read their own room-service orders"
  on public.room_service_orders
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Guests can place their own room-service orders" on public.room_service_orders;
create policy "Guests can place their own room-service orders"
  on public.room_service_orders
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Guests can keep their own room-service orders" on public.room_service_orders;
create policy "Guests can keep their own room-service orders"
  on public.room_service_orders
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public.room_service_orders from anon;
revoke all on table public.room_service_orders from authenticated;
grant select, insert on table public.room_service_orders to authenticated;
grant update (kept) on table public.room_service_orders to authenticated;


create table if not exists public.casino_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  spun_at timestamptz not null default now(),
  reels text[] not null,
  outcome text not null check (outcome in ('jackpot', 'pair', 'nothing')),
  message text
);

create index if not exists casino_records_user_spun_idx
  on public.casino_records (user_id, spun_at desc);

alter table public.casino_records enable row level security;

drop policy if exists "Guests can read their own Casino records" on public.casino_records;
create policy "Guests can read their own Casino records"
  on public.casino_records
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Guests can keep their own Casino records" on public.casino_records;
create policy "Guests can keep their own Casino records"
  on public.casino_records
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on table public.casino_records from anon;
revoke all on table public.casino_records from authenticated;
grant select, insert on table public.casino_records to authenticated;
