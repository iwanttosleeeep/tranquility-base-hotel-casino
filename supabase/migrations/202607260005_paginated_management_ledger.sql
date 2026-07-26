-- Paginated staff feedback queries. Garden pagination uses the existing public
-- select policy directly and needs no database change.

drop function if exists public.get_admin_feedback();
drop function if exists public.get_admin_feedback(integer, integer, text);

create function public.get_admin_feedback(
  p_limit integer default 10,
  p_offset integer default 0,
  p_status text default null
)
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

  if p_status is not null and p_status not in ('open', 'in_review', 'resolved') then
    raise exception 'Invalid feedback status' using errcode = '22023';
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
    where p_status is null or f.status = p_status
    order by
      case f.status when 'open' then 0 when 'in_review' then 1 else 2 end,
      f.created_at desc
    limit greatest(1, least(coalesce(p_limit, 10), 50))
    offset greatest(coalesce(p_offset, 0), 0);
end;
$$;

revoke all on function public.get_admin_feedback(integer, integer, text) from public;
revoke all on function public.get_admin_feedback(integer, integer, text) from anon;
grant execute on function public.get_admin_feedback(integer, integer, text) to authenticated;

create or replace function public.get_admin_feedback_counts()
returns table (
  status text,
  total bigint
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
    select labels.status, count(f.id)::bigint
    from (values ('all'), ('open'), ('in_review'), ('resolved')) as labels(status)
    left join public.feedback as f
      on labels.status = 'all' or f.status = labels.status
    group by labels.status
    order by case labels.status when 'all' then 0 when 'open' then 1 when 'in_review' then 2 else 3 end;
end;
$$;

revoke all on function public.get_admin_feedback_counts() from public;
revoke all on function public.get_admin_feedback_counts() from anon;
grant execute on function public.get_admin_feedback_counts() to authenticated;
