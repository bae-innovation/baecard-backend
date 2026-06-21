import { AlertCircle, Construction } from 'lucide-react';
import { toast } from 'sonner';

type NotImplementedToastOptions = {
  feature?: string;
  message?: string;
  duration?: number;
};

export function featureNotImplemented(options?: NotImplementedToastOptions) {
  const {
    feature = 'Feature',
    message = 'This feature is not implemented yet.',
    duration = 5000,
  } = options || {};

  return toast.warning(
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 font-medium">
        <div className="relative">
          <Construction className="relative z-10 size-5" />
        </div>
        <span>{feature} Not Implemented</span>
      </div>
      <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
        <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <span>{message}</span>
      </div>
    </div>,
    {
      duration,
      className:
        'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/50',
      position: 'bottom-right',
    },
  );
}
