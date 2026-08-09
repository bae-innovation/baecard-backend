import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Star } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { submitReview } from '@frontend/lib/marketing-api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().min(1, 'Review is required').max(5000),
});

type FormValues = z.infer<typeof schema>;

export function PublicReviewForm() {
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', rating: 5, body: '' },
  });

  const rating = form.watch('rating');

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await submitReview(values);
      toast.success('Thank you! Your review will appear after approval.');
      form.reset({ name: '', email: '', rating: 5, body: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-lg rounded-2xl border border-fe-border bg-fe-surface/80 p-6 backdrop-blur-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-fe-text">Share your experience</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="review-name">Name</Label>
          <Input
            id="review-name"
            {...form.register('name')}
            className="border-fe-border bg-fe-bg/80"
          />
          {form.formState.errors.name ? (
            <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="review-email">Email</Label>
          <Input
            id="review-email"
            type="email"
            {...form.register('email')}
            className="border-fe-border bg-fe-bg/80"
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>Rating</Label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;
              return (
                <button
                  key={value}
                  type="button"
                  className="fe-touch rounded p-1"
                  onClick={() => form.setValue('rating', value, { shouldValidate: true })}
                  aria-label={`Rate ${value} stars`}
                >
                  <Star
                    className={cn(
                      'size-6',
                      value <= rating ? 'fill-amber-400 text-amber-400' : 'text-fe-muted',
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="review-body">Your review</Label>
          <Textarea
            id="review-body"
            rows={4}
            {...form.register('body')}
            className="border-fe-border bg-fe-bg/80"
          />
          {form.formState.errors.body ? (
            <p className="text-sm text-red-400">{form.formState.errors.body.message}</p>
          ) : null}
        </div>
        <MarketingButton type="submit" disabled={submitting} className="w-full">
          {submitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit review'
          )}
        </MarketingButton>
      </div>
    </form>
  );
}
