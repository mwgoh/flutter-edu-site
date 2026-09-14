import Link from 'next/link';
import CourseCard from '@/components/CourseCard';
import { allLessons, courses, lessonHref, totalLessonCount } from '@/lib/content';
import { getProgress, progressKey, summarizeCourse } from '@/lib/progress';

const totalMinutes = allLessons.reduce((sum, { lesson }) => sum + lesson.minutes, 0);
const projectCount = courses.filter((course) => course.project).length;

export default async function HomePage() {
  const { user, progress } = await getProgress();

  const isDone = ({ course, lesson }) => progress.get(progressKey(course.id, lesson.id))?.is_completed;
  const hasStarted = user && allLessons.some(isDone);
  const nextItem = allLessons.find((item) => !isDone(item)) ?? allLessons[0];

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">docs.flutter.dev 공식 학습 경로 기반</p>
          <h1>
            하나의 코드로 모든 화면을.
            <br />
            Flutter를 처음부터 차근차근.
          </h1>
          <p className="hero-desc">
            설치와 Dart 기초부터 위젯, 상태 관리, 적응형 UI, 테스트와 배포까지. 공식 문서의 Learn 경로를 한국어
            강의와 퀴즈로 따라가며 실습 앱 {projectCount}개를 직접 완성합니다.
          </p>
          <div className="actions">
            <Link href={lessonHref(nextItem.course.id, nextItem.lesson.id)} className="btn btn-light btn-lg">
              {hasStarted ? '이어서 학습하기' : '첫 레슨 시작하기'}
            </Link>
            <Link href="#curriculum" className="btn btn-outline-light btn-lg">
              커리큘럼 보기
            </Link>
          </div>
          <dl className="hero-stats">
            <div>
              <dt>과정</dt>
              <dd>{courses.length}</dd>
            </div>
            <div>
              <dt>레슨</dt>
              <dd>{totalLessonCount}</dd>
            </div>
            <div>
              <dt>실습 앱</dt>
              <dd>{projectCount}</dd>
            </div>
            <div>
              <dt>총 학습 시간</dt>
              <dd>약 {Math.round(totalMinutes / 60)}시간</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="curriculum" className="container section">
        <div className="section-head">
          <h2>커리큘럼</h2>
          <p>STEP 1부터 순서대로 학습하길 권장합니다. 각 레슨은 본문, 공식 문서 원문 링크, 확인 퀴즈로 구성됩니다.</p>
        </div>
        <div className="course-grid">
          {courses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              step={index + 1}
              summary={user ? summarizeCourse(course, progress) : null}
            />
          ))}
        </div>
      </section>

      <section className="container">
        <div className="section-head">
          <h2>학습 방법</h2>
        </div>
        <ol className="how-steps">
          <li>
            <strong>레슨 읽기</strong>
            공식 튜토리얼의 흐름을 따라 개념과 코드를 익힙니다.
          </li>
          <li>
            <strong>직접 실습</strong>
            코드 블록을 복사해 내 컴퓨터에서 실행하고 핫 리로드로 바꿔 봅니다.
          </li>
          <li>
            <strong>퀴즈 통과</strong>
            모든 문항을 맞히면 레슨을 완료로 표시할 수 있습니다.
          </li>
          <li>
            <strong>진도 확인</strong>
            대시보드에서 과정별 진행률과 다음 레슨을 확인합니다.
          </li>
        </ol>
      </section>
    </>
  );
}
