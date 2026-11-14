'use client';
// Client store: wraps the Repository and re-renders consumers when it changes.
// State lives in the browser (mock adapter), so the app renders after mount to avoid hydration mismatches.
import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { MockRepository, type Repository } from './api/repo';
import { Icon } from '@/components/ui/Icon';

interface UiApi { toast: (msg: string, icon?: string) => void; openModal: (node: ReactNode) => void; closeModal: () => void; confetti: () => void }
const RepoCtx = createContext<Repository | null>(null);
const UiCtx = createContext<UiApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [repo, setRepo] = useState<Repository | null>(null);
  const [toasts, setToasts] = useState<{ id: number; msg: string; icon: string }[]>([]);
  const [modal, setModal] = useState<ReactNode>(null);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    setRepo(MockRepository.load());
    try { const th = localStorage.getItem('nw-theme'); if (th) document.documentElement.dataset.theme = th; } catch { /* ignore */ }
  }, []);
  useEffect(() => { const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setModal(null); addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey); }, []);

  const toast = useCallback((msg: string, icon = 'check') => {
    const id = Date.now() + Math.random(); setToasts((t) => [...t, { id, msg, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const confetti = useCallback(() => { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { setBurst(Date.now()); setTimeout(() => setBurst(0), 3200); } }, []);
  const ui: UiApi = { toast, confetti, openModal: setModal, closeModal: () => setModal(null) };

  if (!repo) return <div className="boot" aria-busy="true"><div className="sk" style={{ width: 56, height: 56, borderRadius: 18 }} /></div>;
  return (
    <RepoCtx.Provider value={repo}>
      <UiCtx.Provider value={ui}>
        {children}
        {modal && (
          <div className="overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
            <div className="modal" role="dialog" aria-modal="true"><div className="grab" />{modal}</div>
          </div>
        )}
        <div className="toast-wrap" aria-live="polite">{toasts.map((t) => <div key={t.id} className="toast" role="status"><Icon name={t.icon} size={18} /><span>{t.msg}</span></div>)}</div>
        {burst ? <Confetti key={burst} /> : null}
      </UiCtx.Provider>
    </RepoCtx.Provider>
  );
}

function Confetti() {
  const colors = ['#0B7A4B', '#F5B301', '#34C285', '#E2572B', '#4F46E5', '#FFFFFF'];
  const [bits] = useState(() => Array.from({ length: 80 }, (_, i) => ({ left: Math.random() * 100, delay: Math.random() * 0.6, rot: Math.random() * 360, c: colors[i % colors.length] })));
  return <div className="confetti" aria-hidden>{bits.map((b, i) => <i key={i} style={{ left: `${b.left}%`, background: b.c, animationDelay: `${b.delay}s`, transform: `rotate(${b.rot}deg)` }} />)}</div>;
}

/** Repository + re-render on every change. */
export function useRepo(): Repository {
  const repo = useContext(RepoCtx);
  if (!repo) throw new Error('useRepo must be used inside <StoreProvider>');
  useSyncExternalStore(repo.subscribe, repo.version, repo.version);
  return repo;
}
export function useUi(): UiApi {
  const ui = useContext(UiCtx);
  if (!ui) throw new Error('useUi must be used inside <StoreProvider>');
  return ui;
}
