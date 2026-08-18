<?php

namespace App\Mail;

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
        return new Envelope(
            subject: 'Reset your '.config('app.name', 'BAE Card').' password',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.auth.reset-password',
            with: [
                'name' => $this->name,
                'url' => route('password.reset', [
                    'token' => $this->token,
                    'email' => $this->email,
                ]),
            ],
        );
    }
}
