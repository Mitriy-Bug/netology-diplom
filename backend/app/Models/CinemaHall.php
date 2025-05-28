<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CinemaHall extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'total_rows',
        'total_seats_per_row',
    ];

    public function seats()
    {
        return $this->hasMany(HallSeat::class);
    }

    public function sessions()
    {
        return $this->hasMany(Session::class);
    }
}