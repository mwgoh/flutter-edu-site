// 테마 설정. 클라이언트 컴포넌트에서도 import하므로 서버 전용 API를 쓰지 않는다.
export const THEME_COOKIE = 'theme';

// 쿠키 값이 light/dark가 아니면 시스템 설정(prefers-color-scheme)을 따른다.
export function parseTheme(value) {
  return value === 'light' || value === 'dark' ? value : 'system';
}
