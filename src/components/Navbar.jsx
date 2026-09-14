import Link from 'next/link';
import { signOut } from '@/app/auth/actions';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { getSession } from '@/lib/supabase/server';

export default async function Navbar({ theme }) {
  const { user } = await getSession();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand">
          <Logo />
          <span>Flutter Edu</span>
        </Link>
        <nav className="nav-links" aria-label="주요 메뉴">
          <Link href="/#curriculum" className="nav-link nav-link-optional">
            커리큘럼
          </Link>
          <ThemeToggle initialTheme={theme} />
          {user ? (
            <>
              <Link href="/dashboard" className="nav-link">
                대시보드
              </Link>
              <span className="nav-email" title={user.email}>
                {user.email}
              </span>
              <form action={signOut}>
                <button type="submit" className="btn btn-ghost btn-sm">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
