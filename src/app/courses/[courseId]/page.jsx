import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckIcon, ClockIcon, ExternalIcon } from '@/components/Icons';
import ProgressBar from '@/components/ProgressBar';
import SetupNotice from '@/components/SetupNotice';
import { courses, getCourse, lessonHref } from '@/lib/content';
import { LEVEL_KEYS, formatMinutes } from '@/lib/format';
import { getProgress, progressKey, summarizeCourse } from '@/lib/progress';

export async function generateMetadata({ params }) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  return course ? { title: course.title, description: course.description } : {};
}

export default async function CoursePage({ params }) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const { user, progress, error } = await getProgress();
  const step = courses.indexOf(course) + 1;
  const summary = summarizeCourse(course, progress);
  const totalMinutes = course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
  const nextLesson =
    course.lessons.find((lesson) => !progress.get(progressKey(course.id, lesson.id))?.is_completed) ??
    course.lessons[0];

  return (
    <div className="container section">
      <nav className="breadcrumb" aria-label="현재 위치">
        <Link href="/">홈</Link>
        <span aria-hidden="true">/</span>
        <Link href="/#curriculum">커리큘럼</Link>
        <span aria-hidden="true">/</span>
        <span>STEP {step}</span>
      </nav>

      <header className="course-header">
        <div>
          <div className="chips">
            <span className="step-badge">STEP {step}</span>
            <span className={`level level-${LEVEL_KEYS[course.level]}`}>{course.level}</span>
          </div>
          <h1>{course.title}</h1>
          <p className="lead">{course.subtitle}</p>
          <p className="course-desc">{course.description}</p>
          <div className="meta-row" style={{ marginBottom: 20 }}>
            <span>레슨 {course.lessons.length}개</span>
            <span>
              <ClockIcon size={14} /> 약 {formatMinutes(totalMinutes)}
            </span>
            {course.project && <span>실습 프로젝트: {course.project}</span>}
          </div>
          <div className="actions">
            <Link href={lessonHref(course.id, nextLesson.id)} className="btn btn-primary">
              {summary.completed > 0 ? '이어서 학습하기' : '과정 시작하기'}
            </Link>
            <a href={course.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
              공식 문서 원문 <ExternalIcon size={14} />
            </a>
          </div>
        </div>

        <aside className="card progress-card">
          {user ? (
            <>
              <p className="big">{summary.percent}%</p>
              <ProgressBar percent={summary.percent} label={`${course.title} 진도`} />
              <p>
                레슨 {summary.total}개 중 {summary.completed}개 완료
              </p>
            </>
          ) : (
            <>
              <strong>진도를 기록하려면 로그인하세요</strong>
              <p>퀴즈 결과와 레슨 완료 기록이 저장되고, 대시보드에서 진행률을 확인할 수 있습니다.</p>
              <div className="actions" style={{ marginTop: 14 }}>
                <Link href={`/login?next=${encodeURIComponent(`/courses/${course.id}`)}`} className="btn btn-secondary btn-sm">
                  로그인
                </Link>
              </div>
            </>
          )}
        </aside>
      </header>

      {error && <SetupNotice variant="table" detail={error} />}

      <ol className="lesson-list">
        {course.lessons.map((lesson, index) => {
          const row = progress.get(progressKey(course.id, lesson.id));
          const status = row?.is_completed ? 'done' : row?.quiz_passed ? 'passed' : 'todo';

          return (
            <li key={lesson.id}>
              <Link href={lessonHref(course.id, lesson.id)} className={`lesson-item status-${status}`}>
                <span className="lesson-num">{status === 'done' ? <CheckIcon size={18} /> : index + 1}</span>
                <div>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.summary}</p>
                </div>
                <div className="lesson-item-meta">
                  <span>{lesson.minutes}분</span>
                  {status === 'done' && <span className="status-label done">완료</span>}
                  {status === 'passed' && <span className="status-label passed">퀴즈 통과</span>}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
