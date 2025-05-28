<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HallSeat;

class HallSeatsSeeder extends Seeder
{
    /**
     * Заполнение таблицы
     *
     * @return void
     */
    public function run()
    {
        // Получаем список залов
        $halls = \App\Models\CinemaHall::all();

        foreach ($halls as $hall) {
            // Добавляем кресла для каждого зала
            for ($i = 1; $i <= $hall->total_rows; $i++) {
                for ($j = 1; $j <= $hall->total_seats_per_row; $j++) {
                    HallSeat::create([
                        'cinema_hall_id' => $hall->id,
                        'row_number' => $i,
                        'seat_number' => $j,
                        'seat_type_id' => rand(1, 2), // Предположим, что есть 3 типа кресел
                    ]);
                }
            }
        }
    }
}