-- ============================================================
--  Email System — login lockout, device tracking, email logs,
--  win-back tracking, and helper RPC functions.
--
--  Apply via: Supabase Dashboard → SQL Editor → Run
--  (or: supabase db push)
-- ============================================================


-- ── Tables ────────────────────────────────────────────────────────────────────

-- Track consecutive failed login attempts per email address.
-- Records are auto-cleared on successful login via nu_record_success().
create table if not exists login_attempts (
  email            text        primary key,
  attempts         integer     not null default 0,
  first_attempt_at timestamptz,
  last_attempt_at  timestamptz,
  locked_until     timestamptz
);

-- One row per (user × device fingerprint). Lets us detect new devices.
create table if not exists user_devices (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  fingerprint   text        not null,          -- btoa(ua|lang|tz|screen) slice
  user_agent    text,
  timezone      text,
  language      text,
  first_seen_at timestamptz not null default now(),
  last_seen_at  timestamptz not null default now(),
  unique (user_id, fingerprint)
);

-- Append-only log of every email send attempt (success or failure).
create table if not exists email_logs (
  id            uuid        primary key default gen_random_uuid(),
  to_email      text        not null,
  template_name text        not null,
  subject       text,
  success       boolean     not null default false,
  error_msg     text,
  sent_at       timestamptz not null default now()
);

-- Track win-back email state so we never spam inactive users.
create table if not exists winback_tracking (
  user_id         uuid        primary key references auth.users(id) on delete cascade,
  first_sent_at   timestamptz,
  second_sent_at  timestamptz,
  unsubscribed    boolean     not null default false
);


-- ── Indexes ───────────────────────────────────────────────────────────────────

create index if not exists user_devices_user_id_idx
  on user_devices (user_id);

create index if not exists email_logs_sent_at_idx
  on email_logs (sent_at desc);

create index if not exists email_logs_to_email_idx
  on email_logs (to_email);

create index if not exists winback_tracking_first_sent_idx
  on winback_tracking (first_sent_at);


-- ── RPC: Check lockout status ─────────────────────────────────────────────────
-- Called BEFORE attempting login.  Auto-clears expired lockouts.
-- Returns: { locked: bool, attempts: int, locked_until: timestamptz | null }
create or replace function nu_check_lockout(p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec login_attempts%rowtype;
  e   text := lower(trim(p_email));
begin
  select * into rec from login_attempts where email = e;

  if not found then
    return jsonb_build_object('locked', false, 'attempts', 0, 'locked_until', null);
  end if;

  -- Auto-unlock if the lockout window has expired
  if rec.locked_until is not null and rec.locked_until <= now() then
    delete from login_attempts where email = e;
    return jsonb_build_object('locked', false, 'attempts', 0, 'locked_until', null);
  end if;

  return jsonb_build_object(
    'locked',       rec.locked_until is not null and rec.locked_until > now(),
    'attempts',     rec.attempts,
    'locked_until', rec.locked_until
  );
end;
$$;


-- ── RPC: Record failed login attempt ─────────────────────────────────────────
-- Increments attempt counter.  Locks account for 1 hour after 5 failures.
-- Returns: { now_locked: bool, attempts: int, locked_until: timestamptz | null }
create or replace function nu_record_failed_attempt(p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  new_attempts    integer;
  locked_until_ts timestamptz := null;
  e               text        := lower(trim(p_email));
begin
  insert into login_attempts (email, attempts, first_attempt_at, last_attempt_at)
  values (e, 1, now(), now())
  on conflict (email) do update
    set
      attempts         = login_attempts.attempts + 1,
      last_attempt_at  = now(),
      first_attempt_at = coalesce(login_attempts.first_attempt_at, now());

  select attempts into new_attempts from login_attempts where email = e;

  if new_attempts >= 5 then
    locked_until_ts := now() + interval '1 hour';
    update login_attempts set locked_until = locked_until_ts where email = e;
  end if;

  return jsonb_build_object(
    'now_locked',   new_attempts >= 5,
    'attempts',     new_attempts,
    'locked_until', locked_until_ts
  );
end;
$$;


-- ── RPC: Clear attempts on successful login ───────────────────────────────────
create or replace function nu_record_success(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from login_attempts where email = lower(trim(p_email));
end;
$$;


-- ── RPC: Check / register device fingerprint ─────────────────────────────────
-- Returns { is_new: bool } — true only on the very first login from this device.
create or replace function nu_check_device(
  p_user_id     uuid,
  p_fingerprint text,
  p_user_agent  text    default null,
  p_timezone    text    default null,
  p_language    text    default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  existed boolean;
begin
  select exists(
    select 1 from user_devices
    where user_id = p_user_id and fingerprint = p_fingerprint
  ) into existed;

  insert into user_devices (user_id, fingerprint, user_agent, timezone, language)
  values (p_user_id, p_fingerprint, p_user_agent, p_timezone, p_language)
  on conflict (user_id, fingerprint) do update
    set last_seen_at = now(),
        user_agent   = coalesce(excluded.user_agent, user_devices.user_agent);

  return jsonb_build_object('is_new', not existed);
end;
$$;


-- ── RPC: Log outbound email ───────────────────────────────────────────────────
-- Called from edge functions after every send attempt.
create or replace function nu_log_email(
  p_to       text,
  p_template text,
  p_subject  text,
  p_success  boolean,
  p_error    text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into email_logs (to_email, template_name, subject, success, error_msg)
  values (lower(trim(p_to)), p_template, p_subject, p_success, p_error);
end;
$$;


-- ── Row Level Security ────────────────────────────────────────────────────────

-- login_attempts: no direct client access; all mutations via SECURITY DEFINER RPCs
alter table login_attempts enable row level security;
drop policy if exists "la_no_direct" on login_attempts;
create policy "la_no_direct" on login_attempts using (false);

-- user_devices: authenticated users can read their own rows only
alter table user_devices enable row level security;
drop policy if exists "ud_own_select" on user_devices;
create policy "ud_own_select" on user_devices
  for select using (auth.uid() = user_id);

-- email_logs: no public read (service role only via edge functions)
alter table email_logs enable row level security;
drop policy if exists "el_no_direct" on email_logs;
create policy "el_no_direct" on email_logs using (false);

-- winback_tracking: users can see/update their own unsubscribe flag
alter table winback_tracking enable row level security;
drop policy if exists "wb_own_select" on winback_tracking;
drop policy if exists "wb_own_update" on winback_tracking;
create policy "wb_own_select" on winback_tracking
  for select using (auth.uid() = user_id);
create policy "wb_own_update" on winback_tracking
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
