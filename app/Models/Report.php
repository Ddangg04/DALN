<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'reports';

    protected $fillable = [
        'type',
        'data',
        'created_by',
    ];

    protected $casts = [
        'data' => 'array', // Laravel sẽ tự convert JSON <-> array
    ];

    // Nếu bạn muốn tiện ích lấy title nhanh
    public function getTitleAttribute()
    {
        return isset($this->data['title']) ? $this->data['title'] : null;
    }

    // created_by 관계 nếu muốn
    public function author()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }
}
