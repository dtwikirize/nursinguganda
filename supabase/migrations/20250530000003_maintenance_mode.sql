-- ============================================================
--  Maintenance Mode — site_settings table + admin-only RPC
--  Apply via: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Key-value store for site-wide settings
create table if not exists site_settings (
  key        text        primary key,
  value      text        not null default '',
  updated_at timestamptz not null default now()
);

-- Seed defaults (idempotent)
insert into site_settings (key, value) values
  ('maintenance_mode',    'false'),
  ('maintenance_message', ''),
  ('maintenance_eta',     '')
on conflict (key) do nothing;

-- Anyone can read (needed to check maintenance mode without auth)
alter table site_settings enable row level security;
drop policy if exists "ss_public_read" on site_settings;
create policy "ss_public_read" on site_settings for select using (true);

-- Only the admin email can mutate via this SECURITY DEFINER function
create or replace function nu_set_maintenance(
  p_enabled boolean,
  p_message text    default '',
  p_eta     text    default ''
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.jwt()->>'email' != 'twikirizederick@gmail.com' then
    raise exception 'Unauthorized: admin only';
  end if;

  insert into site_settings (key, value, updated_at)
    values ('maintenance_mode', p_enabled::text, now())
    on conflict (key) do update set value = excluded.value, updated_at = now();

  insert into site_settings (key, value, updated_at)
    values ('maintenance_message', coalesce(p_message, ''), now())
    on conflict (key) do update set value = excluded.value, updated_at = now();

  insert into site_settings (key, value, updated_at)
    values ('maintenance_eta', coalesce(p_eta, ''), now())
    on conflict (key) do update set value = excluded.value, updated_at = now();
end;
$$;
