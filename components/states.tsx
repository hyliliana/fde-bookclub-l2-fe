import { BookIcon } from './icons';
export function LoadingState({ message = '모임을 불러오고 있어요' }: { message?: string }) { return <div className="state-panel loading-state" role="status"><span className="spinner" /><p>{message}</p></div>; }
export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) { return <div className="state-panel" role="alert"><span className="state-symbol"><BookIcon /></span><h2>잠시 모임을 불러오지 못했어요</h2><p>{message}</p><button className="button button-outline" onClick={onRetry}>다시 불러오기</button></div>; }
