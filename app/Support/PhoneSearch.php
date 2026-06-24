<?php

namespace App\Support;

class PhoneSearch
{
    public static function normalize(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?? '';

        if ($digits === '') {
            return '';
        }

        if (str_starts_with($digits, '880') && strlen($digits) > 10) {
            $digits = substr($digits, 3);
        }

        return ltrim($digits, '0') === '' ? '' : $digits;
    }

    public static function matches(?string $storedPhone, string $searchPhone): bool
    {
        $needle = self::normalize($searchPhone);

        if ($needle === '') {
            return false;
        }

        $stored = self::normalize($storedPhone ?? '');

        if ($stored === '') {
            return false;
        }

        if (str_contains($stored, $needle) || str_contains($needle, $stored)) {
            return true;
        }

        $storedSuffix = substr($stored, -10);
        $needleSuffix = substr($needle, -10);

        return strlen($storedSuffix) >= 10
            && strlen($needleSuffix) >= 10
            && $storedSuffix === $needleSuffix;
    }
}
