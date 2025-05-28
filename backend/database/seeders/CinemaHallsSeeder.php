<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CinemaHall;

class CinemaHallsSeeder extends Seeder
{
    /**
     * Заполнение таблицы
     *
     * @return void
     */
    public function run()
    {
        // Добавляем три зала
        CinemaHall::create([
            'name' => '1',
            'total_rows' => 3,
            'total_seats_per_row' => 3,
        ]);
        
        CinemaHall::create([
            'name' => '2',
            'total_rows' => 4,
            'total_seats_per_row' => 4,
        ]);
        
    }
}