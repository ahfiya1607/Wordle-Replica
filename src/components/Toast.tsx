import React from 'react';

export interface ToastMessage {
  id: string;
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      id="toasts"
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-max max-w-[90vw]"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-[var(--fg)] text-[var(--bg)] px-4 py-3 rounded font-bold text-sm shadow-lg animate-pop text-center"
        >
          {toast.text}
        </div>
      ))}
    </div>
  );
};
