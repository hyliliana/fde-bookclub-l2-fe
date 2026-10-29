'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ApiError, getMeeting, getMembers, register, cancelRegistration, dateParts, type MeetingDetail, type Member } from '@/lib/api';
import { ArrowIcon, BookIcon, CheckIcon } from './icons';
import { LoadingState, ErrorState } from './states';

export function MeetingDetailView({ id }: { id: string }) {
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState<'register' | 'cancel' | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setLoadError(''); setMissing(false);
    if (new URLSearchParams(window.location.search).get('created') === '1') setNotice('새 모임을 등록했어요. 이제 함께할 참가자를 맞이할 수 있어요.');
    Promise.all([getMeeting(id), getMembers()]).then(([data, people]) => { if (active) { setMeeting(data); setMembers(people); } }).catch((err: Error) => { if (active) { setLoadError(err.message); setMissing(err instanceof ApiError && (err.status === 404 || err.status === 400)); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, attempt]);

  async function act(action: 'register' | 'cancel') {
    if (!meeting || pending) return;
    if (!memberId) { setError('신청할 가상 회원을 먼저 선택해 주세요.'); document.getElementById('memberId')?.focus(); return; }
    setPending(action); setError(''); setNotice('');
    try {
      const updated = await (action === 'register' ? register(meeting.id, Number(memberId)) : cancelRegistration(meeting.id, Number(memberId)));
      setMeeting(updated);
      setNotice(action === 'register' ? '참가 신청을 마쳤어요. 모임에서 만나요!' : '참가 신청을 취소했어요. 다음 모임에서 다시 만나요.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '요청을 처리하지 못했어요. 다시 시도해 주세요.');
      // 다른 참가자가 먼저 신청했다면 최신 정원과 참가 기록을 다시 읽습니다.
      if (err instanceof ApiError && err.status === 409) {
        const latest = await getMeeting(id).catch(() => null);
        if (latest) setMeeting(latest);
      }
    } finally { setPending(null); }
  }

  const when = meeting ? dateParts(meeting.startsAt) : null;
  const mine = meeting?.registrations.find((item) => item.memberId === Number(memberId));
  const isActive = mine?.status === 'active';
  const selectedMember = members.find((member) => member.id === Number(memberId));
  return <div className="meeting-detail-page"><Link className="back-link" href="/"><ArrowIcon back/>모임 목록으로</Link>
    {loading ? <LoadingState message="모임 이야기를 불러오고 있어요"/> : missing ? <section className="state-panel"><h1>이 모임을 찾을 수 없어요</h1><p>목록에서 다른 모임을 살펴보세요.</p><Link href="/" className="button button-primary">모임 목록으로</Link></section> : loadError ? <ErrorState message={loadError} onRetry={() => setAttempt((value) => value + 1)}/> : meeting && when && <>
      <article className="meeting-detail-layout"><div className="meeting-story"><span className={`availability ${meeting.remainingSeats > 0 ? 'available' : 'full'}`}>{meeting.remainingSeats > 0 ? '함께할 수 있어요' : '정원 마감'}</span><h1>{meeting.title}</h1><div className="selected-book"><span className="selected-book-icon"><BookIcon/></span><div><span>함께 읽는 책</span><h2>{meeting.bookTitle}</h2><p>{meeting.bookAuthor} 지음</p></div></div><dl className="meeting-info"><div><dt>만나는 날</dt><dd>{when.full}<br/>{when.time} <small>한국 시간</small></dd></div><div><dt>만나는 곳</dt><dd>{meeting.location}</dd></div><div><dt>함께할 인원</dt><dd>{meeting.capacity}명</dd></div></dl><section className="description-section"><h2>이런 이야기를 나눠요</h2><p>{meeting.description?.trim() || '아직 등록된 모임 소개가 없어요.'}</p></section></div>
        <aside className="registration-panel" aria-labelledby="registration-title"><div className="registration-panel-heading"><span className="eyebrow">함께할 자리</span><h2 id="registration-title">모임 참가 신청</h2></div><div className="seat-summary"><div><strong>{meeting.activeCount}<span> / {meeting.capacity}명</span></strong><p>현재 참가 신청</p></div><span className={`availability ${meeting.remainingSeats > 0 ? 'available' : 'full'}`}>{meeting.remainingSeats > 0 ? `${meeting.remainingSeats}자리 남음` : '정원 마감'}</span></div><div className="seat-progress" role="progressbar" aria-label="정원 대비 신청 인원" aria-valuemin={0} aria-valuemax={meeting.capacity} aria-valuenow={meeting.activeCount}><span style={{ width: `${Math.min(100, meeting.capacity ? meeting.activeCount / meeting.capacity * 100 : 0)}%` }}/></div>
          <div className="field member-field"><label htmlFor="memberId">실습용 가상 회원</label><select id="memberId" value={memberId} onChange={(event) => { setMemberId(event.target.value); setError(''); setNotice(''); }} disabled={!!pending} aria-describedby="member-note"><option value="">회원을 선택해 주세요</option>{members.map((member) => <option key={member.id} value={member.id}>{member.displayName}</option>)}</select><p id="member-note" className="member-note">로그인 없이 가상 회원으로 신청·취소를 체험합니다.</p></div>
          {selectedMember && <div className={`member-status ${isActive ? 'member-active' : ''}`}><span>{selectedMember.displayName}</span><strong>{isActive ? '참가 중' : mine?.status === 'cancelled' ? '취소한 모임' : '신청 전'}</strong></div>}
          {notice && <div className="success-notice registration-notice" role="status"><CheckIcon/><span>{notice}</span></div>}
          {error && <div className="form-error registration-notice" role="alert">{error}</div>}
          <div className="registration-actions"><button className="button button-primary" disabled={!!pending || !memberId || !members.length} onClick={() => act('register')}>{pending === 'register' ? <><span className="spinner small"/>신청하는 중…</> : '참가 신청하기'}</button>{isActive && <button className="button button-outline" disabled={!!pending} onClick={() => act('cancel')}>{pending === 'cancel' ? '취소하는 중…' : '참가 신청 취소'}</button>}</div>
          <p className="registration-rule">정원이 차거나 같은 모임에 이미 신청했다면 신청되지 않아요. 취소하면 다른 사람이 신청할 수 있어요.</p>
        </aside>
      </article>
    </>}
  </div>;
}
