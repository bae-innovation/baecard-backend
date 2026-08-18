<x-mail::message>
# Hello {{ $name }}

We received a request to reset the password for your account.

<x-mail::button :url="$url">
Reset password
</x-mail::button>

This link expires in 60 minutes.

If you did not request a password reset, you can ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
