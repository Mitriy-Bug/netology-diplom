<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $fillable = [
        'film_id',
        'start_time',
        'end_time',
        'cinema_hall_id',
    ];

    public function film()
    {
        return $this->belongsTo(Film::class);
    }

    public function cinemaHall()
    {
        return $this->belongsTo(CinemaHall::class);
    }

    public function sessionSeats()
    {
        return $this->hasMany(SessionSeat::class);
    }
}