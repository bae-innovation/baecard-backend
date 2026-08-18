<?php

namespace App\Support;

class MailConfig
{
    public static function driver(): string
    {
        return (string) config('mail.default', 'log');
    }

    public static function usesLogDriver(): bool
    {
        return self::driver() === 'log';
    }

    /**
     * Show clickable auth links in the UI when mail is not delivered to a real inbox.
     */
    public static function shouldExposeDevLinks(): bool
    {
        return self::usesLogDriver();
    }

    public static function resetPasswordUrl(string $token, string $email): string
    {
        return route('password.reset', [
            'token' => $token,
            'email' => $email,
        ]);
    }

    /**
     * @return array{driver: string, usesLogDriver: bool, exposeDevLinks: bool}
     */
    public static function inertiaMeta(): array
    {
        return [
            'driver' => self::driver(),
            'usesLogDriver' => self::usesLogDriver(),
            'exposeDevLinks' => self::shouldExposeDevLinks(),
        ];
    }
}
