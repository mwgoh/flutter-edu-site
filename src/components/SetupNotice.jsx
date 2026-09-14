// Supabase 설정이 끝나지 않았을 때 보여 주는 안내
export default function SetupNotice({ variant = 'env', detail }) {
  if (variant === 'table') {
    return (
      <div className="notice notice-warning" role="status">
        <strong>진도 데이터를 불러오지 못했습니다.</strong>
        <p>
          Supabase에 <code>user_progress</code> 테이블이 없거나 접근 권한이 없습니다.{' '}
          <code>supabase/migrations/20260914000000_create_user_progress.sql</code>을 Supabase 대시보드의
          SQL Editor에서 실행해 주세요.
        </p>
        {detail && <p className="notice-detail">오류: {detail}</p>}
      </div>
    );
  }

  return (
    <div className="notice notice-warning" role="status">
      <strong>Supabase 환경 변수가 설정되지 않았습니다.</strong>
      <p>
        강의는 열람할 수 있지만 로그인과 진도 저장은 사용할 수 없습니다. <code>.env.example</code>을 참고해{' '}
        <code>.env.local</code>에 <code>NEXT_PUBLIC_SUPABASE_URL</code>과 키를 입력한 뒤 개발 서버를 다시
        시작해 주세요.
      </p>
    </div>
  );
}
