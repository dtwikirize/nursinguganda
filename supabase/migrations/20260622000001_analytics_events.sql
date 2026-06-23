-- ============================================================
-- Nursing Uganda analytics events
-- Apply via: Supabase Dashboard -> SQL Editor -> Run
-- ============================================================

create table if not exists analytics_events (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  event_type    text        not null check (event_type in ('pageview', 'click')),
  path          text        not null default '/',
  page_title    text        not null default '',
  target_text   text        not null default '',
  target_href   text        not null default '',
  visitor_id    text        not null,
  session_id    text        not null,
  user_id       uuid        null,
  user_email    text        null,
  is_registered boolean     not null default false,
  user_agent    text        not null default ''
);

create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc);
create index if not exists analytics_events_event_type_idx on analytics_events (event_type);
create index if not exists analytics_events_path_idx on analytics_events (path);
create index if not exists analytics_events_visitor_idx on analytics_events (visitor_id);
create index if not exists analytics_events_session_idx on analytics_events (session_id);

alter table analytics_events enable row level security;

drop policy if exists "analytics_public_insert" on analytics_events;
create policy "analytics_public_insert"
  on analytics_events
  for insert
  with check (true);

drop policy if exists "analytics_admin_read" on analytics_events;
create policy "analytics_admin_read"
  on analytics_events
  for select
  using (auth.jwt()->>'email' = 'twikirizederick@gmail.com');
