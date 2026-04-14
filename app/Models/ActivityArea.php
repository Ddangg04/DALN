<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class ActivityArea extends Model
{
    protected $fillable = [
        'name',
        'ward_id',
        'latitude',
        'longitude',
        'description',
    ];

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    public function campaigns()
    {
        return $this->belongsToMany(Campaign::class, 'campaign_activity_area');
    }

    public function managers()
    {
        return $this->belongsToMany(User::class, 'user_activity_area')
            ->withPivot('is_active')
            ->withTimestamps();
    }
}