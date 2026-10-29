type IconProps = { className?: string };

export function BookIcon({ className }: IconProps) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5.4C9 3.6 5.5 3.6 2.5 5v14c3-1.4 6.5-1.4 9.5.4 3-1.8 6.5-1.8 9.5-.4V5c-3-1.4-6.5-1.4-9.5.4Z"/><path d="M12 5.4v14M6 8.5h2.5M15.5 8.5H18"/></svg>;
}
export function PlusIcon() {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg>;
}
export function ArrowIcon({ back = false }: { back?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={back ? { transform: 'rotate(180deg)' } : undefined}><path d="M4 10h12m-5-5 5 5-5 5"/></svg>;
}
export function CheckIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="m6.5 10 2.4 2.4 4.8-4.8"/></svg>;
}
