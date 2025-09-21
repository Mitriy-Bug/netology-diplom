<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SeatType;

class SeatTypesSeeder extends Seeder
{
    /**
     * Заполнение таблицы
     *
     * @return void
     */
    public function run()
    {
        // Добавляем три типа кресел
        SeatType::create([
            'type' => 'Стандарт',
            'price' => 100.00,
            'id_hall' => 1,
        ]);

        SeatType::create([
            'type' => 'VIP',
            'price' => 200.00,
            'id_hall' => 1,
        ]);
        SeatType::create([
            'type' => 'Стандарт',
            'price' => 100.00,
            'id_hall' => 2,
        ]);

        SeatType::create([
            'type' => 'VIP',
            'price' => 200.00,
            'id_hall' => 2,
        ]);
    }
}
