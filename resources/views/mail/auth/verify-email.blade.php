@extends('mail.layouts.baecard')

@php
    $primaryColor = $appSettings['primary_color'] ?? '#2563eb';
    $appName = $appSettings['name'] ?? config('mail.from.name', 'BAE Card');
@endphp

@section('content')
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
        <tr>
            <td style="width: 48px; height: 48px; border-radius: 50%; background-color: {{ $primaryColor }}1a; text-align: center; vertical-align: middle;">
                <span style="display: inline-block; color: {{ $primaryColor }}; font-size: 22px; line-height: 48px;">&#9993;</span>
            </td>
        </tr>
    </table>

    <p style="margin: 0 0 8px; color: #0f172a; font-size: 18px; font-weight: 600;">
        Hi {{ $name }},
    </p>

    <p style="margin: 0 0 8px; color: #0f172a; font-size: 16px; font-weight: 600;">
        Welcome to {{ $appName }}
    </p>

    <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
        Thanks for signing up. Please confirm your email address to activate your account and get started.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
        <tr>
            <td style="border-radius: 8px; background: linear-gradient(135deg, {{ $primaryColor }} 0%, {{ $primaryColor }}dd 100%);">
                <a href="{{ $url }}"
                   style="display: inline-block; padding: 14px 32px; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                    Verify email address
                </a>
            </td>
        </tr>
    </table>

    <p style="margin: 0 0 16px; color: #64748b; font-size: 13px; line-height: 1.6;">
        This link expires in <strong style="color: #334155;">{{ $expireMinutes }} minutes</strong>. If the button does not work, copy and paste this URL into your browser:
    </p>

    <p style="margin: 0 0 24px; padding: 12px 14px; background-color: #f1f5f9; border-radius: 6px; word-break: break-all;">
        <a href="{{ $url }}" style="color: {{ $primaryColor }}; font-size: 12px; text-decoration: none;">{{ $url }}</a>
    </p>

    <p style="margin: 0; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 13px; line-height: 1.6;">
        Did not create an account? You can safely ignore this email.
    </p>
@endsection
