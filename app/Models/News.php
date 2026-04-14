<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title', 'slug', 'summary', 'content', 
        'image_url', 'author_id', 'published_at', 'status'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
