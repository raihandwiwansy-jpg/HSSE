<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'name',
        'email',
        'password',
        'role',
        'tempat_lahir',
        'tanggal_lahir',
        'no_hp',
        'departemen',
        'avatar',
        'require_otp_forgot_password',
        'photo_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'tanggal_lahir' => 'date',
        'require_otp_forgot_password' => 'boolean',
    ];

    // Relations
    public function insidens()
    {
        return $this->hasMany(Insiden::class);
    }

    public function gwpPermits()
    {
        return $this->hasMany(GwpPermit::class);
    }

    public function jsa()
    {
        return $this->hasMany(Jsa::class);
    }
}
