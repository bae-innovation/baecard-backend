import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useActionHub } from '@frontend/hooks/use-action-hub';
import { submitContact } from '@frontend/lib/marketing-api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { MarketingButton } from '../ui/marketing-button';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z
    .string()
    .length(11, 'Invalid mobile number')
    .regex(/^01[0-9]{9}$/, 'Invalid mobile number'),
  email: z.string().email('Valid email required'),
  message: z.string().min(1, 'Message is required'),
});

type FormValues = z.infer<typeof schema>;

export function MessageForm() {
  const { closeHub } = useActionHub();
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', email: '', message: '' },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await submitContact({ ...values, subject: 'message' });
      toast.success('Message sent — thanks for reaching out.');
      form.reset();
      closeHub();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not send message.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="msg-name">Full name</Label>
        <Input id="msg-name" {...form.register('name')} className="border-fe-border bg-fe-bg/80 backdrop-blur-sm" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="msg-phone">Mobile</Label>
        <Input
          id="msg-phone"
          placeholder="01XXXXXXXXX"
          {...form.register('phone')}
          className="border-fe-border bg-fe-bg/80 backdrop-blur-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="msg-email">Email</Label>
        <Input
          id="msg-email"
          type="email"
          {...form.register('email')}
          className="border-fe-border bg-fe-bg/80 backdrop-blur-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="msg-body">Message</Label>
        <Textarea
          id="msg-body"
          rows={4}
          {...form.register('message')}
          className="border-fe-border bg-fe-bg/80 backdrop-blur-sm"
        />
      </div>
      <MarketingButton type="submit" variant="solid" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Send message
      </MarketingButton>
    </form>
  );
}
