import type { Metadata } from 'next';
import { MeetingDetailView } from '@/components/meeting-detail';
export const metadata: Metadata = { title: '모임 이야기' };
export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MeetingDetailView id={id} />;
}
