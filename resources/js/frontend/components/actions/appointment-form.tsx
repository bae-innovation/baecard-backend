import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CheckCircle2, Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useActionHub } from '@frontend/hooks/use-action-hub';
import { submitAppointment } from '@frontend/lib/marketing-api';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { MarketingButton } from '../ui/marketing-button';

const schema = z.object({
  guest_name: z.string().min(1, 'Name is required'),
  guest_phone: z
    .string()
    .length(11, 'Invalid mobile number')
    .regex(/^01[0-9]{9}$/, 'Invalid mobile number'),
  guest_email: z.string().email().optional().or(z.literal('')),
  appointment_date: z.string().min(1, 'Date and time required'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type AppointmentFormProps = {
  variant?: 'drawer' | 'page';
};

export function AppointmentForm({ variant = 'drawer' }: AppointmentFormProps) {
  const isPage = variant === 'page';
  const { closeHub } = useActionHub();
  const { translate } = useMarketingContent();
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      guest_name: '',
      guest_phone: '',
      guest_email: '',
      appointment_date: '',
      notes: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await submitAppointment({
        guest_name: values.guest_name,
        guest_phone: values.guest_phone,
        guest_email: values.guest_email || undefined,
        appointment_date: new Date(values.appointment_date).toISOString(),
        notes: values.notes,
      });
      toast.success(
        translate({
          en: 'Appointment request submitted.',
          bn: 'অ্যাপয়েন্টমেন্ট অনুরোধ জমা হয়েছে।',
        }),
      );
      form.reset();
      if (isPage) {
        setSubmitted(true);
      } else {
        closeHub();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : translate({ en: 'Could not book appointment.', bn: 'অ্যাপয়েন্টমেন্ট বুক করা যায়নি।' }),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const minDateTime = format(new Date(Date.now() + 3600000), "yyyy-MM-dd'T'HH:mm");
  const fieldClass = isPage ? 'border-fe-border bg-fe-bg' : 'border-fe-border bg-fe-bg/80 backdrop-blur-sm';

  if (isPage && submitted) {
    return (
      <div className="space-y-4 py-6 text-center">
        <CheckCircle2 className="mx-auto size-12 text-fe-accent" aria-hidden />
        <h2 className="text-xl font-semibold text-fe-text">
          {translate({ en: 'Request received', bn: 'অনুরোধ গ্রহণ হয়েছে' })}
        </h2>
        <p className="text-fe-muted">
          {translate({
            en: 'We will contact you shortly to confirm your demo.',
            bn: 'ডেমো নিশ্চিত করতে আমরা শীঘ্রই যোগাযোগ করব।',
          })}
        </p>
        <MarketingButton variant="outline" className="mt-2" onClick={() => setSubmitted(false)}>
          {translate({ en: 'Book another', bn: 'আরেকটি বুক করুন' })}
        </MarketingButton>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="appt-name">{translate({ en: 'Full name', bn: 'পুরো নাম' })}</Label>
        <Input
          id="appt-name"
          {...form.register('guest_name')}
          className={cn(fieldClass, form.formState.errors.guest_name && 'border-destructive')}
        />
        {form.formState.errors.guest_name ? (
          <p className="text-sm text-destructive">{form.formState.errors.guest_name.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="appt-phone">{translate({ en: 'Mobile', bn: 'মোবাইল' })}</Label>
        <Input
          id="appt-phone"
          placeholder="01XXXXXXXXX"
          {...form.register('guest_phone')}
          className={cn(fieldClass, form.formState.errors.guest_phone && 'border-destructive')}
        />
        {form.formState.errors.guest_phone ? (
          <p className="text-sm text-destructive">{form.formState.errors.guest_phone.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="appt-email">{translate({ en: 'Email (optional)', bn: 'ইমেইল (ঐচ্ছিক)' })}</Label>
        <Input
          id="appt-email"
          type="email"
          {...form.register('guest_email')}
          className={fieldClass}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="appt-date">
          {translate({ en: 'Preferred date & time', bn: 'পছন্দের তারিখ ও সময়' })}
        </Label>
        <Input
          id="appt-date"
          type="datetime-local"
          min={minDateTime}
          {...form.register('appointment_date')}
          className={cn(fieldClass, form.formState.errors.appointment_date && 'border-destructive')}
        />
        {form.formState.errors.appointment_date ? (
          <p className="text-sm text-destructive">{form.formState.errors.appointment_date.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="appt-notes">{translate({ en: 'Notes (optional)', bn: 'নোট (ঐচ্ছিক)' })}</Label>
        <Textarea id="appt-notes" rows={3} {...form.register('notes')} className={fieldClass} />
      </div>
      <MarketingButton type="submit" variant="solid" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {translate({ en: 'Book appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' })}
      </MarketingButton>
    </form>
  );
}
