<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Donation extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id', 'campaign_id', 'amount', 'payment_method', 
        'transaction_id', 'status', 'donor_name', 
        'donor_email', 'message', 'is_anonymous'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}
