export function formatMinutes(total) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes}분`;
  return minutes ? `${hours}시간 ${minutes}분` : `${hours}시간`;
}

export function formatDate(iso) {
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeZone: 'Asia/Seoul' }).format(new Date(iso));
}

// 강의 난이도 → CSS 클래스 키
export const LEVEL_KEYS = { 입문: 'beginner', 초급: 'basic', 중급: 'intermediate' };
