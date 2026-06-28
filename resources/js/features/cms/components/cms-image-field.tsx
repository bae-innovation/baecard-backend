import { ImagePlus, Loader2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { uploadCmsMedia } from '@/features/cms/api/cms.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CmsImageFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function CmsImageField({ label, value, onChange, disabled }: CmsImageFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadCmsMedia(file);
      onChange(url);
      toast.success('Image uploaded.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Image URL"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          Upload
        </Button>
      </div>
      {value ? (
        <img src={value} alt="" className="mt-2 h-16 w-16 rounded-md border object-contain" />
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
