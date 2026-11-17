-- ТАРЕЛКА: приватная статистика сайта
-- Выполни этот файл целиком в Supabase → SQL Editor → New query.

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.site_admins enable row level security;

create table if not exists public.site_visits (
  id bigint generated always as identity primary key,
  visitor_id uuid not null,
  user_id uuid references auth.users(id) on delete set null,
  visit_day date not null default (now() at time zone 'utc')::date,
  page text not null,
  created_at timestamptz not null default now(),
  constraint site_visits_unique unique(visitor_id, visit_day, page)
);
create index if not exists site_visits_day_idx on public.site_visits(visit_day);
create index if not exists site_visits_user_idx on public.site_visits(user_id);
alter table public.site_visits enable row level security;

revoke all on public.site_admins from anon, authenticated;
revoke all on public.site_visits from anon, authenticated;

create or replace function public.record_site_visit(p_visitor_id uuid, p_page text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_page text;
begin
  if p_visitor_id is null then return; end if;
  clean_page := left(regexp_replace(coalesce(p_page, '/'), '[^a-zA-Z0-9_./-]', '', 'g'), 100);
  if clean_page = '' then clean_page := '/'; end if;
  insert into public.site_visits(visitor_id, user_id, visit_day, page)
  values (p_visitor_id, auth.uid(), (now() at time zone 'utc')::date, clean_page)
  on conflict (visitor_id, visit_day, page) do update
    set user_id = coalesce(excluded.user_id, public.site_visits.user_id);
end;
$$;
revoke all on function public.record_site_visit(uuid, text) from public;
grant execute on function public.record_site_visit(uuid, text) to anon, authenticated;

create or replace function public.get_site_stats()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  if not exists (select 1 from public.site_admins a where a.user_id = auth.uid()) then
    raise exception 'not_authorized';
  end if;

  select jsonb_build_object(
    'total_visitors', (select count(distinct visitor_id) from public.site_visits),
    'today_visitors', (select count(distinct visitor_id) from public.site_visits where visit_day = (now() at time zone 'utc')::date),
    'week_visitors', (select count(distinct visitor_id) from public.site_visits where visit_day >= (now() at time zone 'utc')::date - 6),
    'month_visitors', (select count(distinct visitor_id) from public.site_visits where visit_day >= date_trunc('month', now() at time zone 'utc')::date),
    'registered_users', (select count(*) from auth.users),
    'registered_active_30d', (select count(distinct user_id) from public.site_visits where user_id is not null and visit_day >= (now() at time zone 'utc')::date - 29),
    'page_views', (select count(*) from public.site_visits),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object('day', d.day, 'visitors', d.visitors, 'views', d.views) order by d.day)
      from (
        select visit_day as day, count(distinct visitor_id)::int as visitors, count(*)::int as views
        from public.site_visits
        where visit_day >= (now() at time zone 'utc')::date - 29
        group by visit_day
      ) d
    ), '[]'::jsonb),
    'pages', coalesce((
      select jsonb_agg(jsonb_build_object('page', p.page, 'views', p.views) order by p.views desc)
      from (
        select page, count(*)::int as views from public.site_visits
        where visit_day >= (now() at time zone 'utc')::date - 29
        group by page
      ) p
    ), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;
revoke all on function public.get_site_stats() from public;
grant execute on function public.get_site_stats() to authenticated;
