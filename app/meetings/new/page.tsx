import type { Metadata } from 'next';
import { MeetingForm } from '@/components/meeting-form';
export const metadata: Metadata = { title: '새 모임 등록' };
export default function NewMeetingPage() { return <MeetingForm />; }
