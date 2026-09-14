'use client';

import { useActionState, useState } from 'react';
import { login, signup } from '@/app/login/actions';

export default function LoginForm({ next }) {
  const [mode, setMode] = useState('login');
  const [loginState, loginAction, loginPending] = useActionState(login, null);
  const [signupState, signupAction, signupPending] = useActionState(signup, null);

  const isLogin = mode === 'login';
  const state = isLogin ? loginState : signupState;
  const pending = isLogin ? loginPending : signupPending;

  return (
    <div className="auth-card">
      <div className="auth-tabs" role="tablist" aria-label="로그인 또는 회원가입">
        <button
          type="button"
          role="tab"
          className="auth-tab"
          aria-selected={isLogin}
          onClick={() => setMode('login')}
        >
          로그인
        </button>
        <button
          type="button"
          role="tab"
          className="auth-tab"
          aria-selected={!isLogin}
          onClick={() => setMode('signup')}
        >
          회원가입
        </button>
      </div>

      <form key={mode} action={isLogin ? loginAction : signupAction} className="auth-form">
        <input type="hidden" name="next" value={next} />
        <label className="field">
          <span>이메일</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue={state?.email ?? ''}
          />
        </label>
        <label className="field">
          <span>비밀번호</span>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            placeholder="6자 이상"
          />
        </label>

        {state?.error && (
          <p className="form-message error" role="alert">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="form-message success" role="status">
            {state.success}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
          {pending ? '처리 중…' : isLogin ? '로그인' : '가입하기'}
        </button>
      </form>
    </div>
  );
}
