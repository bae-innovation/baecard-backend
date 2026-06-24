import { ImagePlus, Trash2 } from 'lucide-react';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resolveUserAvatarUrl } from '@/features/account/lib/user-avatar';
import { showMutationError } from '@/lib/mutation-toast';
import { cn } from '@/lib/utils';

const AVATAR_ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,.png,.jpg,.jpeg,.gif,.webp';
const AVATAR_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

type ProfileAvatarFieldProps = {
  user: {
    name: string;
    avatar_url?: string | null;
    avatar?: string | null;
  };
  avatarFile: File | null;
  removeAvatar: boolean;
  onAvatarFileChange: (file: File | null) => void;
  onRemoveAvatarChange: (remove: boolean) => void;
  disabled?: boolean;
  className?: string;
};

function userInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function isAcceptedFile(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

  return AVATAR_EXTENSIONS.includes(extension);
}

export function ProfileAvatarField({
  user,
  avatarFile,
  removeAvatar,
  onAvatarFileChange,
  onRemoveAvatarChange,
  disabled = false,
  className,
}: ProfileAvatarFieldProps) {
  const currentUrl = resolveUserAvatarUrl(user);
  const [preview, setPreview] = React.useState<string | null>(currentUrl ?? null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (avatarFile) {
      return;
    }

    setPreview(removeAvatar ? null : (currentUrl ?? null));
  }, [avatarFile, currentUrl, removeAvatar]);

  React.useEffect(() => {
    if (!avatarFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  const hasPhoto = Boolean(preview);

  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center', className)}>
      <Avatar className="size-24 rounded-2xl border-4 border-background shadow-md">
        <AvatarImage src={preview ?? undefined} alt={user.name} />
        <AvatarFallback className="rounded-2xl text-xl font-semibold">
          {userInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <Label>Profile photo</Label>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a square image. JPG, PNG, GIF, or WebP up to 5 MB.
          </p>
        </div>

        <Input
          ref={inputRef}
          type="file"
          accept={AVATAR_ACCEPT}
          disabled={disabled}
          className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;

            if (file && !isAcceptedFile(file)) {
              event.target.value = '';
              onAvatarFileChange(null);
              onRemoveAvatarChange(false);
              showMutationError(
                null,
                `Please choose a supported file type: ${AVATAR_EXTENSIONS.join(', ')}`,
              );
              return;
            }

            onAvatarFileChange(file);
            onRemoveAvatarChange(false);
          }}
        />

        <div className="flex flex-wrap gap-2">
          {hasPhoto ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => {
                onAvatarFileChange(null);
                onRemoveAvatarChange(true);
                if (inputRef.current) {
                  inputRef.current.value = '';
                }
              }}
            >
              <Trash2 className="mr-2 size-4" />
              Remove photo
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImagePlus className="size-4" />
              No photo uploaded yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
