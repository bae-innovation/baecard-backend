<?php

namespace App\Models;

use App\Exceptions\MailDeliveryException;
use App\Mail\VerifyEmailMail;
use App\Support\EmailVerification;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * Spatie Permission guard — API uses Sanctum.
     */
    protected $guard_name = 'sanctum';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'avatar_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Send the email verification notification.
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->sendVerificationEmail(raiseOnFailure: true);
    }

    /**
     * Send the verification email.
     */
    public function sendVerificationEmail(bool $raiseOnFailure = true): bool
    {
        try {
            Mail::to($this->getEmailForVerification())->send(new VerifyEmailMail(
                name: $this->name ?? 'there',
                url: EmailVerification::signedUrl($this),
                expireMinutes: (int) Config::get('auth.verification.expire', 60),
            ));

            return true;
        } catch (TransportExceptionInterface $exception) {
            report($exception);

            if ($raiseOnFailure) {
                throw new MailDeliveryException(
                    EmailVerification::deliveryFailureMessage($exception),
                    previous: $exception,
                );
            }

            return false;
        }
    }

    public function getAvatarUrlAttribute(): ?string
    {
        if (! $this->avatar) {
            return null;
        }

        return asset($this->avatar);
    }

    public function profile(): HasOne
    {
        return $this->hasOne(CustomerProfile::class);
    }

    public function ensureProfile(): CustomerProfile
    {
        return $this->profile()->firstOrCreate(
            ['user_id' => $this->id],
            ['active_template' => 1],
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toAuthArray(): array
    {
        $profile = $this->relationLoaded('profile')
            ? $this->profile
            : $this->profile()->first();

        return array_merge($this->toArray(), [
            'bio' => $profile?->bio,
            'job_title' => $profile?->job_title,
            'company' => $profile?->company,
            'active_template' => $profile?->active_template ?? 1,
            'profile_visibility' => $profile?->profile_visibility,
            'template_settings' => $profile?->template_settings,
        ]);
    }

    public function cardCode(): HasOne
    {
        return $this->hasOne(CardCode::class);
    }

    public function customerSocials(): HasMany
    {
        return $this->hasMany(CustomerSocial::class, 'customer_id');
    }

    public function userServices(): HasMany
    {
        return $this->hasMany(UserService::class)->orderBy('sort_order');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'customer_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}