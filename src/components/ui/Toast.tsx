import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { classNames } from '../../lib/format';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };
type ToastState = { toasts: Toast[]; push: (message: string, type?: Toast['type']) => void; dismiss: (id: number) => void };

const ToastContext = createContext<ToastState | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message: string, type: Toast['type'] = 'success') => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, type }]);
      window.setTimeout(() => dismiss(id), 3200);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const icons = {
    success: <CheckCircle2 size={18} className="text-success-500" />,
    error: <XCircle size={18} className="text-error-500" />,
    info: <Info size={18} className="text-ink-500" />,
  };
  return (
    <div
      role="alert"
      className={classNames(
        'pointer-events-auto flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-lift animate-scale-in dark:border-ink-700 dark:bg-ink-900',
      )}
    >
      {icons[toast.type]}
      <p className="text-sm text-ink-800 dark:text-ink-100">{toast.message}</p>
      <button onClick={onDismiss} className="ml-2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200" aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast(): ToastState {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
