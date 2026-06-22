<?php

namespace App\Mail;

use App\Services\SettingService;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ResetPasswordMail extends Mailable
{
    public function __construct(
        public string $token,
        public string $email,
        public string $name,
    ) {}

    public function envelope(): Envelope
    {
        $appName = app(SettingService::class)->getAppSettings()['name'];

        return new Envelope(
            subject: 'Reset your '.$appName.' password',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.auth.reset-password',
            with: [
                'name' => $this->name,
                'url' => url('/api/auth/reset-password?token=' . $this->token . '&email=' . urlencode($this->email)),
            ],
        );
    }
}
