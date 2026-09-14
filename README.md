# Flutter Edu: Flutter 개발 교육 사이트

[Flutter 공식 문서(docs.flutter.dev)](https://docs.flutter.dev)의 **Learn 경로**를 바탕으로 만든 한국어 Flutter 교육 사이트입니다. **Next.js 16 App Router + Supabase**로 구현했으며 다음 기능을 제공합니다.

- **강의**: 6개 과정, 21개 레슨. 마크다운 본문, Dart 코드 하이라이트, 코드 복사 버튼, 공식 문서 원문 링크
- **퀴즈**: 레슨마다 2~3문항. 서버에서 채점하므로 정답이 브라우저로 전달되지 않음
- **인증**: 이메일·비밀번호 로그인과 회원가입(Supabase Auth, SSR 쿠키 세션)
- **진도 관리**: 퀴즈 통과 후 레슨 완료 처리, 대시보드에서 전체·과정별 진행률 확인

---

## 1. 커리큘럼

| STEP | 과정 | 레슨 | 실습 앱 | 기반 문서 |
| --- | --- | --- | --- | --- |
| 1 | Flutter 시작하기 | 개발 환경 설치 · Dart 핵심 문법 · 첫 앱 만들기 | - | Get started, dart.dev |
| 2 | Flutter UI 입문 | 위젯 만들기 · 레이아웃 · DevTools · 사용자 입력 · StatefulWidget · 암시적 애니메이션 | Birdle | Learn: Introduction to Flutter UI |
| 3 | Flutter 앱의 상태 관리 | 프로젝트 준비 · HTTP 요청 · ChangeNotifier · ListenableBuilder | Wikipedia 리더 | Learn: State in Flutter apps |
| 4 | Flutter UI 102 | Cupertino와 데이터 모델 · 적응형 레이아웃 · 슬리버 · 스택 내비게이션 | Rolodex | Learn: Flutter UI 102 |
| 5 | Flutter 동작 원리 | 아키텍처와 세 개의 트리 · 제약 조건 이해하기 | - | Learn: How Flutter works, Architectural overview, Understanding constraints |
| 6 | 테스트와 배포 | 단위·위젯 테스트 · 앱 빌드와 배포 | - | Testing, Deployment |

---

## 2. 폴더 구조

```text
flutter-edu-site/
├── .env.example                 # 환경 변수 예시 (.env.local로 복사해 사용)
├── next.config.mjs              # Next.js 설정 (강의 .md 파일 번들 포함)
├── jsconfig.json                # @/* → src/* 경로 별칭
├── supabase/
│   └── migrations/
│       └── 20260914000000_create_user_progress.sql   # 진도 테이블 + RLS
└── src/
    ├── proxy.js                 # Next 16 Proxy(구 middleware): 세션 갱신, /dashboard 보호
    ├── app/
    │   ├── layout.jsx           # 공통 레이아웃(내비게이션 바, 푸터)
    │   ├── globals.css          # 전역 스타일(라이트·다크 모드)
    │   ├── page.jsx             # 홈: 소개 + 커리큘럼
    │   ├── login/               # 로그인·회원가입 페이지와 서버 액션
    │   ├── auth/
    │   │   ├── actions.js       # 로그아웃
    │   │   ├── confirm/route.js # 인증 메일 링크 처리
    │   │   └── error/page.jsx   # 인증 오류 안내
    │   ├── dashboard/page.jsx   # 학습 대시보드(로그인 필요)
    │   └── courses/
    │       ├── actions.js       # 퀴즈 채점·진도 저장 서버 액션
    │       └── [courseId]/
    │           ├── page.jsx     # 과정 상세(레슨 목록)
    │           └── [lessonId]/page.jsx   # 레슨 본문 + 퀴즈
    ├── components/              # Navbar, CourseCard, LessonContent, LessonQuiz, CodeBlock 등
    ├── content/
    │   ├── curriculum.js        # 과정·레슨 메타데이터와 퀴즈(정답 포함, 서버 전용)
    │   └── lessons/<과정 id>/<레슨 id>.md   # 레슨 본문
    └── lib/
        ├── supabase/server.js   # 서버용 Supabase 클라이언트, getSession
        ├── supabase/proxy.js    # Proxy용 세션 갱신 로직
        ├── content.js           # 커리큘럼 조회 헬퍼
        ├── progress.js          # 진도 조회·요약 헬퍼
        └── env.js · format.js · redirect.js
```

---

## 3. 시작하기

### 3-1. 요구 사항

- Node.js **20.9 이상**(22 이상 권장. supabase-js가 Node 20 지원 종료를 예고함)
- Supabase 프로젝트

### 3-2. 설치와 환경 변수

```bash
npm install
cp .env.example .env.local   # Windows PowerShell: Copy-Item .env.example .env.local
```

`.env.local`에 Supabase 대시보드 **Project Settings > API Keys**의 값을 입력합니다.

```ini
NEXT_PUBLIC_SUPABASE_URL=https://<프로젝트 ref>.supabase.co
# 둘 중 하나: Publishable key(권장) 또는 레거시 anon key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

> 환경 변수가 없어도 사이트는 실행되며, 강의 열람과 퀴즈 채점은 동작합니다. 로그인과 진도 저장만 비활성화됩니다.

### 3-3. Supabase 설정

1. **테이블 생성**: 대시보드 **SQL Editor**에서 `supabase/migrations/20260914000000_create_user_progress.sql` 내용을 실행합니다. 여러 번 실행해도 안전합니다. Supabase CLI를 쓴다면 `supabase link` 후 `supabase db push`로 적용해도 됩니다.
2. **인증 리디렉션 URL**: **Authentication > URL Configuration**에서 다음을 설정합니다.
   - Site URL: `http://localhost:3000`(배포 후에는 실제 도메인)
   - Redirect URLs: `http://localhost:3000/auth/confirm`, 배포 도메인의 `/auth/confirm`
3. **이메일 인증(선택)**: **Authentication > Sign In / Providers > Email**의 **Confirm email**을 끄면 가입 즉시 로그인됩니다. 켜 두면 인증 메일의 링크를 눌러야 가입이 완료됩니다.

### 3-4. 실행

```bash
npm run dev     # 개발 서버: http://localhost:3000
npm run build   # 프로덕션 빌드
npm run start   # 빌드 결과 실행
npm run lint    # ESLint 검사
```

---

## 4. 동작 원리

### 인증 흐름

1. 로그인·회원가입 폼이 **서버 액션**(`src/app/login/actions.js`)을 호출하고, Supabase Auth가 세션을 **쿠키**에 저장합니다.
2. 모든 요청에서 `src/proxy.js`가 `supabase.auth.getClaims()`로 만료된 토큰을 갱신합니다. 비로그인 사용자가 `/dashboard`에 접근하면 `/login?next=/dashboard`로 보냅니다.
3. 서버 컴포넌트는 `getSession()`으로 현재 사용자를 확인합니다. React `cache`로 한 요청 안에서는 한 번만 조회합니다.
4. 인증 메일의 링크는 `/auth/confirm`에서 `code`(PKCE) 또는 `token_hash`를 세션으로 교환합니다.

### 퀴즈와 진도 저장

1. 레슨 페이지는 **정답을 뺀** 문항만 클라이언트로 보냅니다(`toPublicQuiz`).
2. 제출하면 서버 액션 `submitQuiz`가 `curriculum.js`의 정답으로 채점하고, 로그인 상태면 `user_progress`에 **upsert**합니다. 한 번 통과한 기록과 최고 점수는 재시도로 낮아지지 않습니다.
3. 퀴즈를 통과해야 `completeLesson`으로 레슨을 완료 처리할 수 있습니다(`quiz_passed = true` 조건으로 update).
4. 모든 쓰기는 **RLS**를 거치므로 사용자는 자신의 행만 조회·추가·수정할 수 있습니다.

### `user_progress` 테이블

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | bigint (identity) | 기본 키 |
| `user_id` | uuid → `auth.users` | 사용자(기본값 `auth.uid()`, 사용자 삭제 시 함께 삭제) |
| `course_id`, `lesson_id` | text | `curriculum.js`의 과정·레슨 id |
| `quiz_passed` | boolean | 퀴즈 통과 여부 |
| `quiz_score`, `quiz_total` | smallint | 최고 점수, 문항 수 |
| `is_completed` | boolean | 레슨 완료 여부 |
| `completed_at` | timestamptz | 완료 시각 |
| `created_at`, `updated_at` | timestamptz | 생성·수정 시각(트리거로 자동 갱신) |

`(user_id, course_id, lesson_id)`에 유니크 제약이 있습니다.

---

## 5. 강의 추가·수정하기

1. `src/content/curriculum.js`에서 해당 과정의 `lessons` 배열에 레슨을 추가합니다.

   ```js
   {
     id: 'my-lesson',              // URL과 파일 이름에 쓰임(영문 소문자, 하이픈)
     title: '레슨 제목',
     summary: '한 줄 요약',
     minutes: 20,
     sourceUrl: 'https://docs.flutter.dev/...',
     goals: ['학습 목표 1', '학습 목표 2'],
     quiz: [
       {
         question: '문항 (`백틱`은 코드로 표시됨)',
         options: ['보기 1', '보기 2', '보기 3', '보기 4'],
         answer: 0,                // 정답 보기의 인덱스
         explanation: '해설',
       },
     ],
   }
   ```

2. `src/content/lessons/<과정 id>/<레슨 id>.md`에 본문을 작성합니다.
   - 제목과 학습 목표는 자동으로 표시되므로 본문은 `##`(h2)부터 시작합니다.
   - 코드 블록 언어: `dart`, `bash`, `yaml`, `kotlin`, `ini`, `xml`, `text` 등
   - `> **팁** ...` 형태의 인용문은 안내 상자로 표시됩니다.

레슨 id를 바꾸면 기존 사용자의 해당 레슨 진도 기록과 연결이 끊기므로 주의하세요.

---

## 6. 배포(Vercel 예시)

1. 저장소를 Vercel에 연결합니다.
2. **Environment Variables**에 `NEXT_PUBLIC_SUPABASE_URL`과 키를 등록합니다.
3. Supabase **Redirect URLs**에 `https://<배포 도메인>/auth/confirm`을 추가하고, Site URL을 배포 도메인으로 바꿉니다.

---

## 7. 참고 문서

- [Flutter Learn 경로](https://docs.flutter.dev/learn/pathway)
- [Next.js App Router](https://nextjs.org/docs/app) · [Proxy(구 middleware)](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Supabase SSR(Next.js) 인증](https://supabase.com/docs/guides/auth/server-side/nextjs) · [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## 라이선스 표기

강의 내용은 docs.flutter.dev를 참고해 한국어로 재구성했습니다. 원문 문서는 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), 코드 샘플은 [BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause) 라이선스를 따릅니다. Flutter는 Google LLC의 상표입니다.
