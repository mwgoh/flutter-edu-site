# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Flutter 공식 문서(docs.flutter.dev)의 Learn 경로를 바탕으로 만든 한국어 Flutter 교육 사이트. **Next.js 16 App Router + Supabase(Auth/DB)**로 구현되어 있다. 디렉터리 이름(`flutter-edu-site`)과 달리 Flutter/Dart 코드는 없고, 전체가 JavaScript(JSX) Next.js 앱이다.

## 명령어

```bash
npm install
npm run dev     # 개발 서버 (http://localhost:3000)
npm run build   # 프로덕션 빌드
npm run start   # 빌드 결과 실행
npm run lint    # ESLint 검사
```

- Node.js 20.9 이상 필요(22 이상 권장 — supabase-js가 Node 20 지원 종료를 예고함).
- 별도 테스트 스크립트는 없다(단위 테스트 프레임워크 미설치).
- 환경 변수는 `.env.example`을 `.env.local`로 복사해 채운다: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`(권장) 또는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`. **환경 변수가 없어도 앱은 정상 실행**되며 강의 열람·퀴즈 채점은 동작한다(`src/lib/env.js`의 `hasEnvVars`가 로그인·진도 저장 기능만 끈다).
- Supabase 쪽 설정(최초 1회): `supabase/migrations/20260914000000_create_user_progress.sql`을 대시보드 SQL Editor에서 직접 실행해야 `user_progress` 테이블과 RLS가 생성된다(CLI 마이그레이션 자동 적용 없음). Authentication > URL Configuration에 `/auth/confirm` 리디렉션 URL 등록 필요.
- 경로 별칭 `@/*` → `src/*` (jsconfig.json).

## 아키텍처

### 인증 흐름 (Supabase Auth, 쿠키 세션)

- `src/proxy.js`가 Next.js 16의 proxy(과거의 middleware)로 모든 요청에서 `src/lib/supabase/proxy.js`의 `updateSession`을 호출해 세션 쿠키를 갱신한다. `createServerClient` 생성과 `getClaims()` 호출 사이에는 다른 로직을 넣지 않아야 한다 — 순서가 깨지면 만료 토큰 갱신이 실패해 사용자가 임의로 로그아웃될 수 있다.
- `updateSession`은 비로그인 사용자가 `/dashboard`(`PROTECTED_PATHS`)에 접근하면 `/login?next=...`로, 로그인 사용자가 `/login`에 접근하면 `next` 파라미터(`src/lib/redirect.js`의 `safeNextPath`로 검증) 경로로 리다이렉트한다.
- 서버 컴포넌트/서버 액션은 `src/lib/supabase/server.js`의 `getSession()`을 쓴다. `proxy.js`용 클라이언트와 별도로 구현되어 있는 이유는 쿠키 API가 다르기 때문(Server Component에서는 쿠키 쓰기가 불가능해 `try/catch`로 무시). `getSession`은 React `cache`로 감싸 있어 한 요청 안에서 Navbar와 페이지가 인증 조회를 중복하지 않는다.
- 로그인/회원가입은 `src/app/login/actions.js` 서버 액션, 로그아웃은 `src/app/auth/actions.js`. 이메일 인증 링크는 `src/app/auth/confirm/route.js`에서 `code`(PKCE) 또는 `token_hash`를 세션으로 교환한다.

### 강의 콘텐츠와 퀴즈 (정답이 클라이언트로 노출되지 않도록 설계됨)

- 과정/레슨 메타데이터와 퀴즈(정답 `answer` 인덱스, `explanation` 포함)는 `src/content/curriculum.js`에 정의되고, 레슨 본문은 `src/content/lessons/<courseId>/<lessonId>.md`에 마크다운으로 작성된다.
- `src/lib/content.js`의 `readLessonMarkdown`은 런타임에 `fs`로 `.md`를 읽는다. 이 파일들은 배포 번들에 기본 포함되지 않으므로 `next.config.mjs`의 `outputFileTracingIncludes`에 `src/content/lessons/**/*.md`를 명시해 두었다 — 레슨 폴더 구조를 바꾸면 이 설정도 함께 확인해야 한다.
- `toPublicQuiz()`가 `question`/`options`만 남기고 `answer`/`explanation`을 제거한 뒤 클라이언트 컴포넌트(`LessonQuiz`)로 전달한다. 채점은 반드시 서버 액션(`src/app/courses/actions.js`의 `submitQuiz`)에서 `curriculum.js`의 정답과 대조해 이루어진다.
- `submitQuiz`는 로그인 상태면 `user_progress`에 upsert하되, 한 번 통과한 `quiz_passed`와 최고 `quiz_score`는 재시도로 낮아지지 않도록 기존 값과 비교해 유지한다. `completeLesson`은 DB에 이미 `quiz_passed = true`가 저장된 행에서만 `is_completed`를 갱신하는 조건부 update라서, 클라이언트가 임의로 완료 처리를 조작할 수 없다.
- 새 레슨 추가 시 `curriculum.js`에 항목을 넣고 대응하는 `.md` 파일을 만든다(본문은 `##`부터 시작 — 제목/학습 목표는 자동 렌더링됨). **레슨 `id`를 바꾸면 `user_progress`의 기존 진도 기록과 연결이 끊어진다.**

### `user_progress` 테이블과 RLS

- 컬럼: `user_id`(→ `auth.users`, cascade delete), `course_id`/`lesson_id`(text, curriculum.js의 id와 매칭), `quiz_passed`, `quiz_score`/`quiz_total`, `is_completed`, `completed_at`, 타임스탬프.
- `(user_id, course_id, lesson_id)` 유니크 제약 + RLS로 각 사용자는 자기 행만 조회·추가·수정 가능. 스키마를 바꾸려면 `supabase/migrations/`에 새 마이그레이션 파일을 추가하고 README의 "3-3. Supabase 설정" 안내대로 대시보드에서 수동 실행해야 한다(자동 적용 파이프라인 없음).

### 테마 (라이트/다크/시스템)

- `ThemeToggle` 컴포넌트가 시스템 → 라이트 → 다크 순으로 전환하며 `theme` 쿠키(1년)에 저장한다. 시스템 선택 시 쿠키를 삭제한다.
- `src/app/layout.jsx`가 요청마다 쿠키를 읽어 `<html data-theme>`을 서버에서 렌더링하므로 새로고침 시 테마 깜빡임이 없다. 쿠키가 없으면 `globals.css`의 `prefers-color-scheme` 미디어 쿼리가 OS 설정을 따른다.
- `src/lib/theme.js`(`THEME_COOKIE`, `parseTheme`)는 클라이언트 컴포넌트에서도 import되므로 서버 전용 API를 넣지 않는다.

## 일반 규칙

- 전역 CLAUDE.md(`~/.claude/CLAUDE.md`) 규칙에 따라 응답, 문서, 커밋 메시지는 한국어로 작성한다.
