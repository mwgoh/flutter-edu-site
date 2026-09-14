import { redirect } from 'next/navigation';
import { safeNextPath } from '@/lib/redirect';
import { createClient } from '@/lib/supabase/server';

// 회원가입 인증 메일의 링크가 도착하는 경로
// - 기본 메일 템플릿(PKCE): ?code=...
// - token_hash를 쓰는 커스텀 템플릿: ?token_hash=...&type=email
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = safeNextPath(searchParams.get('next'));

  const supabase = await createClient();
  if (!supabase) redirect(`/auth/error?message=${encodeURIComponent('Supabase 환경 변수가 설정되지 않았습니다.')}`);

  let error;
  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }));
  } else {
    error = { message: '인증 정보가 없는 링크입니다.' };
  }

  if (error) redirect(`/auth/error?message=${encodeURIComponent(error.message)}`);
  redirect(next);
}
