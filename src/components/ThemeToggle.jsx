'use client';

import { useState } from 'react';
import { MonitorIcon, MoonIcon, SunIcon } from '@/components/Icons';
import { THEME_COOKIE } from '@/lib/theme';

const OPTIONS = {
  system: { label: '시스템', next: 'light', Icon: MonitorIcon },
  light: { label: '라이트', next: 'dark', Icon: SunIcon },
  dark: { label: '다크', next: 'system', Icon: MoonIcon },
};

const ONE_YEAR = 60 * 60 * 24 * 365;

// 테마를 시스템 → 라이트 → 다크 순서로 바꾸고 쿠키에 저장한다.
// layout.jsx가 쿠키를 읽어 <html data-theme>을 서버에서 렌더링하므로 새로고침해도 깜빡이지 않는다.
export default function ThemeToggle({ initialTheme }) {
  const [theme, setTheme] = useState(initialTheme);
  const { label, next, Icon } = OPTIONS[theme];
  const description = `현재 테마: ${label}. 누르면 ${OPTIONS[next].label} 테마로 바뀝니다.`;

  function handleClick() {
    const root = document.documentElement;
    if (next === 'system') {
      root.removeAttribute('data-theme');
      document.cookie = `${THEME_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    } else {
      root.setAttribute('data-theme', next);
      document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm btn-icon"
      onClick={handleClick}
      aria-label={description}
      title={description}
    >
      <Icon size={18} />
    </button>
  );
}
