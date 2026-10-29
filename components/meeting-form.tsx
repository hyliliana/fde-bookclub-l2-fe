'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { ApiError, getBooks, createMeeting, type Book, type FieldErrors, type NewMeeting } from '@/lib/api';
import { ArrowIcon, BookIcon, PlusIcon } from './icons';

type FormValues = { bookId: string; title: string; startsAt: string; location: string; capacity: string; description: string };
export function MeetingForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({ bookId: '', title: '', startsAt: '', location: '', capacity: '6', description: '' });
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  useEffect(() => {
    let active = true; setBooksLoading(true); setBooksError('');
    getBooks().then((data) => { if (active) { setBooks(data); if (!data.length) setBooksError('선택할 수 있는 책이 아직 없어요. 잠시 후 다시 확인해 주세요.'); } }).catch((err: Error) => { if (active) setBooksError(err.message); }).finally(() => { if (active) setBooksLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  function update(field: keyof FormValues, value: string) { setValues((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending || booksLoading || booksError) return;
    const nextErrors: FieldErrors = {};
    const meetingDate = new Date(`${values.startsAt}:00+09:00`);
    const capacity = Number(values.capacity);
    if (!values.title.trim()) nextErrors.title = '모임 이름을 입력해 주세요.';
    else if (values.title.trim().length > 120) nextErrors.title = '모임 이름은 120자 이내로 입력해 주세요.';
    if (!books.some((book) => book.id === Number(values.bookId))) nextErrors.bookId = '함께 읽을 책을 선택해 주세요.';
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(values.startsAt) || Number.isNaN(meetingDate.getTime())) nextErrors.startsAt = '모임 날짜와 시간을 입력해 주세요.';
    if (!values.location.trim()) nextErrors.location = '만날 장소를 입력해 주세요.';
    else if (values.location.trim().length > 200) nextErrors.location = '장소는 200자 이내로 입력해 주세요.';
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 50) nextErrors.capacity = '정원은 1~50명 사이의 정수로 입력해 주세요.';
    if (values.description.trim().length > 2000) nextErrors.description = '모임 소개는 2,000자 이내로 입력해 주세요.';
    setErrors(nextErrors); setError('');
    if (Object.keys(nextErrors).length) { setError('입력한 내용을 한 번 더 확인해 주세요.'); document.getElementById(Object.keys(nextErrors)[0])?.focus(); return; }
    const data: NewMeeting = { bookId: Number(values.bookId), title: values.title.trim(), startsAt: meetingDate.toISOString(), location: values.location.trim(), capacity, description: values.description.trim() };
    setPending(true);
    try { const saved = await createMeeting(data); router.push(`/meetings/${saved.id}?created=1`); router.refresh(); }
    catch (err) { if (err instanceof ApiError) { setErrors(err.fieldErrors); setError(err.message); document.getElementById(Object.keys(err.fieldErrors)[0] || 'form-error')?.focus(); } else setError('모임을 등록하지 못했어요. 입력 내용은 그대로 있으니 다시 시도해 주세요.'); setPending(false); }
  }
  const fieldError = (field: keyof FormValues) => errors[field] ? <p className="field-error" id={`${field}-error`}>{errors[field]}</p> : null;
  return <div className="form-page"><Link href="/" className="back-link"><ArrowIcon back/>모임 목록으로</Link><div className="form-layout"><aside className="form-intro"><span className="eyebrow">우리의 다음 약속</span><h1>책 한 권으로{' '}<br/>모임을 열어 보세요.</h1><p>함께 읽을 책과 만날 시간,<br className="desktop-break"/>나누고 싶은 이야기를 정해 주세요.</p><div className="form-note"><BookIcon/><p>실습용 모임을 자유롭게 등록해 보세요.<br/>실제 개인정보는 적지 않아도 됩니다.</p></div></aside>
    <form className="book-form" onSubmit={submit} noValidate aria-busy={pending}><div className="form-section-heading"><h2>모임 정보</h2><span><b aria-hidden="true">*</b> 필수 입력</span></div>{error && <div id="form-error" className="form-error" role="alert" tabIndex={-1}>{error}</div>}
      <div className="field"><label htmlFor="title">모임 이름 <b aria-hidden="true">*</b></label><input id="title" name="title" value={values.title} onChange={(event) => update('title', event.target.value)} placeholder="모임의 이름을 지어 주세요" maxLength={120} required disabled={pending} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined}/>{fieldError('title')}</div>
      <div className="field"><label htmlFor="bookId">함께 읽을 책 <b aria-hidden="true">*</b></label><select id="bookId" name="bookId" value={values.bookId} onChange={(event) => update('bookId', event.target.value)} required disabled={pending || booksLoading || !!booksError} aria-invalid={!!errors.bookId} aria-describedby={errors.bookId ? 'bookId-error' : undefined}><option value="">{booksLoading ? '책을 불러오는 중…' : '책을 선택해 주세요'}</option>{books.map((book) => <option key={book.id} value={book.id}>{book.title} · {book.author}</option>)}</select>{fieldError('bookId')}</div>
      {booksError && <div className="category-error" role="alert"><p>{booksError}</p><button className="text-link" type="button" onClick={() => setAttempt((value) => value + 1)}>책 다시 불러오기 <ArrowIcon/></button></div>}
      <div className="form-row meeting-form-row"><div className="field"><label htmlFor="startsAt">모임 일시 <b aria-hidden="true">*</b></label><input id="startsAt" name="startsAt" type="datetime-local" value={values.startsAt} onChange={(event) => update('startsAt', event.target.value)} required disabled={pending} aria-invalid={!!errors.startsAt} aria-describedby={errors.startsAt ? 'startsAt-error' : 'time-hint'}/><p className="field-hint" id="time-hint">한국 시간 기준입니다.</p>{fieldError('startsAt')}</div><div className="field"><label htmlFor="capacity">정원 <b aria-hidden="true">*</b></label><div className="number-unit"><input id="capacity" name="capacity" type="number" inputMode="numeric" min={1} max={50} step={1} value={values.capacity} onChange={(event) => update('capacity', event.target.value)} required disabled={pending} aria-invalid={!!errors.capacity} aria-describedby={errors.capacity ? 'capacity-error' : 'capacity-hint'}/><span>명</span></div><p className="field-hint" id="capacity-hint">1~50명까지 정할 수 있어요.</p>{fieldError('capacity')}</div></div>
      <div className="field"><label htmlFor="location">만날 장소 <b aria-hidden="true">*</b></label><input id="location" name="location" value={values.location} onChange={(event) => update('location', event.target.value)} placeholder="가상의 모임 장소" maxLength={200} required disabled={pending} aria-invalid={!!errors.location} aria-describedby={errors.location ? 'location-error' : undefined}/>{fieldError('location')}</div>
      <div className="field"><label htmlFor="description">모임 소개 <span className="optional">선택</span></label><textarea id="description" name="description" value={values.description} onChange={(event) => update('description', event.target.value)} placeholder="어떤 질문과 생각을 함께 나누고 싶나요?" maxLength={2000} rows={5} disabled={pending} aria-invalid={!!errors.description} aria-describedby={errors.description ? 'description-error' : 'description-hint'}/><div className="field-meta"><span id="description-hint">모임을 간단히 소개해 주세요.</span><span>{values.description.length.toLocaleString()} / 2,000</span></div>{fieldError('description')}</div>
      <div className="form-actions"><Link href="/" className="button button-quiet" aria-disabled={pending} onClick={(event) => { if (pending) event.preventDefault(); }}>취소</Link><button className="button button-primary" type="submit" disabled={pending || booksLoading || !!booksError}>{pending ? <><span className="spinner small"/>등록하는 중…</> : <><PlusIcon/>모임 등록하기</>}</button></div>
    </form></div></div>;
}
