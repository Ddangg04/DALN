<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $fillable = [
        'id',
        'name',
        'type',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function districts()
    {
        return $this->hasMany(District::class);
    }
}
