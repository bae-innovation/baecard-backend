import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LocalizedField } from '@/features/cms/schemas/cms-entry.schema';

type CmsLocalizedFieldProps = {
  label: string;
  value: LocalizedField;
  onChange: (value: LocalizedField) => void;
  disabled?: boolean;
};

export function asLocalized(value: unknown): LocalizedField {
  if (value && typeof value === 'object' && 'en' in value && 'bn' in value) {
    return value as LocalizedField;
  }
  return { en: '', bn: '' };
}

export function CmsLocalizedField({
  label,
  value,
  onChange,
  disabled,
}: CmsLocalizedFieldProps) {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <Label>{label}</Label>
      <Input
        placeholder="English"
        value={value.en}
        disabled={disabled}
        onChange={(e) => onChange({ ...value, en: e.target.value })}
      />
      <Input
        placeholder="Bengali"
        value={value.bn}
        disabled={disabled}
        onChange={(e) => onChange({ ...value, bn: e.target.value })}
      />
    </div>
  );
}
