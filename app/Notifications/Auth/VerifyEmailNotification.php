<?php

namespace App\Notifications\Auth;

use App\Support\EmailVerification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Config;

class VerifyEmailNotification extends VerifyEmail
{
    public function toMail($notifiable): MailMessage
    {
        $appName = config('app.name', 'BAE Card');
        $expireMinutes = (int) Config::get('auth.verification.expire', 60);

        return (new MailMessage)
            ->subject('Verify your '.$appName.' email address')
            ->greeting('Hello '.($notifiable->name ?? 'there').'!')
            ->line('Thanks for signing up. Please confirm your email address to activate your account.')
            ->action('Verify email address', EmailVerification::signedUrl($notifiable))
            ->line('This link expires in '.$expireMinutes.' minutes.')
            ->line('If you did not create an account, no further action is required.');
    }
}
