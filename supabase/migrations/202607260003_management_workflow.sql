-- Expand the staff ledger into a small feedback workflow and allow staff to
-- remove Garden entries. Requires 202607260002_admin_feedback_and_garden_ownership.sql.

alter table public.feedback
  add column if not exists status text not null default 'open';

alter table public.feedback
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'feedback_status_check'
      and conrelid = 'public.feedback'::regclass
  ) then
    alter table public.feedback
      add constraint feedback_status_check
      check (status in ('open', 'in_review', 'resolved'));
  end if;
end;
$$;

create index if not exists feedback_status_created_idx
  on public.feedback (status, created_at desc);

drop policy if exists "Hotel administrators can update feedback" on public.feedback;
create policy "Hotel administrators can update feedback"
  on public.feedback
  for update
  to authenticated
  using ((select public.is_hotel_admin()))
  with check ((select public.is_hotel_admin()));

grant update (status, updated_at) on table public.feedback to authenticated;

drop policy if exists "Hotel administrators can remove Garden entries" on public.forum_posts;
create policy "Hotel administrators can remove Garden entries"
  on public.forum_posts
  for delete
  to authenticated
  using ((select public.is_hotel_admin()));

drop function if exists public.get_admin_feedback();

create function public.get_admin_feedback()
returns table (
  id uuid,
  author_id uuid,
  author_name text,
  room_number text,
  message text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_hotel_admin() then
    raise exception 'Hotel administrator access required' using errcode = '42501';
  end if;

  return query
    select
      f.id,
      f.author_id,
      coalesce(p.display_name, 'Guest')::text,
      p.room_number::text,
      f.message,
      f.status,
      f.created_at,
      f.updated_at
    from public.feedback as f
    left join public.profiles as p on p.id = f.author_id
    order by
      case f.status when 'open' then 0 when 'in_review' then 1 else 2 end,
      f.created_at desc;
end;
$$;

revoke all on function public.get_admin_feedback() from public;
revoke all on function public.get_admin_feedback() from anon;
grant execute on function public.get_admin_feedback() to authenticated;
