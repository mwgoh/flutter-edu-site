import LoginForm from '@/components/LoginForm';
import SetupNotice from '@/components/SetupNotice';
import { hasEnvVars } from '@/lib/env';
import { safeNextPath } from '@/lib/redirect';

export const metadata = { title: '로그인' };

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;

  return (
    <div className="container auth-page">
      <div className="auth-intro">
        <h1>로그인하고 학습 기록을 저장하세요</h1>
        <p>퀴즈 결과와 레슨 완료 기록이 계정에 저장되어 어느 기기에서든 진도를 이어갈 수 있습니다.</p>
      </div>
      {hasEnvVars ? <LoginForm next={safeNextPath(next)} /> : <SetupNotice />}
    </div>
  );
}
