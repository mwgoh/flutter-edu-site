import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRightIcon } from '@/components/Icons';
import ProgressBar from '@/components/ProgressBar';
import SetupNotice from '@/components/SetupNotice';
import { allLessons, courses, getLesson, lessonHref, totalLessonCount } from '@/lib/content';
import { hasEnvVars } from '@/lib/env';
import { formatDate } from '@/lib/format';
import { getProgress, progressKey, summarizeCourse } from '@/lib/progress';

export const metadata = { title: '대시보드' };

export default async function DashboardPage() {
  if (!hasEnvVars) {
    return (
      <div className="container section">
        <SetupNotice />
      </div>
    );
  }

  const { user, progress, error } = await getProgress();
  if (!user) redirect('/login?next=/dashboard');

  const rows = [...progress.values()];
  const completedCount = rows.filter((row) => row.is_completed).length;
  const passedCount = rows.filter((row) => row.quiz_passed).length;
  const overallPercent = Math.round((completedCount / totalLessonCount) * 100);

  const courseSummaries = courses.map((course) => ({ course, ...summarizeCourse(course, progress) }));
  const finishedCourses = courseSummaries.filter((item) => item.completed === item.total).length;

  const nextItem = allLessons.find(({ course, lesson }) => !progress.get(progressKey(course.id, lesson.id))?.is_completed);

  const recent = rows
    .filter((row) => row.is_completed && row.completed_at)
    .sort((a, b) => b.completed_at.localeCompare(a.completed_at))
    .slice(0, 6)
    .map((row) => ({ row, found: getLesson(row.course_id, row.lesson_id) }))
    .filter(({ found }) => found);

  return (
    <div className="container section">
      <header className="dash-head">
        <h1>학습 대시보드</h1>
        <p>{user.email} 님의 학습 현황입니다.</p>
      </header>

      {error && <SetupNotice variant="table" detail={error} />}

      <div className="stat-grid">
        <div className="card">
          <div className="stat-label">전체 진도율</div>
          <div className="stat-value">{overallPercent}%</div>
          <ProgressBar percent={overallPercent} label="전체 진도율" />
        </div>
        <div className="card">
          <div className="stat-label">완료한 레슨</div>
          <div className="stat-value">
            {completedCount} <small>/ {totalLessonCount}</small>
          </div>
        </div>
        <div className="card">
          <div className="stat-label">통과한 퀴즈</div>
          <div className="stat-value">
            {passedCount} <small>/ {totalLessonCount}</small>
          </div>
        </div>
        <div className="card">
          <div className="stat-label">완료한 과정</div>
          <div className="stat-value">
            {finishedCourses} <small>/ {courses.length}</small>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div>
          <section className="card continue-card">
            {nextItem ? (
              <>
                <small>
                  {completedCount > 0 ? '이어서 학습하기' : '학습 시작하기'} · {nextItem.course.title}
                </small>
                <h2>{nextItem.lesson.title}</h2>
                <p>{nextItem.lesson.summary}</p>
                <Link href={lessonHref(nextItem.course.id, nextItem.lesson.id)} className="btn btn-light">
                  레슨 열기 <ArrowRightIcon size={15} />
                </Link>
              </>
            ) : (
              <>
                <small>모든 과정 완료</small>
                <h2>축하합니다! 전체 커리큘럼을 마쳤습니다.</h2>
                <p>공식 문서의 Cookbook과 샘플 앱으로 실력을 더 넓혀 보세요.</p>
                <a href="https://docs.flutter.dev/cookbook" target="_blank" rel="noreferrer" className="btn btn-light">
                  Flutter Cookbook 보기
                </a>
              </>
            )}
          </section>

          <section className="card" aria-labelledby="course-progress-title">
            <h2 id="course-progress-title">과정별 진도</h2>
            <ul className="course-progress-list">
              {courseSummaries.map(({ course, completed, total, percent }, index) => (
                <li key={course.id}>
                  <div className="course-progress-row">
                    <Link href={`/courses/${course.id}`}>
                      STEP {index + 1}. {course.title}
                    </Link>
                    <span>
                      {completed}/{total} · {percent}%
                    </span>
                  </div>
                  <ProgressBar percent={percent} label={`${course.title} 진도`} />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="card" aria-labelledby="recent-title">
          <h2 id="recent-title">최근 완료한 레슨</h2>
          {recent.length === 0 ? (
            <p className="empty">아직 완료한 레슨이 없습니다. 퀴즈를 통과하고 첫 레슨을 완료해 보세요!</p>
          ) : (
            <ul className="recent-list">
              {recent.map(({ row, found }) => (
                <li key={`${row.course_id}/${row.lesson_id}`}>
                  <Link href={lessonHref(found.course.id, found.lesson.id)}>
                    <span>{found.lesson.title}</span>
                    <time dateTime={row.completed_at}>{formatDate(row.completed_at)}</time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
