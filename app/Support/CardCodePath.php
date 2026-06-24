<?php

namespace App\Support;

class CardCodePath
{
    public const PATTERN = '#^/[A-Za-z0-9]{6,8}$#';

    public static function isCardCodePath(?string $path): bool
    {
        return is_string($path) && preg_match(self::PATTERN, $path) === 1;
    }

    public static function codeFromPath(string $path): string
    {
        return strtoupper(ltrim($path, '/'));
    }

    public static function pathForCode(string $code): string
    {
        return '/'.strtoupper($code);
    }
}
