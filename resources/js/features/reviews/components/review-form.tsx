import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { FormSection } from '@/components/shared/form-section';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useFilePreviewUrl } from '@/hooks/use-file-preview-url';
import { cn } from '@/lib/utils';
import {
  reviewFormSchema,
  type Review,
  type ReviewFormValues,
} from '@/features/reviews/schemas/review.schema';

export type ReviewFormProps = {
  mode: 'create' | 'edit';
  variant?: 'dialog' | 'page';
  review?: Review | null;
  onSubmit: (values: ReviewFormValues, image?: File | null) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  defaultValues?: Partial<ReviewFormValues>;
  lockName?: boolean;
  lockEmail?: boolean;
};

function FormActions({
  onCancel,
  isSubmitting,
  submitLabel,
  mode,
}: {
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  mode: 'create' | 'edit';
}) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
      {onCancel ? (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      ) : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {submitLabel ?? (mode === 'create' ? 'Create Review' : 'Save Changes')}
      </Button>
    </div>
  );
}

export function ReviewForm({
  mode,
  variant = 'dialog',
  review,
  onSubmit,
  isSubmitting,
  onCancel,
  submitLabel,
  defaultValues,
  lockName = false,
  lockEmail = false,
}: ReviewFormProps) {
  const isPage = variant === 'page';
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [existingPreview, setExistingPreview] = React.useState<string | null>(null);
  const filePreview = useFilePreviewUrl(imageFile);
  const avatarPreview = filePreview ?? existingPreview;

  const createDefaults = React.useMemo(
    (): ReviewFormValues => ({
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      rating: defaultValues?.rating ?? 5,
      title: defaultValues?.title ?? '',
      body: defaultValues?.body ?? '',
      is_visible: defaultValues?.is_visible ?? true,
    }),
    [defaultValues],
  );

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: createDefaults,
  });

  React.useEffect(() => {
    if (mode === 'edit' && review) {
      form.reset({
        name: review.name,
        email: review.email,
        rating: review.rating,
        title: review.title ?? '',
        body: review.body,
        is_visible: review.is_visible,
      });
      setImageFile(null);
      setExistingPreview(review.image_url ?? null);
    } else if (mode === 'create') {
      form.reset(createDefaults);
      setImageFile(null);
      setExistingPreview(null);
    }
  }, [createDefaults, form, mode, review]);

  const imageField = (
    <div className="space-y-2">
      <Label>Reviewer photo</Label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/30 sm:mx-0">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Reviewer preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/avif,.png,.jpg,.jpeg,.webp,.avif"
            disabled={isSubmitting}
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setImageFile(file);
            }}
          />
          <p className="text-xs text-muted-foreground">
            Optional. Shown on the homepage reviews section.
          </p>
        </div>
      </div>
    </div>
  );

  const reviewerFields = (
    <>
      {imageField}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reviewer Name *</FormLabel>
            <FormControl>
              <Input {...field} readOnly={lockName} disabled={lockName || isSubmitting} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input
                type="email"
                {...field}
                readOnly={lockEmail}
                disabled={lockEmail || isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  const reviewFields = (
    <>
      <FormField
        control={form.control}
        name="rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rating (1–5) *</FormLabel>
            <FormControl>
              <Input type="number" min={1} max={5} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="body"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Review *</FormLabel>
            <FormControl>
              <Textarea {...field} rows={5} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  const visibilityField =
    mode === 'edit' ? (
      <FormField
        control={form.control}
        name="is_visible"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Visible</FormLabel>
              <p className="text-xs text-muted-foreground">Show on the storefront</p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    ) : null;

  return (
    <Form {...form}>
      <form
        className={cn(isPage ? 'space-y-6 pb-6' : 'space-y-4')}
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values, imageFile);
        })}
      >
        {isPage ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start xl:gap-8">
              <FormSection title="Reviewer" description="Who wrote this review">
                {reviewerFields}
              </FormSection>
              <div className="space-y-6 md:sticky md:top-4">
                <FormSection title="Review" description="Rating and feedback">
                  {reviewFields}
                </FormSection>
                {visibilityField ? (
                  <FormSection title="Visibility">{visibilityField}</FormSection>
                ) : null}
              </div>
            </div>
            <div className="sticky bottom-0 z-10 mt-8 border-t bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <FormActions
                onCancel={onCancel}
                isSubmitting={isSubmitting}
                submitLabel={submitLabel}
                mode={mode}
              />
            </div>
          </>
        ) : (
          <>
            {reviewerFields}
            {reviewFields}
            {visibilityField}
            <FormActions
              onCancel={onCancel}
              isSubmitting={isSubmitting}
              submitLabel={submitLabel}
              mode={mode}
            />
          </>
        )}
      </form>
    </Form>
  );
}
