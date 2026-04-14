<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    protected $fillable = [
        'id',
        'name',
        'type',
        'district_id',
        'latitude',
        'longitude',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function activityAreas()
    {
        return $this->hasMany(ActivityArea::class);
    }
}