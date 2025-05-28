<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeatType extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'price',
    ];

    public function seats()
    {
        return $this->hasMany(HallSeat::class);
    }
}