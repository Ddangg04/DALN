<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles; // <-- bắt buộc

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles; // <-- thêm HasRoles ở đây

    protected $fillable = [
        'name',
        'email',
        'password',
        // nếu bạn có google_id, role, ...
        'google_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
