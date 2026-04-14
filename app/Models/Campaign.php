<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'title', 'slug', 'description', 'content', 
        'target_amount', 'raised_amount', 'start_date', 
        'end_date', 'status', 'image_url'
    ];

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function statements()
    {
        return $this->hasMany(Statement::class);
    }
}
