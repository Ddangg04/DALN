<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'is_pinned',
        'priority',
        'author_id',
    ];

    public function author()
    {
        return $this->belongsTo(\App\Models\User::class, 'author_id');
    }
}
