<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TuitionFee extends Model
{
    protected $fillable = [
        'student_id',
        'semester',
        'year',
        'total_amount',
        'paid_amount',
        'remaining_amount',
        'status',
        'due_date',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'due_date' => 'date',
    ];

    protected $with = ['student'];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Update status after payment
    public function updateStatus()
    {
        $this->remaining_amount = $this->total_amount - $this->paid_amount;
        
        if ($this->paid_amount >= $this->total_amount) {
            $this->status = 'paid';
        } elseif ($this->paid_amount > 0) {
            $this->status = 'partial';
        } elseif ($this->due_date < now()) {
            $this->status = 'overdue';
        } else {
            $this->status = 'unpaid';
        }
        
        $this->save();
    }
}
