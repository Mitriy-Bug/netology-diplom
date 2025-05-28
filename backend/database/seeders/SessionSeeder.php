<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Session;

class SessionSeeder extends Seeder
{
    public function run()
    {
        //Первый день
        Session::create([
            'film_id' => 1,
            'start_time' => now()->addHours(0),
            'end_time' => now()->addHours(2),
            'cinema_hall_id' => 1,
        ]);

        Session::create([
            'film_id' => 1,
            'start_time' => now()->addHours(2),
            'end_time' => now()->addHours(4),
            'cinema_hall_id' => 1,
        ]);

        Session::create([
            'film_id' => 2,
            'start_time' => now()->addHours(4),
            'end_time' => now()->addHours(6),
            'cinema_hall_id' => 1,
        ]);

        Session::create([
            'film_id' => 2,
            'start_time' => now()->addHours(0),
            'end_time' => now()->addHours(2),
            'cinema_hall_id' => 2,
        ]);

        Session::create([
            'film_id' => 3,
            'start_time' => now()->addHours(2),
            'end_time' => now()->addHours(4),
            'cinema_hall_id' => 2,
        ]);
    
        //Второй день
        Session::create([
            'film_id' => 1,
            'start_time' => now()->addDays(1),
            'end_time' => now()->addDays(1)->addHours(0),
            'cinema_hall_id' => 1,
        ]);

        Session::create([
            'film_id' => 2,
            'start_time' => now()->addDays(1),
            'end_time' => now()->addDays(1)->addHours(0),
            'cinema_hall_id' => 2,
        ]);

        Session::create([
            'film_id' => 3,
            'start_time' => now()->addDays(1)->addHours(2),
            'end_time' => now()->addDays(1)->addHours(4),
            'cinema_hall_id' => 1,
        ]);

        Session::create([
            'film_id' => 3,
            'start_time' => now()->addDays(1)->addHours(4),
            'end_time' => now()->addDays(1)->addHours(6),
            'cinema_hall_id' => 1,
        ]);

        //День 3
        Session::create([
            'film_id' => 1,
            'start_time' => now()->addDays(2),
            'end_time' => now()->addDays(2)->addHours(2),
            'cinema_hall_id' => 1,
        ]);

        Session::create([
            'film_id' => 2,
            'start_time' => now()->addDays(2),
            'end_time' => now()->addDays(2)->addHours(2),
            'cinema_hall_id' => 2,
        ]);

        Session::create([
            'film_id' => 3,
            'start_time' => now()->addDays(2)->addHours(2),
            'end_time' => now()->addDays(2)->addHours(4),
            'cinema_hall_id' => 1,
        ]);

        //День 4
        Session::create([
            'film_id' => 1,
            'start_time' => now()->addDays(3),
            'end_time' => now()->addDays(3)->addHours(2),
            'cinema_hall_id' => 1,
        ]);

        Session::create([
            'film_id' => 2,
            'start_time' => now()->addDays(3),
            'end_time' => now()->addDays(3)->addHours(2),
            'cinema_hall_id' => 2,
        ]);

        Session::create([
            'film_id' => 3,
            'start_time' => now()->addDays(3)->addHours(2),
            'end_time' => now()->addDays(3)->addHours(4),
            'cinema_hall_id' => 1,
        ]);

        
        // Добавляйте больше сессий по мере необходимости...
    }
}