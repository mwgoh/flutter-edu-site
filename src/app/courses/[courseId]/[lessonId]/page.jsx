import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ClockIcon, ExternalIcon } from '@/components/Icons';
import LessonContent from '@/components/LessonContent';
import LessonQuiz from '@/components/LessonQuiz';
import ProgressBar from '@/components/ProgressBar';
import SetupNotice from '@/components/SetupNotice';
import { courses, getAdjacentLessons, getLesson, lessonHref, readLessonMarkdown, toPublicQuiz } from '@/lib/content';
import { hasEnvVars } from '@/lib/env';
import { getProgress, progressKey, summarizeCourse } from '@/lib/progress';

export async function generateMetadata({ params }) {
  const { courseId, lessonId } = await params;
  const found = getLesson(courseId, lessonId);
  return found ? { title: `${found.lesson.title} | ${found.course.title}`, description: found.lesson.summary } : {};
}

export default async function LessonPage({ params }) {
  const { courseId, lessonId } = await params;
  const found = getLesson(courseId, lessonId);
  if (!found) notFound();

  const { course, lesson, index } = found;
  const [markdown, { user, progress, error }] = await Promise.all([
    readLessonMarkdown(course.id, lesson.id),
    getProgress(),
  ]);

  const row = progress.get(progressKey(course.id, lesson.id));
  const { prev, next } = getAdjacentLessons(course.id, lesson.id);
  const step = courses.indexOf(course) + 1;
  const summary = summarizeCourse(course, progress);
  const href = lessonHref(course.id, lesson.id);

  return (
    <div className="container lesson-layout">
      <aside className="lesson-sidebar" aria-label="과정 레슨 목록">
        <p className="sidebar-label">STEP {step}</p>
        <Link href={`/courses/${course.id}`} className="sidebar-course">
          {course.title}
        </Link>
        {user && (
          <div className="sidebar-progress">
            <ProgressBar percent={summary.percent} label={`${course.title} 진도`} />
            <span>
              {summary.completed}/{summary.total}
            </span>
          </div>
        )}
        <ol className="sidebar-lessons">
          {course.lessons.map((item, i) => {
            const itemRow = progress.get(progressKey(course.id, item.id));
            const status = itemRow?.is_completed ? 'done' : itemRow?.quiz_passed ? 'passed' : '';
            return (
              <li key={item.id}>
                <Link
                  href={lessonHref(course.id, item.id)}
                  aria-current={item.id === lesson.id ? 'page' : undefined}
                >
                  <span className={`sidebar-dot ${status}`}>{status === 'done' ? <CheckIcon size={12} /> : i + 1}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </aside>

      <article className="lesson-main">
        <nav className="breadcrumb" aria-label="현재 위치">
          <Link href="/">홈</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/courses/${course.id}`}>{course.title}</Link>
          <span aria-hidden="true">/</span>
          <span>레슨 {index + 1}</span>
        </nav>

        <header className="lesson-header">
          <p className="eyebrow">
            레슨 {index + 1} / {course.lessons.length}
          </p>
          <h1>{lesson.title}</h1>
          <p className="lead">{lesson.summary}</p>
          <div className="lesson-meta-row">
            <span>
              <ClockIcon size={14} /> 약 {lesson.minutes}분
            </span>
            <a href={lesson.sourceUrl} target="_blank" rel="noreferrer">
              공식 문서 원문 <ExternalIcon size={13} />
            </a>
            {row?.is_completed && (
              <span className="badge-done">
                <CheckIcon size={14} /> 완료한 레슨
              </span>
            )}
          </div>
        </header>

        <section className="goals" aria-labelledby="goals-title">
          <h2 id="goals-title">학습 목표</h2>
          <ul>
            {lesson.goals.map((goal) => (
              <li key={goal}>
                <CheckIcon size={14} />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </section>

        <LessonContent markdown={markdown} />

        {!hasEnvVars && <SetupNotice />}
        {error && <SetupNotice variant="table" detail={error} />}

        <LessonQuiz
          courseId={course.id}
          lessonId={lesson.id}
          questions={toPublicQuiz(lesson.quiz)}
          canSave={hasEnvVars}
          isLoggedIn={Boolean(user)}
          initialQuizPassed={Boolean(row?.quiz_passed)}
          initialCompleted={Boolean(row?.is_completed)}
          loginHref={`/login?next=${encodeURIComponent(href)}`}
          nextLesson={next ? { href: lessonHref(next.course.id, next.lesson.id), title: next.lesson.title } : null}
        />

        <nav className="pager" aria-label="이전·다음 레슨">
          {prev && (
            <Link href={lessonHref(prev.course.id, prev.lesson.id)}>
              <small>
                <ArrowLeftIcon size={13} /> 이전 레슨
              </small>
              <strong>{prev.lesson.title}</strong>
            </Link>
          )}
          {next && (
            <Link href={lessonHref(next.course.id, next.lesson.id)} className="pager-next">
              <small>
                다음 레슨 <ArrowRightIcon size={13} />
              </small>
              <strong>{next.lesson.title}</strong>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
