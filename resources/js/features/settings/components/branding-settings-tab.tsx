import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateSettingsGroup } from '@/features/settings/api/settings.api';
import {
  SettingsFormActions,
  SettingsFormSection,
} from '@/features/settings/components/settings-form-section';
import {
  brandingSettingsSchema,
  type BrandingSettings,
  type BrandingSettingsFormValues,
} from '@/features/settings/schemas/settings.schema';
import { cn } from '@/lib/utils';
import { messageFromLaravelResponseBody } from '@/lib/laravel-validation-message';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import { toast } from 'sonner';

type BrandingSettingsTabProps = {
  settings: BrandingSettings;
};

type LogoFieldKey = 'logo_white' | 'logo_black' | 'admin_logo';

const LOGO_ACCEPT =
  'image/png,image/jpeg,image/gif,image/webp,image/svg+xml,.png,.jpg,.jpeg,.gif,.webp,.svg';

const LOGO_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

function isAcceptedFile(file: File, extensions: string[]): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

  return extensions.includes(extension);
}

function ImageUploadField({
  label,
  description,
  currentUrl,
  previewClassName,
  accept,
  allowedExtensions,
  onChange,
}: {
  label: string;
  description: string;
  currentUrl?: string | null;
  previewClassName?: string;
  accept: string;
  allowedExtensions?: string[];
  onChange: (file: File | null) => void;
}) {
  const [preview, setPreview] = React.useState<string | null>(currentUrl ?? null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreview(currentUrl ?? null);
  }, [currentUrl]);

  React.useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <Label>{label}</Label>
      <div
        className={cn(
          'mx-auto flex h-28 w-full max-w-[140px] items-center justify-center overflow-hidden rounded-xl border p-3',
          previewClassName ?? 'bg-muted',
        )}
      >
        {preview ? (
          <img src={preview} alt={label} className="max-h-full max-w-full object-contain" />
        ) : (
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;

          if (file && allowedExtensions && !isAcceptedFile(file, allowedExtensions)) {
            event.target.value = '';
            onChange(null);
            setPreview(currentUrl ?? null);
            showMutationError(
              null,
              `Please choose a supported file type: ${allowedExtensions.join(', ')}`,
            );
            return;
          }

          onChange(file);
          if (file) {
            setPreview((current) => {
              if (current?.startsWith('blob:')) {
                URL.revokeObjectURL(current);
              }
              return URL.createObjectURL(file);
            });
          } else {
            setPreview(currentUrl ?? null);
          }
        }}
      />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

const LOGO_FIELDS: {
  key: LogoFieldKey;
  label: string;
  description: string;
  previewClassName?: string;
  accept: string;
  allowedExtensions: string[];
}[] = [
  {
    key: 'logo_white',
    label: 'Logo White',
    description: 'Light logo for dark backgrounds. PNG, JPG, WebP, or SVG. Max 5 MB.',
    previewClassName: 'border-zinc-700 bg-zinc-900',
    accept: LOGO_ACCEPT,
    allowedExtensions: LOGO_EXTENSIONS,
  },
  {
    key: 'logo_black',
    label: 'Logo Black',
    description: 'Dark logo for light backgrounds. PNG, JPG, WebP, or SVG. Max 5 MB.',
    previewClassName: 'border-zinc-200 bg-white',
    accept: LOGO_ACCEPT,
    allowedExtensions: LOGO_EXTENSIONS,
  },
  {
    key: 'admin_logo',
    label: 'Admin Logo',
    description: 'Logo shown in the admin panel. PNG, JPG, WebP, or SVG. Max 5 MB.',
    previewClassName: 'bg-muted',
    accept: LOGO_ACCEPT,
    allowedExtensions: LOGO_EXTENSIONS,
  },
];

export function BrandingSettingsTab({ settings }: BrandingSettingsTabProps) {
  const [processing, setProcessing] = React.useState(false);
  const [files, setFiles] = React.useState<Partial<Record<LogoFieldKey, File | null>>>({});
  const branding = settings ?? { primary_color: '#2563eb' };

  const form = useForm<BrandingSettingsFormValues>({
    resolver: zodResolver(brandingSettingsSchema),
    defaultValues: {
      primary_color: branding.primary_color ?? '#2563eb',
    },
  });

  const setFile = (key: LogoFieldKey, file: File | null) => {
    setFiles((current) => ({ ...current, [key]: file }));
  };

  const onSubmit = (values: BrandingSettingsFormValues) => {
    setProcessing(true);

    const uploadFiles = Object.fromEntries(
      Object.entries(files).filter((entry): entry is [LogoFieldKey, File] => entry[1] instanceof File),
    );

    updateSettingsGroup(
      'branding',
      values,
      uploadFiles,
      {
        onSuccess: () => {
          setFiles({});
          showMutationSuccess('Branding settings saved');
        },
        onError: (errors) => {
          const message =
            messageFromLaravelResponseBody({ errors }) ??
            'Failed to save branding settings';
          toast.error(message);
        },
        onFinish: () => setProcessing(false),
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SettingsFormSection
          title="Logos"
          description="Upload brand assets. Images are stripped of metadata and saved to /public/images/logos/."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {LOGO_FIELDS.map((field) => (
              <ImageUploadField
                key={field.key}
                label={field.label}
                description={field.description}
                previewClassName={field.previewClassName}
                accept={field.accept}
                allowedExtensions={field.allowedExtensions}
                currentUrl={branding[`${field.key}_url` as keyof BrandingSettings] as string | null | undefined}
                onChange={(file) => setFile(field.key, file)}
              />
            ))}
          </div>
        </SettingsFormSection>

        <SettingsFormSection
          title="Brand Color"
          description="Primary accent color used across the public site."
        >
          <FormField
            control={form.control}
            name="primary_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color</FormLabel>
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Input type="color" className="h-10 w-16 cursor-pointer p-1" {...field} />
                  </FormControl>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="#2563eb"
                    className="max-w-[160px]"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </SettingsFormSection>

        <SettingsFormActions isSubmitting={processing} />
      </form>
    </Form>
  );
}
