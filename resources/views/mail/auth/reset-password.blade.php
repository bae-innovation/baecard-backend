@extends('mail.layouts.baecard')

@section('content')
    <p style="margin: 0 0 8px; color: #0f172a; font-size: 18px; font-weight: 600;">
        Hi {{ $name }},
    </p>

    <p style="margin: 0 0 20px; color: #475569; font-size: 15px; line-height: 1.6;">
        We received a request to reset the password for your account. Tap the button below to choose a new password.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
        <tr>
            <td style="border-radius: 8px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
                <a href="{{ $url }}"
                   style="display: inline-block; padding: 14px 28px; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                    Reset my password
                </a>
            </td>
        </tr>
    </table>

    <p style="margin: 0 0 16px; color: #64748b; font-size: 13px; line-height: 1.6;">
        This link expires in <strong style="color: #334155;">60 minutes</strong>. If the button does not work, copy and paste this URL into your browser:
    </p>

    <p style="margin: 0 0 24px; padding: 12px 14px; background-color: #f1f5f9; border-radius: 6px; word-break: break-all;">
        <a href="{{ $url }}" style="color: #2563eb; font-size: 12px; text-decoration: none;">{{ $url }}</a>
    </p>

    <p style="margin: 0; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 13px; line-height: 1.6;">
        Did not request this? You can safely ignore this email — your password will stay the same.
    </p>
@endsection
