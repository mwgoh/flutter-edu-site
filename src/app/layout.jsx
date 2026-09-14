import { cookies } from 'next/headers';
import Navbar from '@/components/Navbar';
import { THEME_COOKIE, parseTheme } from '@/lib/theme';
import './globals.css';

export const metadata = {
  title: {
    default: 'Flutter Edu · Flutter 개발 교육',
    template: '%s · Flutter Edu',
  },
  description:
    'docs.flutter.dev 공식 학습 경로를 바탕으로 한 한국어 Flutter 교육 사이트. 강의, 퀴즈, 학습 진도 관리를 제공합니다.',
};

export default async function RootLayout({ children }) {
  // 쿠키의 테마를 서버에서 반영해 첫 화면부터 선택한 테마로 그린다.
  // 'system'이면 data-theme을 두지 않고 CSS의 prefers-color-scheme을 따른다.
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <html lang="ko" data-theme={theme === 'system' ? undefined : theme}>
      <body>
        <Navbar theme={theme} />
        <main className="site-main">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>
              강의 내용은{' '}
              <a href="https://docs.flutter.dev" target="_blank" rel="noreferrer">
                Flutter 공식 문서(docs.flutter.dev)
              </a>
              를 참고해 한국어로 재구성했습니다.
            </p>
            <p>원문 문서는 CC BY 4.0, 코드 샘플은 BSD-3-Clause 라이선스를 따릅니다. Flutter는 Google LLC의 상표입니다.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
