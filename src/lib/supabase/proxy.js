import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { hasEnvVars, supabaseKey, supabaseUrl } from '@/lib/env';
import { safeNextPath } from '@/lib/redirect';

// 로그인이 필요한 경로
const PROTECTED_PATHS = ['/dashboard'];

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  if (!hasEnvVars) return supabaseResponse;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // createServerClient와 getClaims() 사이에 다른 코드를 넣지 않는다.
  // getClaims()가 만료된 토큰을 갱신하며, 빠지면 사용자가 임의로 로그아웃될 수 있다.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const { pathname, search, searchParams } = request.nextUrl;

  if (!user && PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return redirectWithCookies(url, supabaseResponse);
  }

  if (user && pathname === '/login') {
    const url = new URL(safeNextPath(searchParams.get('next')), request.url);
    return redirectWithCookies(url, supabaseResponse);
  }

  return supabaseResponse;
}

// 갱신된 세션 쿠키를 잃지 않도록 복사한 뒤 리다이렉트한다.
function redirectWithCookies(url, supabaseResponse) {
  const response = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}
