<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $fillable = [
        'id',
        'name',
        'type',
        'province_id',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function wards()
    {
        return $this->hasMany(Ward::class);
    }
}