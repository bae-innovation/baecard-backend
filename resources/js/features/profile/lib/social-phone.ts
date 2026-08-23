import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js/mobile';

import type { ProfilePlatform } from '@/features/profile/schemas/profile-social.schema';

export const PHONE_SOCIAL_PLATFORMS = ['whatsapp', 'telegram', 'viber'] as const;

export type PhoneSocialPlatform = (typeof PHONE_SOCIAL_PLATFORMS)[number];

export const DEFAULT_PHONE_COUNTRY: CountryCode = 'BD';

export function isPhoneSocialPlatform(
  platform: ProfilePlatform,
): platform is PhoneSocialPlatform {
  return (PHONE_SOCIAL_PLATFORMS as readonly string[]).includes(platform);
}

export type CountryCallingCodeOption = {
  country: CountryCode;
  callingCode: string;
  label: string;
  searchValue: string;
};

const PRIORITY_COUNTRIES: CountryCode[] = ['BD', 'US', 'GB', 'IN', 'AE', 'SA', 'CA', 'AU'];

let countryOptions: CountryCallingCodeOption[] | null = null;

export function getCountryCallingCodeOptions(): CountryCallingCodeOption[] {
  if (countryOptions) {
    return countryOptions;
  }

  const names = new Intl.DisplayNames(['en'], { type: 'region' });
  const priority = new Map(PRIORITY_COUNTRIES.map((country, index) => [country, index]));

  countryOptions = getCountries()
    .map((country) => {
      const callingCode = getCountryCallingCode(country);
      const label = names.of(country) ?? country;

      return {
        country,
        callingCode,
        label,
        searchValue: `${country} ${label} +${callingCode} ${callingCode}`.toLowerCase(),
      };
    })
    .sort((left, right) => {
      const leftPriority = priority.get(left.country) ?? Number.MAX_SAFE_INTEGER;
      const rightPriority = priority.get(right.country) ?? Number.MAX_SAFE_INTEGER;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      return left.label.localeCompare(right.label);
    });

  return countryOptions;
}

export function isCountryCode(value: string | undefined): value is CountryCode {
  return Boolean(value && getCountries().includes(value as CountryCode));
}

export function toCountryCode(value: string | undefined): CountryCode {
  return isCountryCode(value) ? value : DEFAULT_PHONE_COUNTRY;
}

function extractPhoneCandidate(value: string): string {
  const trimmed = decodeURIComponent(value.trim());

  if (!trimmed) {
    return '';
  }

  const whatsappMatch = trimmed.match(/wa\.me\/(\+?\d+)/i);
  if (whatsappMatch?.[1]) {
    return whatsappMatch[1].startsWith('+') ? whatsappMatch[1] : `+${whatsappMatch[1]}`;
  }

  const telegramMatch = trimmed.match(/t\.me\/\+?(\d+)/i);
  if (telegramMatch?.[1]) {
    return `+${telegramMatch[1]}`;
  }

  const viberMatch = trimmed.match(/number=([^&]+)/i);
  if (viberMatch?.[1]) {
    return decodeURIComponent(viberMatch[1]);
  }

  if (trimmed.startsWith('+') || /^\d{8,15}$/.test(trimmed.replace(/\D/g, ''))) {
    const digits = trimmed.replace(/\D/g, '');
    return trimmed.startsWith('+') ? `+${digits}` : digits;
  }

  return '';
}

export function parseSocialPhoneValue(value: string): {
  country: CountryCode;
  nationalNumber: string;
} {
  const candidate = extractPhoneCandidate(value);

  if (!candidate) {
    return { country: DEFAULT_PHONE_COUNTRY, nationalNumber: '' };
  }

  const parsed =
    parsePhoneNumberFromString(candidate) ??
    parsePhoneNumberFromString(candidate.replace(/\D/g, ''), DEFAULT_PHONE_COUNTRY);

  if (!parsed) {
    return { country: DEFAULT_PHONE_COUNTRY, nationalNumber: '' };
  }

  return {
    country: parsed.country ?? DEFAULT_PHONE_COUNTRY,
    nationalNumber: parsed.nationalNumber,
  };
}

export function validateMobileNumber(
  country: string | undefined,
  nationalNumber: string | undefined,
): string | true {
  const digits = (nationalNumber ?? '').replace(/\D/g, '');

  if (!digits) {
    return 'Enter a mobile number';
  }

  const parsed = parsePhoneNumberFromString(digits, toCountryCode(country));

  if (!parsed?.isValid()) {
    return 'Enter a valid mobile number';
  }

  const type = parsed.getType();

  if (type && type !== 'MOBILE' && type !== 'FIXED_LINE_OR_MOBILE') {
    return 'Enter a mobile number';
  }

  return true;
}

export function buildPhonePlatformUrl(
  platform: PhoneSocialPlatform,
  country: string | undefined,
  nationalNumber: string | undefined,
): string {
  const digits = (nationalNumber ?? '').replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  const countryCode = toCountryCode(country);
  const parsed = parsePhoneNumberFromString(digits, countryCode);
  const e164 = parsed?.number ?? `+${getCountryCallingCode(countryCode)}${digits}`;
  const internationalDigits = e164.replace(/\D/g, '');

  if (platform === 'whatsapp') {
    return `https://wa.me/${internationalDigits}`;
  }

  if (platform === 'telegram') {
    return `https://t.me/+${internationalDigits}`;
  }

  return `viber://chat?number=${encodeURIComponent(e164.startsWith('+') ? e164 : `+${internationalDigits}`)}`;
}
