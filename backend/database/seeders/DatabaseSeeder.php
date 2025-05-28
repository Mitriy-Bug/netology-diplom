<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            FilmSeeder::class,
            CinemaHallsSeeder::class,
            SeatTypesSeeder::class,
            HallSeatsSeeder::class,           
            SessionSeeder::class,            
            //SessionSeatsSeeder::class,                       
        ]);
    }
}