import { router } from '@inertiajs/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Loader2, Plus, Trash2, UserRound } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { FormSection } from '@/components/shared/form-section';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlatformIcon } from '@/features/profile/components/platform-icon';
import { PROFILE_CONTENT_PROPS } from '@/features/profile/lib/profile-content-props';
import {
  DEFAULT_PHONE_CODE,
  mergeSocialLinks,
  profileContentFormSchema,
  type ProfileContent,
  type ProfileContentFormValues,
  type ProfileSocialLink,
} from '@/features/profile/schemas/profile-content.schema';
import {
  PLATFORM_LABELS,
  PROFILE_PLATFORMS,
  type ProfilePlatform,
} from '@/features/profile/schemas/profile-social.schema';
import { objectToFormData } from '@/lib/object-to-form-data';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

const PHONE_CODES = ['+880', '+1', '+44', '+91', '+61', '+971'];
const IMAGE_ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,.png,.jpg,.jpeg,.gif,.webp';

type ProfileContentPageProps = {
  profile?: ProfileContent;
};

function displayName(profile?: ProfileContent) {
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim();
  return name || 'there';
}

function PhoneField({
  codeName,
  numberName,
  label,
  form,
}: {
  codeName: 'personal_phone_code' | 'work_phone_code';
  numberName: 'personal_phone' | 'work_phone';
  label: string;
  form: ReturnType<typeof useForm<ProfileContentFormValues>>;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <FormField
          control={form.control}
          name={codeName}
          render={({ field }) => (
            <FormItem className="w-28 shrink-0">
              <Select value={field.value || DEFAULT_PHONE_CODE} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PHONE_CODES.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={numberName}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input {...field} placeholder="Phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function ProfileContentPage({ profile }: ProfileContentPageProps) {
  const [profileImageFile, setProfileImageFile] = React.useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = React.useState<File | null>(null);
  const [removeProfileImage, setRemoveProfileImage] = React.useState(false);
  const [removeCoverImage, setRemoveCoverImage] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const profileInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ProfileContentFormValues>({
    resolver: zodResolver(profileContentFormSchema),
    defaultValues: {
      first_name: profile?.first_name ?? '',
      last_name: profile?.last_name ?? '',
      personal_email: profile?.personal_email ?? '',
      personal_phone_code: profile?.personal_phone_code ?? DEFAULT_PHONE_CODE,
      personal_phone: profile?.personal_phone ?? '',
      personal_address: profile?.personal_address ?? '',
      bio: profile?.bio ?? '',
      company: profile?.company ?? '',
      designation: profile?.designation ?? '',
      work_email: profile?.work_email ?? '',
      work_phone_code: profile?.work_phone_code ?? DEFAULT_PHONE_CODE,
      work_phone: profile?.work_phone ?? '',
      work_address: profile?.work_address ?? '',
      social_links: mergeSocialLinks(profile?.social_links),
    },
  });

  React.useEffect(() => {
    form.reset({
      first_name: profile?.first_name ?? '',
      last_name: profile?.last_name ?? '',
      personal_email: profile?.personal_email ?? '',
      personal_phone_code: profile?.personal_phone_code ?? DEFAULT_PHONE_CODE,
      personal_phone: profile?.personal_phone ?? '',
      personal_address: profile?.personal_address ?? '',
      bio: profile?.bio ?? '',
      company: profile?.company ?? '',
      designation: profile?.designation ?? '',
      work_email: profile?.work_email ?? '',
      work_phone_code: profile?.work_phone_code ?? DEFAULT_PHONE_CODE,
      work_phone: profile?.work_phone ?? '',
      work_address: profile?.work_address ?? '',
      social_links: mergeSocialLinks(profile?.social_links),
    });
    setProfileImageFile(null);
    setCoverImageFile(null);
    setRemoveProfileImage(false);
    setRemoveCoverImage(false);
  }, [form, profile]);

  const bioValue = form.watch('bio') ?? '';
  const socialLinks = form.watch('social_links');

  const profilePreview = profileImageFile
    ? URL.createObjectURL(profileImageFile)
    : removeProfileImage
      ? null
      : profile?.profile_image_url;

  const coverPreview = coverImageFile
    ? URL.createObjectURL(coverImageFile)
    : removeCoverImage
      ? null
      : profile?.cover_image_url;

  React.useEffect(() => {
    return () => {
      if (profileImageFile) {
        URL.revokeObjectURL(profilePreview ?? '');
      }
      if (coverImageFile) {
        URL.revokeObjectURL(coverPreview ?? '');
      }
    };
  }, [coverImageFile, coverPreview, profileImageFile, profilePreview]);

  const updateSocialLink = (index: number, patch: Partial<ProfileSocialLink>) => {
    const next = [...(form.getValues('social_links') ?? [])];
    next[index] = { ...next[index], ...patch };
    form.setValue('social_links', next, { shouldDirty: true });
  };

  const addSocialLink = () => {
    const next = [...(form.getValues('social_links') ?? [])];
    next.push({ platform: 'website', url: '' });
    form.setValue('social_links', next, { shouldDirty: true });
  };

  const removeSocialLink = (index: number) => {
    const next = [...(form.getValues('social_links') ?? [])];
    next.splice(index, 1);
    form.setValue('social_links', next.length > 0 ? next : [{ platform: 'facebook', url: '' }], {
      shouldDirty: true,
    });
  };

  const onSubmit = form.handleSubmit((values) => {
    setIsSubmitting(true);

    const filteredSocialLinks = values.social_links.filter((link) => link.url.trim() !== '');

    router.post(
      '/profile/content',
      objectToFormData(
        {
          ...values,
          social_links: JSON.stringify(filteredSocialLinks),
          ...(removeProfileImage ? { remove_profile_image: '1' } : {}),
          ...(removeCoverImage ? { remove_cover_image: '1' } : {}),
        },
        {
          profile_image: profileImageFile,
          cover_image: coverImageFile,
        },
        'PUT',
      ),
      {
        forceFormData: true,
        preserveScroll: true,
        only: [...PROFILE_CONTENT_PROPS],
        onSuccess: () => {
          showMutationSuccess('Profile saved');
          setProfileImageFile(null);
          setCoverImageFile(null);
          setRemoveProfileImage(false);
          setRemoveCoverImage(false);
        },
        onError: (errors) => {
          const message = Object.values(errors).flat().join(' ');
          void showMutationError(null, message || 'Failed to save profile');
        },
        onFinish: () => setIsSubmitting(false),
      },
    );
  });

  return (
    <FormPageShell
      backTo="/dashboard"
      backLabel="Back"
      title={`Welcome ${displayName(profile)}!`}
      description="Update your personal, professional, and social details for your public Bae Card profile."
      icon={UserRound}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl space-y-6 pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Profile setup
          </p>

          <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="relative h-44 bg-muted sm:h-52">
              {coverPreview ? (
                <img src={coverPreview} alt="" className="h-full w-full object-cover" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
              <div className="absolute right-4 top-4 flex gap-2">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept={IMAGE_ACCEPT}
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setCoverImageFile(file);
                    if (file) {
                      setRemoveCoverImage(false);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-full shadow-sm"
                  onClick={() => coverInputRef.current?.click()}
                >
                  <Camera className="mr-2 size-4" />
                  Edit cover photo
                </Button>
                {coverPreview ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="rounded-full shadow-sm"
                    onClick={() => {
                      setCoverImageFile(null);
                      setRemoveCoverImage(true);
                      if (coverInputRef.current) {
                        coverInputRef.current.value = '';
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="relative px-5 pb-6 sm:px-6">
              <div className="-mt-14 flex items-end gap-4 sm:-mt-16">
                <div className="relative">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt=""
                      className="size-28 rounded-full border-4 border-card object-cover shadow-sm sm:size-32"
                    />
                  ) : (
                    <div className="flex size-28 items-center justify-center rounded-full border-4 border-card bg-muted text-3xl font-semibold text-muted-foreground shadow-sm sm:size-32">
                      {displayName(profile).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept={IMAGE_ACCEPT}
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setProfileImageFile(file);
                      if (file) {
                        setRemoveProfileImage(false);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute bottom-1 right-1 inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
                    onClick={() => profileInputRef.current?.click()}
                    aria-label="Edit profile photo"
                  >
                    <Camera className="size-4" />
                  </button>
                </div>

                {profilePreview ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mb-2"
                    onClick={() => {
                      setProfileImageFile(null);
                      setRemoveProfileImage(true);
                      if (profileInputRef.current) {
                        profileInputRef.current.value = '';
                      }
                    }}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Remove photo
                  </Button>
                ) : null}
              </div>
            </div>
          </section>

          <FormSection
            title="Personal information"
            description="Your name, contact details, and bio."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="personal_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PhoneField
              form={form}
              codeName="personal_phone_code"
              numberName="personal_phone"
              label="Phone"
            />

            <FormField
              control={form.control}
              name="personal_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>About you (bio)</FormLabel>
                    <span className="text-xs text-muted-foreground">{bioValue.length}/255</span>
                  </div>
                  <FormControl>
                    <Textarea {...field} rows={4} maxLength={255} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection
            title="Professional information"
            description="Company, role, and work contact details."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="work_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PhoneField
              form={form}
              codeName="work_phone_code"
              numberName="work_phone"
              label="Phone"
            />

            <FormField
              control={form.control}
              name="work_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection
            title="Social information"
            description="Add the social media links shown on your public card."
          >
            <div className="space-y-3">
              {socialLinks.map((link, index) => (
                <div key={`${link.platform}-${index}`} className="flex items-start gap-3">
                  <div className="flex w-40 shrink-0 items-center gap-2 pt-0.5">
                    <PlatformIcon platform={link.platform} size="sm" />
                    <Select
                      value={link.platform}
                      onValueChange={(value) =>
                        updateSocialLink(index, { platform: value as ProfilePlatform })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROFILE_PLATFORMS.filter(
                          (platform) => platform !== 'phone' && platform !== 'email',
                        ).map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {PLATFORM_LABELS[platform]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    value={link.url}
                    onChange={(event) => updateSocialLink(index, { url: event.target.value })}
                    placeholder={`Enter ${PLATFORM_LABELS[link.platform].toLowerCase()} profile link`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground"
                    onClick={() => removeSocialLink(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" onClick={addSocialLink}>
              <Plus className="mr-2 size-4" />
              Add social link
            </Button>
          </FormSection>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Save profile
            </Button>
          </div>
        </form>
      </Form>
    </FormPageShell>
  );
}
