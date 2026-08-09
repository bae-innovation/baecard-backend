<?php

namespace App\Notifications\Auth;

use App\Services\SettingService;
use App\Support\EmailVerification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Config;

class VerifyEmailNotification extends VerifyEmail
{
    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $appName = app(SettingService::class)->getAppSettings()['name'];

        return (new MailMessage)
            ->subject('Verify your '.$appName.' email address')
            ->view('mail.auth.verify-email', [
                'name' => $notifiable->name ?? 'there',
                'url' => EmailVerification::signedUrl($notifiable),
                'expireMinutes' => (int) Config::get('auth.verification.expire', 60),
            ]);
    }
}
