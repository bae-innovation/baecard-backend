<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class CardAccountInviteMail extends Mailable
{
    public function __construct(
        public string $name,
        public string $cardCode,
        public string $cardName,
        public string $verifyUrl,
        public string $resetPasswordUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Activate your '.config('app.name', 'BAE Card').' account',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.auth.card-account-invite',
            with: [
                'name' => $this->name,
                'cardCode' => $this->cardCode,
                'cardName' => $this->cardName,
                'verifyUrl' => $this->verifyUrl,
                'resetPasswordUrl' => $this->resetPasswordUrl,
            ],
        );
    }
}
