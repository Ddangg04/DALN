<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'tuition_fee_id',
        'amount',
        'payment_method',
        'transaction_id',
        'notes',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function tuitionFee()
    {
        return $this->belongsTo(TuitionFee::class);
    }
}