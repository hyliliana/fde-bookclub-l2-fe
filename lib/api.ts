export type Book = { id: number; title: string; author: string };
export type Member = { id: number; displayName: string };
export type Meeting = {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  title: string;
  startsAt: string;
  location: string;
  capacity: number;
  description: string;
  activeCount: number;
  remainingSeats: number;
  createdAt: string;
};
export type Registration = { id: number; memberId: number; memberName: string; status: 'active' | 'cancelled'; createdAt: string; canceledAt: string | null };
export type MeetingDetail = Meeting & { registrations: Registration[] };
export type Stats = { totalMeetings: number; activeRegistrations: number; remainingSeats: number };
export type NewMeeting = Pick<Meeting, 'bookId' | 'title' | 'startsAt' | 'location' | 'capacity' | 'description'>;
export type FieldErrors = Partial<Record<keyof NewMeeting | 'memberId', string>>;

export class ApiError extends Error {
  constructor(message: string, public status: number, public fieldErrors: FieldErrors = {}) {
    super(message); this.name = 'ApiError';
  }
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001').replace(/\/+$/, '');
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, cache: 'no-store', signal: AbortSignal.timeout(60000), headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers } });
  } catch {
    throw new ApiError('연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.', 0);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(typeof payload?.message === 'string' ? payload.message : '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.', response.status, payload?.fieldErrors || {});
  if (payload === null) throw new ApiError('내용을 불러오지 못했어요. 다시 시도해 주세요.', response.status);
  return payload as T;
}

export const getBooks = () => request<Book[]>('/books');
export const getMembers = () => request<Member[]>('/members');
export const getMeetings = (search = '') => request<Meeting[]>(`/meetings${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const getMeeting = (id: string) => request<MeetingDetail>(`/meetings/${encodeURIComponent(id)}`);
export const getStats = () => request<Stats>('/stats');
export const createMeeting = (data: NewMeeting) => request<MeetingDetail>('/meetings', { method: 'POST', body: JSON.stringify(data) });
export const register = (id: number, memberId: number) => request<MeetingDetail>(`/meetings/${id}/registrations`, { method: 'POST', body: JSON.stringify({ memberId }) });
export const cancelRegistration = (id: number, memberId: number) => request<MeetingDetail>(`/meetings/${id}/registrations/cancel`, { method: 'POST', body: JSON.stringify({ memberId }) });

export function dateParts(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return { month: '—', day: '—', full: '일시 확인 필요', time: '' };
  return {
    month: new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'long' }).format(date),
    day: new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', day: 'numeric' }).format(date).replace('일', ''),
    full: new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }).format(date),
    time: new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: 'numeric', minute: '2-digit', hour12: true }).format(date),
  };
}
