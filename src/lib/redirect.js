// 오픈 리다이렉트 방지: 같은 사이트의 내부 경로만 허용한다.
export function safeNextPath(next, fallback = '/dashboard') {
  if (typeof next !== 'string' || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return fallback;
  }
  return next;
}
