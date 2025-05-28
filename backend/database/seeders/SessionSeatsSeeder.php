<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SessionSeat;
use App\Models\Session;
use App\Models\HallSeat;

class SessionSeatsSeeder extends Seeder
{
    public function run()
    {
        try {
            // Получаем список сеансов
            $sessions = Session::all();

            foreach ($sessions as $session) {
                // Получаем список кресел для текущего зала
                $seats = HallSeat::where('cinema_hall_id', $session->cinema_hall_id)->get();

                foreach ($seats as $seat) {
                    SessionSeat::create([
                        'session_id' => $session->id,
                        'hall_seat_id' => $seat->id,
                        'row_number' => $seat->row_number, // Используем значения из HallSeat
                        'seat_number' => $seat->seat_number, // Используем значения из HallSeat
                        'is_booked' => false,
                    ]);
                }
            }
        } catch (\Exception $e) {
            dd($e->getTraceAsString()); // Для вывода стека трассировки
        }
    }
}