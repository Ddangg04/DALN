<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'priority',
        'is_pinned',
        'author_id',
        'published_at',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    protected $with = ['author'];

    // Relationship với User
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    // Scope để lấy announcement đã published
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    // Scope để lấy pinned announcements
    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    // Scope order by priority
    public function scopeByPriority($query)
    {
        return $query->orderByRaw("FIELD(priority, 'high', 'medium', 'low')");
    }
}
