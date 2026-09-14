import { getSession } from '@/lib/supabase/server';

export function progressKey(courseId, lessonId) {
  return `${courseId}/${lessonId}`;
}

// 로그인 사용자의 진도를 "courseId/lessonId" 키의 Map으로 반환한다.
// 비로그인이면 user가 null이고, 조회 실패 시 error에 메시지가 담긴다.
export async function getProgress() {
  const { supabase, user } = await getSession();
  if (!user) return { user: null, progress: new Map(), error: null };

  const { data, error } = await supabase
    .from('user_progress')
    .select('course_id, lesson_id, quiz_passed, quiz_score, quiz_total, is_completed, completed_at, updated_at')
    .eq('user_id', user.id);

  if (error) {
    console.error('진도 조회 실패:', error.message);
    return { user, progress: new Map(), error: error.message };
  }

  const progress = new Map(data.map((row) => [progressKey(row.course_id, row.lesson_id), row]));
  return { user, progress, error: null };
}

export function summarizeCourse(course, progress) {
  const total = course.lessons.length;
  const completed = course.lessons.filter(
    (lesson) => progress.get(progressKey(course.id, lesson.id))?.is_completed,
  ).length;

  return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
}
