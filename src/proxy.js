import { updateSession } from '@/lib/supabase/proxy';

// Next.js 16의 proxy(구 middleware): 모든 요청에서 Supabase 세션 쿠키를 갱신한다.
export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // 정적 파일과 이미지 최적화 경로는 제외
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
