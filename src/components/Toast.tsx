import { memo } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
}

/** Memoized toast notification — renders only when message prop changes. */
export const Toast = memo(({ message }: ToastProps) => {
  return (
    <div className="toast">
      <CheckCircle2 color="var(--primary)" size={20} />
      <span>{message}</span>
    </div>
  );
});

Toast.displayName = 'Toast';
