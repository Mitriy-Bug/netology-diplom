<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionSeat extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'hall_seat_id',
        'row_number',
        'seat_number',
        'is_booked',
    ];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }

    public function hallSeat()
    {
        return $this->belongsTo(HallSeat::class);
    }
}
