<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? ($appSettings['email_from_name'] ?? config('mail.from.name', 'BAE Card')) }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f0f4f8; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);">
                    <tr>
                        <td style="background: linear-gradient(135deg, {{ $appSettings['primary_color'] ?? '#1e3a8a' }} 0%, {{ $appSettings['primary_color'] ?? '#2563eb' }} 100%); padding: 28px 32px; text-align: center;">
                            @if (! empty($appSettings['admin_logo_url']))
                                <img src="{{ url($appSettings['admin_logo_url']) }}" alt="{{ $appSettings['name'] ?? 'BAE Card' }}" style="max-height: 48px; max-width: 180px; object-fit: contain;">
                            @else
                                <p style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
                                    {{ $appSettings['email_from_name'] ?? $appSettings['name'] ?? config('mail.from.name', 'BAE Card') }}
                                </p>
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px;">
                            @yield('content')
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 32px 28px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6; text-align: center;">
                                {{ $appSettings['copyright'] ?? '© '.date('Y').' '.($appSettings['name'] ?? config('mail.from.name', 'BAE Card')).'. All rights reserved.' }}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
