-- Secure Reception management ledger and owner controls for Garden entries.
-- Run as the postgres role in the Supabase SQL editor.

create table if not exists public.hotel_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.hotel_admins enable row level security;

revoke all on table public.hotel_admins from anon;
revoke all on table public.hotel_admins from authenticated;
grant select on table public.hotel_admins to authenticated;

drop policy if exists "Staff can read their own administrator badge" on public.hotel_admins;
create policy "Staff can read their own administrator badge"
  on public.hotel_admins
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.is_hotel_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.hotel_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_hotel_admin() from public;
revoke all on function public.is_hotel_admin() from anon;
grant execute on function public.is_hotel_admin() to authenticated;

alter table public.feedback enable row level security;

drop policy if exists "Hotel administrators can read feedback" on public.feedback;
create policy "Hotel administrators can read feedback"
  on public.feedback
  for select
  to authenticated
  using ((select public.is_hotel_admin()));

grant select on table public.feedback to authenticated;

create or replace function public.get_admin_feedback()
returns table (
  id uuid,
  author_id uuid,
  author_name text,
  room_number text,
  message text,
  created_at timestamptz
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
      f.created_at
    from public.feedback as f
    left join public.profiles as p on p.id = f.author_id
    order by f.created_at desc;
end;
$$;

revoke all on function public.get_admin_feedback() from public;
revoke all on function public.get_admin_feedback() from anon;
grant execute on function public.get_admin_feedback() to authenticated;

alter table public.forum_posts enable row level security;

drop policy if exists "Guests can update their own Garden entries" on public.forum_posts;
create policy "Guests can update their own Garden entries"
  on public.forum_posts
  for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

drop policy if exists "Guests can delete their own Garden entries" on public.forum_posts;
create policy "Guests can delete their own Garden entries"
  on public.forum_posts
  for delete
  to authenticated
  using ((select auth.uid()) = author_id);

grant update (title, body) on table public.forum_posts to authenticated;
grant delete on table public.forum_posts to authenticated;

-- After running this migration, promote your own account once by replacing
-- the email below and running the statement separately:
--
-- insert into public.hotel_admins (user_id)
-- select id from auth.users where email = 'your-email@example.com'
-- on conflict (user_id) do nothing;
