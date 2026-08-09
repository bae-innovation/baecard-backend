import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { usePageBack } from '@/hooks/usePageBack';

type PageBackButtonProps = {
  fallbackHref: string;
  label: string;
  className?: string;
};

export function PageBackButton({ fallbackHref, label, className }: PageBackButtonProps) {
  const goBack = usePageBack(fallbackHref);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={goBack}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </Button>
  );
}
