import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container center-page">
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>주소가 바뀌었거나 존재하지 않는 강의입니다.</p>
      <div className="actions">
        <Link href="/" className="btn btn-primary">
          커리큘럼으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
