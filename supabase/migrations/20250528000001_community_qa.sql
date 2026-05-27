-- ============================================================
--  Community Q&A — tables, indexes, RLS policies, triggers
--  Apply via:  Supabase Dashboard → SQL Editor → Run
--  (or:  supabase db push  if using the CLI)
-- ============================================================

-- ── Tables ────────────────────────────────────────────────────

create table if not exists community_questions (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        references auth.users(id) on delete cascade,
  user_name     text        not null default 'Student',
  user_initials text        not null default '?',
  topic_key     text,
  programme_id  text,
  unit_id       text,
  subject_label text,
  title         text        not null,
  body          text        not null,
  upvotes       integer     not null default 0,
  answer_count  integer     not null default 0,
  is_answered   boolean     not null default false,
  created_at    timestamptz not null default now()
);

create table if not exists community_answers (
  id            uuid        primary key default gen_random_uuid(),
  question_id   uuid        not null references community_questions(id) on delete cascade,
  user_id       uuid        references auth.users(id) on delete cascade,
  user_name     text        not null default 'Student',
  user_initials text        not null default '?',
  body          text        not null,
  upvotes       integer     not null default 0,
  is_accepted   boolean     not null default false,
  created_at    timestamptz not null default now()
);

-- ── Indexes ───────────────────────────────────────────────────

create index if not exists community_questions_created_at_idx
  on community_questions (created_at desc);

create index if not exists community_answers_question_id_idx
  on community_answers (question_id);

-- ── Trigger: auto-increment answer_count on questions ─────────
--  Runs as security definer so it can bypass RLS to update
--  the question row even when the answering user didn't create it.

create or replace function _nu_answer_count_inc()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update community_questions
  set
    answer_count = answer_count + 1,
    is_answered  = true
  where id = NEW.question_id;
  return NEW;
end;
$$;

drop trigger if exists trg_answer_count_inc on community_answers;

create trigger trg_answer_count_inc
  after insert on community_answers
  for each row
  execute procedure _nu_answer_count_inc();

-- ── Row Level Security ────────────────────────────────────────

alter table community_questions enable row level security;
alter table community_answers    enable row level security;

-- QUESTIONS
--  Anyone can read
create policy "questions_select"
  on community_questions for select
  using (true);

--  Only the author can insert (user_id must match their auth uid)
create policy "questions_insert"
  on community_questions for insert
  with check (auth.uid() = user_id);

--  Only the author can update their own question
create policy "questions_update"
  on community_questions for update
  using (auth.uid() = user_id);

--  Only the author can delete their own question
create policy "questions_delete"
  on community_questions for delete
  using (auth.uid() = user_id);

-- ANSWERS
--  Anyone can read
create policy "answers_select"
  on community_answers for select
  using (true);

--  Only the author can insert
create policy "answers_insert"
  on community_answers for insert
  with check (auth.uid() = user_id);

--  Any authenticated user can update (needed for upvote increments)
--  This is acceptable for a student platform; tighten if needed later.
create policy "answers_update"
  on community_answers for update
  using (auth.role() = 'authenticated');

--  Only the author can delete their own answer
create policy "answers_delete"
  on community_answers for delete
  using (auth.uid() = user_id);

-- ── Upvote RPC (optional, safer alternative to direct updates) ─
--  Calling this from the app avoids exposing a permissive UPDATE.
--  Usage: await sb().rpc('nu_upvote', { target: 'question', tid: id })

create or replace function nu_upvote(target text, tid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if target = 'question' then
    update community_questions set upvotes = upvotes + 1 where id = tid;
  elsif target = 'answer' then
    update community_answers set upvotes = upvotes + 1 where id = tid;
  end if;
end;
$$;
