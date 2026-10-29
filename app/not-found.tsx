import Link from 'next/link';
export default function NotFound() { return <section className="state-panel"><h1>페이지를 찾을 수 없어요</h1><p>모임 목록에서 다시 찾아 주세요.</p><Link className="button button-primary" href="/">모임 목록으로</Link></section>; }
