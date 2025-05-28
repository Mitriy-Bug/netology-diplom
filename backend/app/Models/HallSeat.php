<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HallSeat extends Model
{
    use HasFactory;

    protected $fillable = [
        'cinema_hall_id',
        'row_number',
        'seat_number',
        'seat_type_id',
    ];

    public function cinemaHall()
    {
        return $this->belongsTo(CinemaHall::class);
    }

    public function seatType()
    {
        return $this->belongsTo(SeatType::class);
    }

    public function sessionSeats()
    {
        return $this->hasMany(SessionSeat::class);
    }
}