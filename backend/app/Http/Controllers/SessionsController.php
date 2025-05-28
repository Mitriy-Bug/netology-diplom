<?php

namespace App\Http\Controllers;

use App\Models\Session;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SessionsController extends Controller
{
    public function index(Request $request)
    {
        // Проверяем наличие параметра 'date'
        if ($request->has('date')) {
            $date = $request->input('date');
            // Парсим дату и проверяем валидность
            try {
                $parsed_date = Carbon::parse($date)->format('Y-m-d'); // Преобразуем в формат Y-m-d
                $sessions = Session::with('cinemaHall')->whereDate('start_time', $parsed_date)->get(); // Загружаем данные о зале
            } catch (\Exception $e) {
                // Если произошла ошибка при разборе даты, возвращаем пустой массив
                $sessions = [];
            }
        } else {
            // Если дата не была передана, возвращаем все сессии с залами
            $sessions = Session::with('cinemaHall')->get();
        }
        return response()->json($sessions);
    }

    // Новый метод для получения одной сессии по её ID
    public function show($sessionId)
    {
        // Находим сессию по её ID и загружаем данные о зале
        $session = Session::with('cinemaHall')->findOrFail($sessionId);
        return response()->json($session);
    }

    // метод для получения всех мест в зале для конкретной сессии
    public function getHallSeats($sessionId)
    {
        // Находим сессию по её ID и загружаем данные о местах в зале
        $session = Session::with('cinemaHall.seats')->findOrFail($sessionId);
        // Получаем все места в зале
        $hallSeats = $session->cinemaHall->seats;
        return response()->json($hallSeats);
    }
}