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
            return 'Email could not be sent from this machine. Hostinger SMTP works on your production server (sogaimpact.com), not from localhost. Use the verify link on this page, or test on production.';
        }

        if (config('mail.default') === 'log') {
            return 'Mail is set to log mode, so nothing is sent to your inbox. Set MAIL_MAILER=smtp in .env after enabling Hostinger SMTP.';
        }

        return 'We could not send the verification email. Check your mail settings and try again.';
    }
}
