'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { safeNextPath } from '@/lib/redirect';
import { createClient } from '@/lib/supabase/server';

// Supabase Auth 오류 코드 → 한국어 메시지
const ERROR_MESSAGES = {
  invalid_credentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
  email_not_confirmed: '이메일 인증이 아직 완료되지 않았습니다. 받은편지함의 인증 메일을 확인해 주세요.',
  user_already_exists: '이미 가입된 이메일입니다. 로그인해 주세요.',
  weak_password: '비밀번호가 너무 약합니다. 더 길고 복잡하게 입력해 주세요.',
  email_address_invalid: '사용할 수 없는 이메일 주소입니다.',
  signup_disabled: '현재 회원가입이 비활성화되어 있습니다.',
  over_email_send_rate_limit: '인증 메일 발송 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.',
  over_request_rate_limit: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
};

const MISSING_ENV = { error: 'Supabase 환경 변수가 설정되지 않아 로그인할 수 없습니다.' };

function toMessage(error) {
  return ERROR_MESSAGES[error.code] ?? `요청을 처리하지 못했습니다. (${error.message})`;
}

function readForm(formData) {
  return {
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
    next: safeNextPath(String(formData.get('next') ?? '')),
  };
}

export async function login(_prevState, formData) {
  const supabase = await createClient();
  if (!supabase) return MISSING_ENV;

  const { email, password, next } = readForm(formData);
  if (!email || !password) return { error: '이메일과 비밀번호를 입력해 주세요.', email };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: toMessage(error), email };

  revalidatePath('/', 'layout');
  redirect(next);
}

export async function signup(_prevState, formData) {
  const supabase = await createClient();
  if (!supabase) return MISSING_ENV;

  const { email, password, next } = readForm(formData);
  if (!email) return { error: '이메일을 입력해 주세요.' };
  if (password.length < 6) return { error: '비밀번호는 6자 이상이어야 합니다.', email };

  const headerList = await headers();
  const origin =
    headerList.get('origin') ?? `${headerList.get('x-forwarded-proto') ?? 'http'}://${headerList.get('host')}`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}` },
  });
  if (error) return { error: toMessage(error), email };

  // 이메일 인증을 켠 프로젝트는 이미 가입된 주소에도 오류 대신 identities가 빈 사용자를 돌려준다.
  if (data.user && data.user.identities?.length === 0) {
    return { error: ERROR_MESSAGES.user_already_exists, email };
  }

  // 이메일 인증을 끈 프로젝트는 곧바로 세션이 생긴다.
  if (data.session) {
    revalidatePath('/', 'layout');
    redirect(next);
  }

  return { success: `${email} 주소로 인증 메일을 보냈습니다. 메일의 링크를 누르면 가입이 완료됩니다.` };
}
