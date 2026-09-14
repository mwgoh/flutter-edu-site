import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { courses } from '@/content/curriculum';

export { courses };

// 전체 레슨을 학습 순서대로 평탄화한 목록
export const allLessons = courses.flatMap((course) =>
  course.lessons.map((lesson) => ({ course, lesson })),
);

export const totalLessonCount = allLessons.length;

export function getCourse(courseId) {
  return courses.find((course) => course.id === courseId) ?? null;
}

export function getLesson(courseId, lessonId) {
  const course = getCourse(courseId);
  const index = course ? course.lessons.findIndex((lesson) => lesson.id === lessonId) : -1;
  if (index === -1) return null;
  return { course, lesson: course.lessons[index], index };
}

export function getAdjacentLessons(courseId, lessonId) {
  const i = allLessons.findIndex((item) => item.course.id === courseId && item.lesson.id === lessonId);
  return { prev: allLessons[i - 1] ?? null, next: allLessons[i + 1] ?? null };
}

export function lessonHref(courseId, lessonId) {
  return `/courses/${courseId}/${lessonId}`;
}

// getLesson()으로 존재를 확인한 id만 넘겨야 한다(경로 조작 방지).
export async function readLessonMarkdown(courseId, lessonId) {
  const filePath = path.join(process.cwd(), 'src', 'content', 'lessons', courseId, `${lessonId}.md`);
  return readFile(filePath, 'utf8');
}

// 클라이언트로 보낼 퀴즈: 정답과 해설을 제거한다.
export function toPublicQuiz(quiz) {
  return quiz.map(({ question, options }) => ({ question, options }));
}
