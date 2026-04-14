<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class News extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'title', 'slug', 'summary', 'content', 
        'image_url', 'author_id', 'published_at', 'status'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
