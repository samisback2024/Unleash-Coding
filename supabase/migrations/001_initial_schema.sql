-- ============================================================
-- Unleash Coding – Initial Schema
-- Run this in Supabase SQL Editor (or via Supabase CLI)
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── learning_paths ───────────────────────────────────────────
create table if not exists public.learning_paths (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  slug                 text unique not null,
  description          text not null default '',
  difficulty           text not null default 'beginner',
  estimated_timeline   text not null default '',
  weekly_hours         text not null default '',
  weekly_hours_num     int  not null default 10,
  category             text not null default '',
  icon                 text not null default '📚',
  color                text not null default '#6c63ff',
  tags                 text[] not null default '{}',
  enrolled             int  not null default 0,
  rating               numeric(3,1) not null default 0.0,
  total_lessons        int  not null default 0,
  total_challenges     int  not null default 0,
  job_ready_checklist  text[] not null default '{}',
  created_at           timestamptz not null default now()
);

-- ── modules ─────────────────────────────────────────────────
create table if not exists public.modules (
  id          uuid primary key default gen_random_uuid(),
  path_id     uuid not null references public.learning_paths(id) on delete cascade,
  title       text not null,
  description text not null default '',
  level       text not null default 'beginner',   -- beginner | intermediate | advanced
  duration    text not null default '',
  order_index int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ── lessons ─────────────────────────────────────────────────
create table if not exists public.lessons (
  id                uuid primary key default gen_random_uuid(),
  module_id         uuid not null references public.modules(id) on delete cascade,
  title             text not null,
  content           text not null default '',
  type              text not null default 'video',  -- video | reading | interactive
  duration          text not null default '',
  order_index       int  not null default 0,
  estimated_minutes int  not null default 10,
  created_at        timestamptz not null default now()
);

-- ── challenges ──────────────────────────────────────────────
create table if not exists public.challenges (
  id           uuid primary key default gen_random_uuid(),
  path_id      uuid not null references public.learning_paths(id) on delete cascade,
  title        text not null,
  description  text not null default '',
  difficulty   text not null default 'beginner',
  instructions text not null default '',
  xp           int  not null default 50,
  order_index  int  not null default 0,
  created_at   timestamptz not null default now()
);

-- ── projects ────────────────────────────────────────────────
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  path_id         uuid not null references public.learning_paths(id) on delete cascade,
  title           text not null,
  description     text not null default '',
  difficulty      text not null default 'beginner',
  estimated_time  text not null default '',
  tech_stack      text[] not null default '{}',
  portfolio_level text not null default '',
  is_capstone     boolean not null default false,
  requirements    text not null default '',
  order_index     int  not null default 0,
  created_at      timestamptz not null default now()
);

-- ── profiles ────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  full_name   text not null default '',
  avatar_url  text,
  xp          int  not null default 0,
  level       int  not null default 1,
  streak      int  not null default 0,
  bio         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── user_progress ────────────────────────────────────────────
create table if not exists public.user_progress (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users(id) on delete cascade,
  path_id                  uuid not null references public.learning_paths(id) on delete cascade,
  module_id                uuid references public.modules(id) on delete set null,
  lesson_id                uuid references public.lessons(id) on delete set null,
  completed_lesson_ids     text[] not null default '{}',
  completed_challenge_ids  text[] not null default '{}',
  completed_project_ids    text[] not null default '{}',
  status                   text not null default 'not_started',
  progress_percent         int  not null default 0,
  xp_earned                int  not null default 0,
  started_at               timestamptz,
  last_activity_at         timestamptz,
  completed_at             timestamptz,
  created_at               timestamptz not null default now(),
  unique(user_id, path_id)
);

-- ── badges ──────────────────────────────────────────────────
create table if not exists public.badges (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  icon        text not null default '🏆',
  color       text not null default '#f59e0b',
  created_at  timestamptz not null default now()
);

-- ── user_badges ─────────────────────────────────────────────
create table if not exists public.user_badges (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  badge_id  uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique(user_id, badge_id)
);

-- ── Indexes ─────────────────────────────────────────────────
create index if not exists modules_path_id_idx        on public.modules(path_id);
create index if not exists modules_level_idx          on public.modules(level);
create index if not exists modules_order_idx          on public.modules(path_id, order_index);
create index if not exists lessons_module_id_idx      on public.lessons(module_id);
create index if not exists challenges_path_id_idx     on public.challenges(path_id);
create index if not exists projects_path_id_idx       on public.projects(path_id);
create index if not exists user_progress_user_idx     on public.user_progress(user_id);
create index if not exists user_progress_path_idx     on public.user_progress(path_id);
create index if not exists user_badges_user_idx       on public.user_badges(user_id);

-- ── Row Level Security ───────────────────────────────────────
alter table public.learning_paths enable row level security;
alter table public.modules         enable row level security;
alter table public.lessons         enable row level security;
alter table public.challenges      enable row level security;
alter table public.projects        enable row level security;
alter table public.profiles        enable row level security;
alter table public.user_progress   enable row level security;
alter table public.badges          enable row level security;
alter table public.user_badges     enable row level security;

-- Public read: learning content is publicly accessible
create policy "Public read learning_paths"
  on public.learning_paths for select using (true);

create policy "Public read modules"
  on public.modules for select using (true);

create policy "Public read lessons"
  on public.lessons for select using (true);

create policy "Public read challenges"
  on public.challenges for select using (true);

create policy "Public read projects"
  on public.projects for select using (true);

create policy "Public read badges"
  on public.badges for select using (true);

-- Profiles: own row only
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- User progress: own rows only
create policy "Users can read own progress"
  on public.user_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update using (auth.uid() = user_id);

-- User badges: own rows only
create policy "Users can read own badges"
  on public.user_badges for select using (auth.uid() = user_id);

-- ── Auto-create profile on sign-up ───────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    split_part(new.email, '@', 1),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
