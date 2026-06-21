import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type OfflineIndicatorProps = {
    className?: string;
    position?: 'top' | 'bottom';
    showRefresh?: boolean;
};

const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0',
};

function useOffline() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleOnline = useCallback(() => {
        setIsOffline(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            timeoutRef.current = null;
        }, 3_000);
    }, []);

    const handleOffline = useCallback(() => {
        setIsOffline(true);
        setIsVisible(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    useEventListener('online', handleOnline);
    useEventListener('offline', handleOffline);

    return { isOffline, isVisible };
}

export function OfflineIndicator({
    className,
    position = 'top',
    showRefresh = true,
}: OfflineIndicatorProps) {
    const { isOffline, isVisible } = useOffline();

    return (
        <AnimatePresence>
            {(isOffline || isVisible) && (
                <motion.div
                    initial={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={cn(
                        'fixed left-0 right-0 z-50 mx-auto flex w-full max-w-md items-center justify-between rounded-lg px-4 py-3 shadow-lg',
                        positionClasses[position],
                        isOffline ? 'bg-rose-200 text-rose-800' : 'bg-sky-200 text-sky-800',
                        position === 'top' ? 'mt-4' : 'mb-4',
                        className,
                    )}
                >
                    <div className="flex items-center space-x-3">
                        {isOffline ? (
                            <WifiOff className="size-5 animate-pulse" />
                        ) : (
                            <Wifi className="size-5" />
                        )}
                        <span className="font-medium">
                            {isOffline ? "You're offline" : "You're back online"}
                        </span>
                    </div>
                    {showRefresh && (
                        <Button
                            size="sm"
                            variant="ghost"
                            disabled={!isOffline}
                            onClick={() => window.location.reload()}
                            className={cn(
                                'h-8',
                                isOffline
                                    ? 'text-rose-800 hover:bg-rose-300/50'
                                    : 'text-sky-800 hover:bg-sky-300/50 disabled:pointer-events-none disabled:opacity-50',
                            )}
                        >
                            <RefreshCw className="mr-2 size-4" />
                            Refresh
                        </Button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
