import Link from 'next/link';
import { BookIcon, ClockIcon, WrenchIcon } from '@/components/Icons';
import ProgressBar from '@/components/ProgressBar';
import { LEVEL_KEYS, formatMinutes } from '@/lib/format';

// summary가 있으면(로그인 상태) 과정 진도를 함께 표시한다.
export default function CourseCard({ course, step, summary }) {
  const totalMinutes = course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);

  return (
    <Link href={`/courses/${course.id}`} className="course-card">
      <div className="course-card-top">
        <span className="step-badge">STEP {step}</span>
        <span className={`level level-${LEVEL_KEYS[course.level]}`}>{course.level}</span>
      </div>
      <h3>{course.title}</h3>
      <p className="course-card-subtitle">{course.subtitle}</p>
      <p className="course-card-desc">{course.description}</p>
      <div className="meta-row">
        <span>
          <BookIcon size={14} /> 레슨 {course.lessons.length}개
        </span>
        <span>
          <ClockIcon size={14} /> 약 {formatMinutes(totalMinutes)}
        </span>
        {course.project && (
          <span className="project-tag">
            <WrenchIcon size={14} /> {course.project}
          </span>
        )}
      </div>
      {summary && (
        <div className="course-card-progress">
          <ProgressBar percent={summary.percent} label={`${course.title} 진도`} />
          <span>
            {summary.completed}/{summary.total} 완료
          </span>
        </div>
      )}
    </Link>
  );
}
