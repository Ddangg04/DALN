<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = [
        'enrollment_id',
        'component',
        'score',
        'weight',
        'notes',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'weight' => 'decimal:2',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
}