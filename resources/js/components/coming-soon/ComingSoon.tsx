import { Construction } from 'lucide-react';

import { PageTitle } from '@/components/shared/page-title';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type ComingSoonProps = {
  title?: string;
  description?: string;
};

export function ComingSoon({
  title = 'Coming soon',
  description = 'This section is not implemented yet. Add a feature module and route when you are ready.',
}: ComingSoonProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <PageTitle title={title} icon={Construction} color="amber" />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Work in progress</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" disabled>
            Not available yet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
