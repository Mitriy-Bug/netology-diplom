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
            'price' => 200.00,
        ]);
        
        SeatType::create([
            'type' => 'VIP',
            'price' => 400.00,
        ]);
        
        SeatType::create([
            'type' => 'Blocked',
            'price' => 0.00,
        ]);
    }
}