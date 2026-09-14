import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { hasEnvVars, supabaseKey, supabaseUrl } from '@/lib/env';

// 요청마다 새 클라이언트를 만든다. 전역 변수에 저장하지 않는다.
// 환경 변수가 없으면 null을 반환한다.
export async function createClient() {
  if (!hasEnvVars) return null;

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Component에서는 쿠키를 쓸 수 없다. proxy.js가 세션을 갱신하므로 무시한다.
        }
      },
    },
  });
}

// 서버 클라이언트와 현재 로그인 사용자({ id, email } 또는 null)를 함께 반환한다.
// cache로 감싸 한 요청 안에서 Navbar와 페이지가 인증 조회를 중복하지 않게 한다.
export const getSession = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null };

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const user = claims ? { id: claims.sub, email: claims.email } : null;

  return { supabase, user };
});
