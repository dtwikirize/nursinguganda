-- ============================================================
--  Community Q&A tables
--  Apply via Supabase Dashboard → SQL Editor, or:
--    supabase db push
-- ============================================================

-- Questions
create table if not exists community_questions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  user_name     text not null default 'Student',
  user_initials text not null default '?',
  topic_key     text,
  programme_id  text,
  unit_id       text,
  subject_label text,
  title         text not null,
  body          text not null,
  upvotes       integer not null default 0,
  answer_count  integer not null default 0,
  is_answered   boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Answers
create table if not exists community_answers (
  id            uuid primary key default gen_random_uuid(),
  question_id   uuid references community_questions(id) on delete cascade,
  user_id       uuid references auth.users(id) on delete cascade,
  user_name     text not null default 'Student',
  user_initials text not null default '?',
  body          text not null,
  upvotes       integer not null default 0,
  is_accepted   boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists community_questions_created_at_idx on community_questions(created_at desc);
create index if not exists community_answers_question_id_idx on community_answers(question_id);

-- ── Row Level Security ──────────────────────────────────────

alter table community_questions enable row level security;
alter table community_answers    enable row level security;

-- Questions: anyone reads; logged-in users insert; own rows update/delete
create policy "questions_select" on community_questions
  for select using (true);

create policy "questions_insert" on community_questions
  for insert with check (auth.uid() = user_id);

create policy "questions_update" on community_questions
  for update using (auth.uid() = user_id);

create policy "questions_delete" on community_questions
  for delete using (auth.uid() = user_id);

-- Allow answer_count / is_answered updates from any authenticated user
--  (needed when posting answers increments the count)
create policy "questions_update_counts" on community_questions
  for update using (auth.role() = 'authenticated');

-- Answers: anyone reads; logged-in users insert; own rows update/delete
create policy "answers_select" on community_answers
  for select using (true);

create policy "answers_insert" on community_answers
  for insert with check (auth.uid() = user_id);

create policy "answers_update" on community_answers
  for update using (auth.uid() = user_id);

create policy "answers_delete" on community_answers
  for delete using (auth.uid() = user_id);

-- Allow upvotes update from any authenticated user
create policy "answers_upvote" on community_answers
  for update using (auth.role() = 'authenticated');
