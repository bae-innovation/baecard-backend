<x-mail::message>
# Hello {{ $name }}

Your BAE Card **{{ $cardCode }}** is ready. Verify your email and set a password to activate your account and publish your profile.

<x-mail::button :url="$verifyUrl">
Verify email address
</x-mail::button>

<x-mail::button :url="$resetPasswordUrl" color="success">
Set your password
</x-mail::button>

Both links expire in 60 minutes.

If you did not expect this email, you can ignore it.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
