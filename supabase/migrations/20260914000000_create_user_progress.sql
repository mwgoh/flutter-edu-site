-- Flutter Edu: 사용자별 레슨 학습 진도 테이블
-- Supabase 대시보드 > SQL Editor 에 붙여 넣어 실행하거나 `supabase db push`로 적용한다.
-- 여러 번 실행해도 안전하도록 작성했다.

create table if not exists public.user_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  course_id text not null,
  lesson_id text not null,
  quiz_passed boolean not null default false,
  quiz_score smallint not null default 0 check (quiz_score >= 0),
  quiz_total smallint not null default 0 check (quiz_total >= 0),
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_progress_user_lesson_key unique (user_id, course_id, lesson_id)
);

comment on table public.user_progress is '사용자별 레슨 퀴즈 통과 여부와 수강 완료 상태';

-- updated_at 자동 갱신 트리거
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_progress_set_updated_at on public.user_progress;
create trigger user_progress_set_updated_at
  before update on public.user_progress
  for each row execute function public.set_updated_at();

-- RLS: 로그인한 사용자는 자신의 진도만 조회·추가·수정할 수 있다.
alter table public.user_progress enable row level security;

drop policy if exists "본인 진도 조회" on public.user_progress;
create policy "본인 진도 조회" on public.user_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "본인 진도 추가" on public.user_progress;
create policy "본인 진도 추가" on public.user_progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "본인 진도 수정" on public.user_progress;
create policy "본인 진도 수정" on public.user_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 권한: 비로그인(anon)은 접근 불가, 로그인 사용자만 조회·추가·수정
revoke all on table public.user_progress from anon;
grant select, insert, update on table public.user_progress to authenticated;
