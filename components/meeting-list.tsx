'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { getMeetings, getStats, dateParts, type Meeting, type Stats } from '@/lib/api';
import { ArrowIcon, BookIcon, PlusIcon } from './icons';
import { LoadingState, ErrorState } from './states';

export function MeetingList() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    Promise.all([getMeetings(search), getStats()]).then(([rows, summary]) => { if (active) { setMeetings(rows); setStats(summary); } }).catch((err: Error) => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [search, attempt]);
  function submitSearch(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSearch(query.trim()); setAttempt((value) => value + 1); }
  function clearSearch() { setQuery(''); setSearch(''); }
  return <>
    <section className="page-heading library-heading"><div><p className="eyebrow">우리의 모임</p><h1>함께 읽고,<br className="mobile-break"/> 더 넓게 이야기해요</h1><p className="page-intro">책 한 권을 사이에 두고 만나는 우리의 시간.</p></div><span className="intro-note">같은 책을 읽고<br/>서로 다른 생각을 나눠요.</span></section>
    <section className="stats-strip" aria-label="전체 모임 현황"><div><span>전체 모임</span><strong>{loading || error ? '—' : stats?.totalMeetings ?? '—'}<small>개</small></strong></div><div><span>현재 참가 신청</span><strong>{loading || error ? '—' : stats?.activeRegistrations ?? '—'}<small>건</small></strong></div><div><span>함께할 수 있는 자리</span><strong>{loading || error ? '—' : stats?.remainingSeats ?? '—'}<small>석</small></strong></div></section>
    <section aria-labelledby="meetings-heading">
      <div className="section-bar meeting-section-bar"><h2 id="meetings-heading">{search ? '검색한 모임' : '함께할 모임'}{!loading && !error && <span className="book-count">{meetings.length}</span>}</h2><form className="search-form" role="search" onSubmit={submitSearch}><label className="visually-hidden" htmlFor="meeting-search">모임명 또는 책 이름 검색</label><input id="meeting-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="모임명 또는 책 이름" maxLength={120}/><button className="button button-outline" type="submit">검색</button></form></div>
      {search && <div className="search-summary"><span>“{search}” 검색 결과</span><button className="text-link" onClick={clearSearch}>전체 모임 보기</button></div>}
      {loading ? <LoadingState/> : error ? <ErrorState message={error} onRetry={() => setAttempt((value) => value + 1)}/> : !meetings.length ? <div className="state-panel"><BookIcon/><h2>{search ? '일치하는 모임이 없어요' : '첫 모임을 기다리고 있어요'}</h2><p>{search ? '다른 모임명이나 책 이름으로 검색해 보세요.' : '함께 읽을 책과 만날 시간을 정해 모임을 열어 보세요.'}</p>{search ? <button className="button button-outline" onClick={clearSearch}>전체 모임 보기</button> : <Link href="/meetings/new" className="button button-primary"><PlusIcon/>모임 등록하기</Link>}</div> : <ul className="meeting-grid">{meetings.map((meeting) => {
        const when = dateParts(meeting.startsAt);
        return <li key={meeting.id}><Link href={`/meetings/${meeting.id}`} className="meeting-card"><div className="meeting-card-top"><div className="date-tile" aria-label={when.full}><span>{when.month}</span><strong>{when.day}</strong></div><span className={`availability ${meeting.remainingSeats > 0 ? 'available' : 'full'}`}>{meeting.remainingSeats > 0 ? `${meeting.remainingSeats}자리 남음` : '정원 마감'}</span></div><h3>{meeting.title}</h3><p className="meeting-book-title"><BookIcon/>{meeting.bookTitle}</p><dl className="meeting-meta"><div><dt>일시</dt><dd>{when.full}<br/>{when.time}</dd></div><div><dt>장소</dt><dd>{meeting.location}</dd></div></dl><div className="meeting-card-bottom"><span>참가 {meeting.activeCount} / {meeting.capacity}명</span><span className="text-link">모임 살펴보기 <ArrowIcon/></span></div></Link></li>;
      })}</ul>}
    </section>
  </>;
}
