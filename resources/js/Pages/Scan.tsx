import { Head } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

import { AppHead } from '@/components/shared/app-head';
import { AppSettingsSync } from '@/components/shared/app-settings-sync';

export default function Scan() {
  return (
    <>
      <AppHead title="Scanning card" />
      <AppSettingsSync />
      <Head title="Scanning card" />
      <div className="flex min-h-svh items-center justify-center bg-background p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <p>Redirecting to your card...</p>
        </div>
      </div>
    </>
  );
}
