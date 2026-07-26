-- Guests may discard their own saved Room Service and Casino receipts.
-- Room Service rows are retained so discarding a receipt cannot reset the
-- three-orders-per-day limit; Casino records have no quota and may be deleted.

alter table public.room_service_orders
  add column if not exists discarded boolean not null default false;

grant update (kept, discarded) on table public.room_service_orders to authenticated;

drop policy if exists "Guests can delete their own Casino receipts" on public.casino_records;
create policy "Guests can delete their own Casino receipts"
  on public.casino_records
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant delete on table public.casino_records to authenticated;
