<?php

namespace App\Support;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class EmailVerification
{
    public static function signedUrl(MustVerifyEmail $user): string
    {
        return URL::temporarySignedRoute(
            'verification.verify.web',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $user->getKey(),
                'hash' => sha1($user->getEmailForVerification()),
            ],
        );
    }

    public static function deliveryFailureMessage(\Throwable $exception): string
    {
        $message = $exception->getMessage();

        if (str_contains($message, 'Disabled by user from hPanel')) {
            return 'Email could not be sent because outgoing mail is disabled in Hostinger hPanel. Enable SMTP for admin@baecard.info under Emails, then try again.';
        }

        if (str_contains($message, 'Sender blocked') || str_contains($message, '550 5.7.1')) {
            return 'Email could not be delivered because the sender domain is blocked or lacks proper SPF/DKIM setup. Check baecard.info email authentication in hPanel, then try again.';
        }

        if (config('mail.default') === 'log') {
            return 'Mail is set to log mode. The auth link is shown on screen and written to storage/logs/laravel.log.';
        }

        return 'We could not send the email. Check your mail settings and try again.';
    }
}
