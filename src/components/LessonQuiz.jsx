'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { completeLesson, submitQuiz } from '@/app/courses/actions';
import { ArrowRightIcon, CheckIcon } from '@/components/Icons';

// 문항 텍스트의 `백틱` 구간을 <code>로 표시한다.
function InlineText({ text }) {
  return text
    .split(/(`[^`]+`)/)
    .map((part, i) => (part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part));
}

export default function LessonQuiz({
  courseId,
  lessonId,
  questions,
  canSave,
  isLoggedIn,
  initialQuizPassed,
  initialCompleted,
  loginHref,
  nextLesson,
}) {
  const [answers, setAnswers] = useState(() => questions.map(() => null));
  const [result, setResult] = useState(null);
  const [quizPassed, setQuizPassed] = useState(initialQuizPassed);
  const [completed, setCompleted] = useState(initialCompleted);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPending, startTransition] = useTransition();

  const allAnswered = answers.every((answer) => answer !== null);

  function choose(questionIndex, optionIndex) {
    setAnswers((prev) => prev.map((value, i) => (i === questionIndex ? optionIndex : value)));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!allAnswered) return;
    setErrorMessage(null);

    startTransition(async () => {
      const response = await submitQuiz({ courseId, lessonId, answers });
      if (response.error) {
        setErrorMessage(response.error);
        return;
      }
      setResult(response);
      if (response.saved) setQuizPassed(response.quizPassed);
      if (response.saveError) setErrorMessage(`결과를 저장하지 못했습니다. (${response.saveError})`);
    });
  }

  function handleRetry() {
    setAnswers(questions.map(() => null));
    setResult(null);
    setErrorMessage(null);
  }

  function handleComplete() {
    setErrorMessage(null);
    startTransition(async () => {
      const response = await completeLesson({ courseId, lessonId });
      if (response.error) {
        setErrorMessage(response.error);
        return;
      }
      setCompleted(true);
    });
  }

  return (
    <section className="quiz" aria-labelledby="quiz-title">
      <div className="quiz-head">
        <h2 id="quiz-title">확인 퀴즈</h2>
        <p>{questions.length}문항 · 모두 맞히면 통과</p>
      </div>

      {completed && !result && (
        <div className="quiz-result pass">
          <CheckIcon size={20} />
          <div>
            <strong>이미 완료한 레슨입니다.</strong>
            <p>복습 삼아 퀴즈를 다시 풀어 볼 수 있습니다.</p>
          </div>
        </div>
      )}

      {result && (
        <div className={`quiz-result ${result.passed ? 'pass' : 'fail'}`} role="status">
          <div>
            <strong>
              {result.passed ? '통과했습니다!' : '아쉽지만 통과하지 못했습니다.'} ({result.score}/{result.total})
            </strong>
            <p>
              {!result.passed
                ? '해설을 읽고 본문을 다시 확인한 뒤 재도전해 보세요.'
                : result.saved
                  ? '퀴즈 결과가 저장되었습니다.'
                  : isLoggedIn
                    ? '결과를 저장하지 못했습니다.'
                    : '로그인하면 결과를 저장하고 레슨을 완료할 수 있습니다.'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {questions.map((question, qi) => {
          const graded = result?.results[qi];
          return (
            <fieldset key={qi} className="quiz-question" disabled={Boolean(result) || isPending}>
              <legend>
                <span className="q-num">Q{qi + 1}.</span>
                <InlineText text={question.question} />
              </legend>
              <div className="quiz-options">
                {question.options.map((option, oi) => {
                  const selected = answers[qi] === oi;
                  let state = selected ? 'selected' : '';
                  if (graded) state = oi === graded.answer ? 'correct' : selected ? 'incorrect' : '';

                  return (
                    <label key={oi} className={`quiz-option ${state} ${graded ? 'locked' : ''}`}>
                      <input
                        type="radio"
                        name={`question-${qi}`}
                        checked={selected}
                        onChange={() => choose(qi, oi)}
                      />
                      <span>
                        <InlineText text={option} />
                      </span>
                      {graded && oi === graded.answer && <span className="option-tag">정답</span>}
                      {graded && selected && !graded.correct && <span className="option-tag">내 답</span>}
                    </label>
                  );
                })}
              </div>
              {graded && (
                <p className="quiz-explanation">
                  <strong>{graded.correct ? '정답' : '오답'}</strong>
                  {graded.explanation}
                </p>
              )}
            </fieldset>
          );
        })}

        {errorMessage && (
          <p className="form-message error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="actions">
          {result ? (
            <button type="button" className="btn btn-secondary" onClick={handleRetry}>
              다시 풀기
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={!allAnswered || isPending}>
              {isPending ? '채점 중…' : '채점하기'}
            </button>
          )}
        </div>
      </form>

      <div className="completion">
        {!canSave ? (
          <p>Supabase를 설정하면 퀴즈 결과와 완료 기록을 저장할 수 있습니다.</p>
        ) : !isLoggedIn ? (
          <>
            <p>로그인하면 퀴즈 결과와 레슨 완료 기록이 저장됩니다.</p>
            <Link href={loginHref} className="btn btn-secondary">
              로그인하고 진도 저장
            </Link>
          </>
        ) : completed ? (
          <>
            <p className="done">
              <CheckIcon size={18} /> 이 레슨을 완료했습니다.
            </p>
            {nextLesson && (
              <Link href={nextLesson.href} className="btn btn-primary">
                다음 레슨: {nextLesson.title} <ArrowRightIcon size={15} />
              </Link>
            )}
          </>
        ) : (
          <>
            <p>
              {quizPassed ? '퀴즈를 통과했습니다. 레슨을 완료로 표시하세요.' : '퀴즈를 모두 맞히면 레슨을 완료할 수 있습니다.'}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleComplete}
              disabled={!quizPassed || isPending}
            >
              <CheckIcon size={16} /> 학습 완료
            </button>
          </>
        )}
      </div>
    </section>
  );
}
