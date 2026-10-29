import type { Metadata } from 'next';
import Link from 'next/link';
import { BookIcon, PlusIcon } from '@/components/icons';
import './globals.css';

export const metadata: Metadata = { title: { default: '독서모임 신청 · 책으로 만나는 우리', template: '%s · 독서모임 신청' }, description: '함께 읽을 책과 모임을 살펴보고 독서모임에 참여해 보세요.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>
    <a className="skip-link" href="#main">본문으로 건너뛰기</a>
    <header className="site-header"><div className="header-inner"><Link href="/" className="brand" aria-label="독서모임 신청, 모임 목록으로"><span className="brand-symbol"><BookIcon /></span><span className="brand-name">독서모임 신청<span className="brand-description">한 권의 책으로, 함께 만나는 시간</span></span></Link><nav aria-label="주 메뉴"><Link className="header-library" href="/">우리의 모임</Link><Link className="button button-primary header-add" href="/meetings/new"><PlusIcon />모임 등록</Link></nav></div></header>
    <main id="main" className="main-shell">{children}</main>
    <footer className="site-footer"><span>독서모임 신청</span><p>가상 도서와 회원으로 신청·취소를 체험하는 실습 공간입니다.</p></footer>
  </body></html>;
}
