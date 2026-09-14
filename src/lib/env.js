// Supabase 환경 변수. Publishable key를 우선 사용하고, 없으면 레거시 anon key를 사용한다.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수가 없으면 인증·진도 저장을 끄고 강의 열람만 허용한다.
export const hasEnvVars = Boolean(supabaseUrl && supabaseKey);
