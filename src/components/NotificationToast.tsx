import React, { useEffect } from 'react';

interface NotificationToastProps {
  message: string | null;
  type?: 'info' | 'success' | 'warn';
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type = 'info',
  onDismiss
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const typeStyles = {
    info: 'border-[#38bdf8] text-[#38bdf8]',
    success: 'border-[#4ade80] text-[#4ade80]',
    warn: 'border-[#facc15] text-[#facc15]'
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-50 bg-[#12141f] border ${typeStyles[type]} text-sm px-4 py-2.5 rounded-md shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in`}
    >
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="text-[#7c88a8] hover:text-white text-xs font-mono ml-2 cursor-pointer"
        aria-label="Dismiss message"
      >
        ✕
      </button>
    </div>
  );
};
