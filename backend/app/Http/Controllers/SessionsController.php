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
    public function add(Request $request)
    {
        // Валидация входных данных
        $validatedData = $request->validate([
            'hall_id' => 'required|exists:cinema_halls,id',
            'film_id' => 'required|exists:films,id',
            'session_time' => 'required'
        ]);

        $hallId = $validatedData['hall_id'];
        $filmId = $validatedData['film_id'];
        $sessionTime = Carbon::parse($validatedData['session_time'])->format('Y-m-d H:i:s');

        try {
            // Создаем сеанс
            $session = Session::create([
                'cinema_hall_id' => $hallId,
                'film_id' => $filmId,
                'start_time' => $sessionTime,
                'end_time' => $sessionTime,

            ]);
            return response()->json([
                'success' => true,
                'message' => 'Сеанс успешно добавлен',
                'data' => $session
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Ошибка при добавлении сеанса: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Ошибка при добавлении сеанса: ' . $e->getMessage()
            ], 500);
        }
    }
    public function destroyById($id)
    {
        // Находим зал по его ID
        $session = Session::find($id);

        if ($session) {
            // Удаляем сеанс
            $session->delete();
            // Возвращаем ответ клиенту
            return response()->json(['message' => 'Seance deleted successfully!'], 200);
        } else {
            // Если зал не найден, возвращаем ошибку
            return response()->json(['message' => 'Seance not found!'], 404);
        }
    }
}
