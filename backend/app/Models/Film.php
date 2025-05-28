<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Film extends Model
{
    protected $fillable = [
        'title',
        'description',
        'duration',
        'poster'
    ];

    public function sessions()
    {
        return $this->hasMany(Session::class);
    }
}