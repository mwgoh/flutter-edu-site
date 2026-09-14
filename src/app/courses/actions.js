'use server';

import { revalidatePath } from 'next/cache';
import { getLesson } from '@/lib/content';
import { getSession } from '@/lib/supabase/server';

// 퀴즈를 서버에서 채점하고, 로그인 상태면 결과를 저장한다.
// 한 번 통과한 기록(quiz_passed)과 최고 점수는 이후 재시도에서 낮아지지 않는다.
export async function submitQuiz({ courseId, lessonId, answers }) {
  const found = getLesson(courseId, lessonId);
  if (!found) return { error: '레슨을 찾을 수 없습니다.' };

  const { quiz } = found.lesson;
  if (!Array.isArray(answers) || answers.length !== quiz.length) {
    return { error: '모든 문항에 답해 주세요.' };
  }

  const results = quiz.map((question, i) => ({
    correct: answers[i] === question.answer,
    answer: question.answer,
    explanation: question.explanation,
  }));
  const score = results.filter((result) => result.correct).length;
  const total = quiz.length;
  const passed = score === total;
  const graded = { score, total, passed, results };

  const { supabase, user } = await getSession();
  if (!user) return { ...graded, saved: false, quizPassed: passed };

  const { data: existing, error: selectError } = await supabase
    .from('user_progress')
    .select('quiz_passed, quiz_score')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('lesson_id', lessonId)
    .maybeSingle();
  if (selectError) return { ...graded, saved: false, quizPassed: passed, saveError: selectError.message };

  const quizPassed = passed || Boolean(existing?.quiz_passed);
  const { error } = await supabase.from('user_progress').upsert(
    {
      user_id: user.id,
      course_id: courseId,
      lesson_id: lessonId,
      quiz_passed: quizPassed,
      quiz_score: Math.max(score, existing?.quiz_score ?? 0),
      quiz_total: total,
    },
    { onConflict: 'user_id,course_id,lesson_id' },
  );
  if (error) return { ...graded, saved: false, quizPassed: passed, saveError: error.message };

  revalidatePath('/', 'layout');
  return { ...graded, saved: true, quizPassed };
}

// 퀴즈를 통과한 레슨만 완료로 표시한다.
export async function completeLesson({ courseId, lessonId }) {
  if (!getLesson(courseId, lessonId)) return { error: '레슨을 찾을 수 없습니다.' };

  const { supabase, user } = await getSession();
  if (!user) return { error: '로그인이 필요합니다.' };

  const { data, error } = await supabase
    .from('user_progress')
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('lesson_id', lessonId)
    .eq('quiz_passed', true)
    .select('is_completed');

  if (error) return { error: `완료 상태를 저장하지 못했습니다. (${error.message})` };
  if (!data?.length) return { error: '퀴즈를 통과해야 레슨을 완료할 수 있습니다.' };

  revalidatePath('/', 'layout');
  return { isCompleted: true };
}
