<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Film;

class FilmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Film::create([
            'title' => 'Звёздные войны XXIII: Атака клонированных клонов',
            'description' => 'Две сотни лет назад малороссийские хутора разоряла шайка нехристей-ляхов во главе с могущественным колдуном.',
            'duration' => 130,
            'origin' => 'США',
            'poster' => 'http://127.0.0.1:8000/api/images/star_wars.jpg',
        ]);

        Film::create([
            'title' => 'Альфа',
            'description' => '20 тысяч лет назад Земля была холодным и неуютным местом, в котором смерть подстерегала человека на каждом шагу.',
            'duration' => 96,
            'origin' => 'Франция',
            'poster' => 'http://127.0.0.1:8000/api/images/alfa.jpg',
        ]);

        Film::create([
            'title' => 'Хищник',
            'description' => 'Самые опасные хищники Вселенной, прибыв из глубин космоса, высаживаются на улицах маленького городка, чтобы начать свою кровавую охоту. Генетически модернизировав себя с помощью ДНК других видов, охотники стали ещё сильнее, умнее и беспощаднее.',
            'duration' => 101,
            'origin' => 'Канада, США',
            'poster' => 'http://127.0.0.1:8000/api/images/predator.jpg',
        ]);

        // Добавьте больше фильмов по мере необходимости...
    }
}