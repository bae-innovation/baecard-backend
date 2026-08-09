<?php

namespace App\Mail;

use App\Services\SettingService;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Support\Facades\Config;

class VerifyEmailMail extends Mailable
{
    public function __construct(
        public string $name,
        public string $url,
        public ?int $expireMinutes = null,
    ) {
        $this->expireMinutes ??= (int) Config::get('auth.verification.expire', 60);
    }

    public function envelope(): Envelope
    {
        $appName = app(SettingService::class)->getAppSettings()['name'];

        return new Envelope(
            subject: 'Verify your '.$appName.' email address',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.auth.verify-email',
            with: [
                'name' => $this->name,
                'url' => $this->url,
                'expireMinutes' => $this->expireMinutes,
            ],
        );
    }
}
