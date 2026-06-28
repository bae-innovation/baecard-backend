import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useActionHub } from '@frontend/hooks/use-action-hub';
import { submitAppointment } from '@frontend/lib/marketing-api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

export function AppointmentForm() {
  const { closeHub } = useActionHub();
  const [submitting, setSubmitting] = React.useState(false);

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
      toast.success('Appointment request submitted.');
      form.reset();
      closeHub();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not book appointment.');
    } finally {
      setSubmitting(false);
    }
  }

  const minDateTime = format(new Date(Date.now() + 3600000), "yyyy-MM-dd'T'HH:mm");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="appt-name">Full name</Label>
        <Input id="appt-name" {...form.register('guest_name')} className="bg-white/5 border-white/20" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="appt-phone">Mobile</Label>
        <Input
          id="appt-phone"
          placeholder="01XXXXXXXXX"
          {...form.register('guest_phone')}
          className="bg-white/5 border-white/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="appt-email">Email (optional)</Label>
        <Input
          id="appt-email"
          type="email"
          {...form.register('guest_email')}
          className="bg-white/5 border-white/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="appt-date">Preferred date & time</Label>
        <Input
          id="appt-date"
          type="datetime-local"
          min={minDateTime}
          {...form.register('appointment_date')}
          className="bg-white/5 border-white/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="appt-notes">Notes (optional)</Label>
        <Textarea
          id="appt-notes"
          rows={3}
          {...form.register('notes')}
          className="bg-white/5 border-white/20"
        />
      </div>
      <MarketingButton type="submit" variant="solid" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Book appointment
      </MarketingButton>
    </form>
  );
}
