<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class TestMailCommand extends Command
{
    protected $signature = 'mail:test {email : The recipient email address}';

    protected $description = 'Send a plain test email using the configured mail driver';

    public function handle(): int
    {
        $email = (string) $this->argument('email');
        $driver = (string) config('mail.default');

        $this->info("Mail driver: {$driver}");
        $this->info('SMTP host: '.config('mail.mailers.smtp.host'));
        $this->info('From: '.config('mail.from.address'));

        try {
            Mail::raw('This is a plain test email from '.config('app.name', 'BAE Card').'.', function ($message) use ($email) {
                $message->to($email)->subject(config('app.name', 'BAE Card').' mail test');
            });

            if ($driver === 'log') {
                $this->warn('Driver is "log" — the message was written to storage/logs/laravel.log, not your inbox.');
            } else {
                $this->info('Test email sent successfully.');
            }

            return self::SUCCESS;
        } catch (TransportExceptionInterface $exception) {
            $this->error('Mail delivery failed.');
            $this->line($exception->getMessage());

            if (str_contains($exception->getMessage(), 'Disabled by user from hPanel')) {
                $this->newLine();
                $this->warn('Enable outbound email in Hostinger hPanel:');
                $this->line('1. hPanel → Emails → Manage admin@baecard.info');
                $this->line('2. Make sure the mailbox is active and SMTP is enabled');
                $this->line('3. Set MAIL_MAILER=smtp in .env and run: php artisan config:clear');
            }

            return self::FAILURE;
        }
    }
}
