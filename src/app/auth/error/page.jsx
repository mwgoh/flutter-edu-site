import Link from 'next/link';

export const metadata = { title: '인증 오류' };

export default async function AuthErrorPage({ searchParams }) {
  const { message } = await searchParams;

  return (
    <div className="container center-page">
      <h1>인증을 완료하지 못했습니다</h1>
      <p>{typeof message === 'string' ? message : '알 수 없는 오류가 발생했습니다.'}</p>
      <p>인증 링크가 만료되었거나 이미 사용되었을 수 있습니다. 다시 로그인하거나 회원가입을 시도해 주세요.</p>
      <div className="actions">
        <Link href="/login" className="btn btn-primary">
          로그인 페이지로
        </Link>
      </div>
    </div>
  );
}
