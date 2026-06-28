import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useActionHub } from '@frontend/hooks/use-action-hub';
import { submitContact } from '@frontend/lib/marketing-api';
import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { MotionSection } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().length(11).regex(/^01[0-9]{9}$/),
  job_title: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  card_amount: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CorporateForm() {
  const { openHub } = useActionHub();
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      job_title: '',
      company: '',
      email: '',
      card_amount: '',
      message: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await submitContact({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        message: values.message || 'Corporate quote request',
        subject: 'corporate',
        metadata: {
          job_title: values.job_title,
          company: values.company,
          card_amount: values.card_amount,
        },
      });
      toast.success('Quote request submitted — we will contact you soon.');
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MotionSection id="corporate" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading title="CORPORATE" />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-lg text-white/80">
            <p className="font-bold text-white">Empower Your Team&apos;s Networking: Introducing the BAE CARD</p>
            <p>
              Revolutionize your team&apos;s connections with the <strong>BAE CARD</strong>, the ultimate smart
              business card for visionary companies worldwide.
            </p>
            <p>
              Boost your brand image and stand out from the competition with NFC technology that lets you share
              contact information with a simple tap.
            </p>
            <button
              type="button"
              onClick={() => openHub('message')}
              className="text-sm text-[#66FCF1] underline-offset-4 hover:underline"
            >
              Quick message instead?
            </button>
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm md:p-8"
          >
            <h3 className="mb-6 text-center font-semibold">To Get a Quote Please fill out the Form</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Full Name *</Label>
                <Input {...form.register('name')} className="border-white/20 bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label>Mobile *</Label>
                <Input {...form.register('phone')} placeholder="01XXXXXXXXX" className="border-white/20 bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input {...form.register('job_title')} className="border-white/20 bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input {...form.register('company')} className="border-white/20 bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...form.register('email')} className="border-white/20 bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label>Cards Required</Label>
                <Input {...form.register('card_amount')} className="border-white/20 bg-white/5" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Message</Label>
                <Textarea rows={3} {...form.register('message')} className="border-white/20 bg-white/5" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <MarketingButton type="submit" variant="solid" disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                Submit
              </MarketingButton>
            </div>
          </form>
        </div>
      </div>
    </MotionSection>
  );
}
